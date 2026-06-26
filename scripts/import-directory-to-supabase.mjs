#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(scriptDir, "..");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
      mcs_number: row.certificationNumber?.trim() || null,
      bus_registered: row.boilerUpgradeSchemeRegistered === "true",
      services: JSON.stringify(services),
      areas_covered: JSON.stringify(areasCovered),
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
