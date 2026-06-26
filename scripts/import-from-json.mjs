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

const jsonPath = resolve(root, "data/mcscertified-air-source-heat-pump-england.json");
console.log(`Reading ${jsonPath}...`);
const raw = readFileSync(jsonPath, "utf8");
const parsed = JSON.parse(raw);
const installers = parsed.installers;
console.log(`Parsed ${installers.length} installers from JSON`);

const BATCH_SIZE = 50;
let inserted = 0;
let skipped = 0;
const seen = new Set();

for (let i = 0; i < installers.length; i += BATCH_SIZE) {
  const batch = installers.slice(i, i + BATCH_SIZE);
  const records = [];

  for (const json of batch) {
    const companyName = json.companyName?.trim();
    const email = json.email?.trim();
    if (!companyName || !email) {
      skipped++;
      continue;
    }

    let slug = slugify(companyName);
    if (seen.has(slug)) {
      slug = `${slug}-${json.installerId || Math.random().toString(36).slice(2, 6)}`;
    }
    seen.add(slug);

    const category = Array.isArray(json.category) ? json.category : [];
    const regionsCovered = Array.isArray(json.regionsCovered) ? json.regionsCovered : [];

    records.push({
      company_name: companyName,
      slug,
      email,
      phone: json.phone?.trim() || null,
      website: json.website?.trim() || null,
      description: json.address?.trim() || null,
      mcs_installer_id: json.installerId ?? null,
      mcs_number: json.certificationNumber?.trim() || null,
      certification_body: json.certificationBody?.trim() || null,
      bus_registered: json.boilerUpgradeSchemeRegistered ?? false,
      services: JSON.stringify(category),
      areas_covered: JSON.stringify(regionsCovered),
      address_line1: json.addressParts?.line1 ?? null,
      address_line2: json.addressParts?.line2 ?? null,
      address_line3: json.addressParts?.line3 ?? null,
      address_county: json.addressParts?.county ?? null,
      address_postcode: json.addressParts?.postcode ?? null,
      address_country: json.addressParts?.country ?? null,
      source_page: json.sourcePage ?? null,
      type: JSON.stringify(category),
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
    console.log(`Inserted ${inserted}/${installers.length}`);
  }
}

console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
