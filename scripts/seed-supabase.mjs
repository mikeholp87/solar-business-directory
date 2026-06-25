#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(scriptDir, "..");
const sqlFile = resolve(root, "supabase/current-configuration.sql");
const envFiles = [".env.local", ".env.production.local", ".env"];

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
  envFiles.flatMap((file) => Object.entries(parseEnvFile(resolve(root, file))))
);

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.PGURL ||
  process.env.POSTGRES_URL ||
  fileEnv.DATABASE_URL ||
  fileEnv.SUPABASE_DB_URL ||
  fileEnv.SUPABASE_DATABASE_URL ||
  fileEnv.PGURL ||
  fileEnv.POSTGRES_URL;

function normalizeDatabaseUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol === "postgresql:" || url.protocol === "postgres:") {
      return url.toString();
    }
  } catch {
    return rawUrl;
  }
  return rawUrl;
}

if (!existsSync(sqlFile)) {
  console.error(`Missing SQL file: ${sqlFile}`);
  process.exit(1);
}

if (!databaseUrl) {
  console.error(
    "Missing database connection string. Set DATABASE_URL, SUPABASE_DB_URL, SUPABASE_DATABASE_URL, PGURL, or POSTGRES_URL."
  );
  process.exit(1);
}

const result = spawnSync("psql", ["--set", "ON_ERROR_STOP=1", "--dbname", normalizeDatabaseUrl(databaseUrl), "--file", sqlFile], {
  stdio: "inherit"
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
