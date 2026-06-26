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

const BATCH_SIZE = 50;
let updated = 0;
let offset = 0;

console.log("Fetching installers to populate type field...");

while (true) {
  const { data: rows, error } = await supabase
    .from("installers")
    .select("id, services")
    .range(offset, offset + BATCH_SIZE - 1);

  if (error) {
    console.error("Fetch error:", error.message);
    break;
  }

  if (!rows || rows.length === 0) break;

  const updates = rows
    .filter((row) => Array.isArray(row.services) && row.services.length > 0)
    .map((row) => ({
      id: row.id,
      type: row.services[0],
    }));

  if (updates.length > 0) {
    for (const u of updates) {
      const { error: updateError } = await supabase
        .from("installers")
        .update({ type: u.type })
        .eq("id", u.id);

      if (updateError) {
        console.error(`Update error for ${u.id}:`, updateError.message);
      } else {
        updated++;
      }
    }
  }

  console.log(`Processed ${offset + rows.length} rows, updated ${updated}`);
  offset += BATCH_SIZE;

  if (rows.length < BATCH_SIZE) break;
}

console.log(`\nDone. Updated ${updated} installers with type field.`);
