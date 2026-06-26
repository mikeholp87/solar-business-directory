#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(scriptDir, "..");

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return acc;
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex === -1) return acc;
      const key = trimmed.slice(0, equalsIndex).trim();
      let value = trimmed.slice(equalsIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});
}

const fileEnv = Object.fromEntries(
  [".env.local", ".env.production.local", ".env"]
    .flatMap((f) => Object.entries(parseEnvFile(resolve(root, f))))
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function parseCsv(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

const csvPath = resolve(root, "data/mcscertified-air-source-heat-pump-england-full.csv");
console.log(`Reading ${csvPath}...`);
const csv = readFileSync(csvPath, "utf8");
const rows = parseCsv(csv);
console.log(`Parsed ${rows.length} rows`);

const BATCH_SIZE = 50;
let inserted = 0;
let skipped = 0;
const seen = new Set();

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE);
  const records = [];

  for (const row of rows.slice(i, i + BATCH_SIZE)) {
    const companyName = row.companyName?.trim();
    const email = row.email?.trim();
    if (!companyName || !email) {
      skipped++;
      continue;
    }

    let slug = slugify(companyName);
    if (seen.has(slug)) {
      slug = `${slug}-${row.installerId || Math.random().toString(36).slice(2, 6)}`;
    }
    seen.add(slug);

    const services = row.category
      ? row.category.split("|").map((s) => s.trim()).filter(Boolean)
      : [];

    const type = services.length > 0 ? services[0] : null;

    const areasCovered = row.regionsCovered
      ? row.regionsCovered.split("|").map((s) => s.trim()).filter(Boolean)
      : [];

    records.push({
      company_name: companyName,
      slug,
      email,
      phone: row.phone?.trim() || null,
      website: row.website?.trim() || null,
      description: row.address?.trim() || null,
      mcs_installer_id: row.installerId ? Number(row.installerId) : null,
      mcs_number: row.certificationNumber?.trim() || null,
      certification_body: row.certificationBody?.trim() || null,
      bus_registered: row.boilerUpgradeSchemeRegistered === "true",
      services: JSON.stringify(services),
      areas_covered: JSON.stringify(areasCovered),
      address_line1: row["addressParts.line1"]?.trim() || null,
      address_line2: row["addressParts.line2"]?.trim() || null,
      address_line3: row["addressParts.line3"]?.trim() || null,
      address_county: row["addressParts.county"]?.trim() || null,
      address_postcode: row["addressParts.postcode"]?.trim() || null,
      address_country: row["addressParts.country"]?.trim() || null,
      source_page: row.sourcePage ? Number(row.sourcePage) : null,
      type,
      status: "pending",
      subscription_status: "trialing",
    });
  }

  if (records.length === 0) continue;

  const { data, error } = await supabase
    .from("installers")
    .insert(records)
    .select("id");

  if (error) {
    console.error(`Batch ${i}-${i + records.length} error:`, error.message);
    skipped += records.length;
  } else {
    inserted += data?.length || records.length;
    console.log(`Inserted ${inserted}/${rows.length}`);
  }
}

console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
