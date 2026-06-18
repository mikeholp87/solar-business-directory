#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DEFAULT_URL = 'https://mcscertified.com/find-an-installer/';
const DEFAULT_OUTPUT = resolve(process.cwd(), 'data/mcscertified-air-source-heat-pump-england.json');
const DEFAULT_PER_PAGE = 12;
const REGION_LABELS = [
  ['region_northern_ireland', 'Northern Ireland'],
  ['region_scotland', 'Scotland'],
  ['region_wales', 'Wales'],
  ['region_england', 'England'],
  ['region_nationwide', 'Nationwide'],
  ['region_eastern', 'Eastern'],
  ['region_east_midlands', 'East Midlands'],
  ['region_london', 'London'],
  ['region_north_east', 'North East'],
  ['region_north_west', 'North West'],
  ['region_south_east', 'South East'],
  ['region_south_west', 'South West'],
  ['region_west_midlands', 'West Midlands'],
  ['region_yorkshire_humberside', 'Yorkshire & Humberside'],
];

function parseArgs(argv) {
  const args = { output: DEFAULT_OUTPUT, maxPages: Infinity, headless: true, url: DEFAULT_URL };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out' || arg === '-o') {
      args.output = resolve(process.cwd(), argv[++i]);
    } else if (arg.startsWith('--out=')) {
      args.output = resolve(process.cwd(), arg.slice('--out='.length));
    } else if (arg === '--max-pages') {
      args.maxPages = Number(argv[++i]);
    } else if (arg.startsWith('--max-pages=')) {
      args.maxPages = Number(arg.slice('--max-pages='.length));
    } else if (arg === '--headful') {
      args.headless = false;
    } else if (arg === '--url') {
      args.url = argv[++i];
    } else if (arg.startsWith('--url=')) {
      args.url = arg.slice('--url='.length);
    }
  }
  return args;
}

function isTruthy(value) {
  return value === 1 || value === '1' || value === true || value === 'true';
}

function normalizeWebsite(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).href;
  } catch {
    try {
      return new URL(`https://${trimmed.replace(/^\/+/, '')}`).href;
    } catch {
      return trimmed;
    }
  }
}

function formatAddress(item) {
  return [item.address_line_1, item.address_line_2, item.address_line_3, item.county, item.postcode]
    .map((part) => (part ? String(part).trim() : ''))
    .filter(Boolean)
    .join(', ');
}

function deriveRegions(item) {
  return REGION_LABELS.flatMap(([key, label]) => (isTruthy(item[key]) ? [label] : []));
}

function normalizeInstaller(item, pageNumber) {
  return {
    installerId: item.installer_id ? Number(item.installer_id) : null,
    companyName: item.name ?? null,
    address: formatAddress(item),
    addressParts: {
      line1: item.address_line_1 ?? null,
      line2: item.address_line_2 ?? null,
      line3: item.address_line_3 ?? null,
      county: item.county ?? null,
      postcode: item.postcode ?? null,
      country: item.country ?? null,
    },
    regionsCovered: deriveRegions(item),
    boilerUpgradeSchemeRegistered: isTruthy(item.boiler_upgrade_scheme),
    certificationBody: item.certification_body ?? null,
    certificationNumber: item.certification_number ?? null,
    website: normalizeWebsite(item.website),
    email: item.email ?? null,
    phone: item.telephone ?? null,
    sourcePage: pageNumber,
  };
}

async function dismissConsent(page) {
  const accept = page.getByRole('button', { name: /accept/i }).first();
  if (await accept.count().catch(() => 0)) {
    await accept.click({ timeout: 5000 }).catch(() => {});
  }
}

async function clickElement(locator) {
  await locator.evaluate((element) => element.click());
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'accept': 'application/json, text/plain, */*',
      'x-requested-with': 'XMLHttpRequest',
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed ${response.status} for ${url}`);
  }
  return response.json();
}

async function main() {
  const { output, maxPages, headless, url } = parseArgs(process.argv.slice(2));

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await dismissConsent(page);

    // Drive the visible UI so the scraper follows the same flow a user would.
    await clickElement(page.locator('#technology_ashp'));
    await clickElement(page.getByRole('button', { name: /select location/i }).first());
    await clickElement(page.locator('#region_england'));
    await clickElement(page.locator('#submit-location-filters'));

    const { ajaxurl, nonce } = await page.evaluate(() => window.mcsAjax ?? {});
    if (!ajaxurl || !nonce) {
      throw new Error('Could not read MCS AJAX settings from the page.');
    }

    const baseUrl = new URL(ajaxurl);
    baseUrl.search = new URLSearchParams({
      action: 'filter_installers',
      nonce,
      form_type: 'installers',
      search: '',
      'technology[]': 'technology_ashp',
      'region[]': 'region_england',
      per_page: String(DEFAULT_PER_PAGE),
      page: '1',
    }).toString();

    const firstPayload = await fetchJson(baseUrl.toString());
    const firstBatch = firstPayload?.data?.data ?? [];
    const totalCount = Number(firstPayload?.data?.total_count ?? firstBatch.length);
    const perPage = firstBatch.length || DEFAULT_PER_PAGE;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    const pageLimit = Number.isFinite(maxPages) ? Math.min(totalPages, maxPages) : totalPages;

    const installers = [];
    for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
      const pageUrl = new URL(baseUrl);
      pageUrl.searchParams.set('page', String(pageNumber));

      const payload = pageNumber === 1 ? firstPayload : await fetchJson(pageUrl.toString());
      const items = payload?.data?.data ?? [];
      if (!items.length) break;

      for (const item of items) {
        installers.push(normalizeInstaller(item, pageNumber));
      }

      console.log(`Scraped page ${pageNumber}/${pageLimit} (${items.length} installers)`);
    }

    const result = {
      sourceUrl: url,
      query: {
        technology: 'Air Source Heat Pump',
        region: 'England',
      },
      totalCount,
      totalPages,
      scrapedAt: new Date().toISOString(),
      installers,
    };

    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${installers.length} installers to ${output}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
