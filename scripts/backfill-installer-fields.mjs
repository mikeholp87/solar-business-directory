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

const jsonPath = resolve(root, "data/mcscertified-air-source-heat-pump-england.json");
console.log(`Reading ${jsonPath}...`);
const raw = readFileSync(jsonPath, "utf8");
const parsed = JSON.parse(raw);
const jsonInstallers = parsed.installers;
console.log(`Loaded ${jsonInstallers.length} installers from JSON`);

const BATCH_SIZE = 50;
let updated = 0;
let skipped = 0;

for (let i = 0; i < jsonInstallers.length; i += BATCH_SIZE) {
  const batch = jsonInstallers.slice(i, i + BATCH_SIZE);

  for (const json of batch) {
    const installerId = json.installerId;
    if (!installerId) {
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from("installers")
      .update({
        mcs_installer_id: installerId,
        certification_body: json.certificationBody,
        address_line1: json.addressParts?.line1,
        address_line2: json.addressParts?.line2,
        address_line3: json.addressParts?.line3,
        address_county: json.addressParts?.county,
        address_postcode: json.addressParts?.postcode,
        address_country: json.addressParts?.country,
        source_page: json.sourcePage,
        type: Array.isArray(json.category) && json.category.length > 0 ? json.category[0] : null,
      })
      .eq("mcs_number", json.certificationNumber);

    if (error) {
      console.error(`Update error for MCS ${json.certificationNumber}:`, error.message);
      skipped++;
    } else {
      updated++;
    }
  }

  console.log(`Processed ${Math.min(i + BATCH_SIZE, jsonInstallers.length)}/${jsonInstallers.length}, updated ${updated}`);
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
