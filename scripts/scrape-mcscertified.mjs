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

function normalizePhone(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.replace(/^tel:/i, '').replace(/\s+/g, '');
}

function parseAddressParts(address) {
  const parts = String(address ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    line1: parts[0] ?? null,
    line2: parts[1] ?? null,
    line3: parts.length >= 5 ? parts[2] : null,
    county: parts.length >= 5 ? parts[4] : parts[3] ?? null,
    postcode: parts.length >= 5 ? parts[3] : parts[2] ?? null,
    country: 'Unspecified',
  };
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

function normalizeText(value) {
  return value ? String(value).replace(/\s+/g, ' ').trim() : null;
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

async function applyInstallerFilters(page) {
  await clickElement(page.locator('#technology_ashp'));
  await clickElement(page.getByRole('button', { name: /select location/i }).first());
  await clickElement(page.locator('#region_england'));
  await clickElement(page.locator('#submit-location-filters'));
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

function modalSelector(installerId) {
  return `#modal-${installerId}`;
}

async function closeModal(page, installerId) {
  const modal = page.locator(modalSelector(installerId));
  await modal.locator('.modal-close').first().evaluate((element) => element.click()).catch(() => {});
}

async function extractInstallerFromModal(page, item) {
  const modal = page.locator(modalSelector(item.installer_id));

  return modal.evaluate((modalEl) => {
    const clean = (value) => (value ? String(value).replace(/\s+/g, ' ').trim().replace(/,\s*$/, '') : null);
    const text = clean(modalEl.innerText ?? modalEl.textContent ?? '');
    const capture = (pattern) => clean(text?.match(pattern)?.[1] ?? null);

    const certificationNumber = capture(/Certification Number:\s*([A-Z0-9-]+)/i);
    const email = clean(modalEl.querySelector('a[href^=\"mailto:\"]')?.getAttribute('href')?.replace(/^mailto:/i, '') ?? null);
    const phone = clean(modalEl.querySelector('a[href^=\"tel:\"]')?.getAttribute('href')?.replace(/^tel:/i, '') ?? null);
    const website = clean(modalEl.querySelector('a[target=\"_blank\"][href^=\"http\"]')?.getAttribute('href') ?? null);
    const category = Array.from(modalEl.querySelectorAll('.modal-body .flex.flex-wrap.items-start.pt-10 ul li'))
      .map((node) => clean(node.textContent ?? null))
      .filter(Boolean);

    return {
      companyName: clean(modalEl.querySelector('h2')?.textContent ?? null),
      certificationNumber,
      email,
      phone,
      website,
      category,
      address: capture(/Address:\s*([\s\S]*?)\s*Regions covered:/i),
      regionsCovered: capture(/Regions covered:\s*([\s\S]*?)\s*Boiler Upgrade Scheme Registered:/i)
        ?.split(',')
        .map((part) => clean(part))
        .filter(Boolean) ?? [],
      boilerUpgradeSchemeRegistered: capture(/Boiler Upgrade Scheme Registered:\s*([\s\S]*?)\s*Certification Body:/i),
      certificationBody: clean(
        modalEl.innerHTML.match(/<strong>Certification Body:<\/strong>[\s\S]*?<p>([\s\S]*?)<\/p>/i)?.[1] ?? null,
      ),
    };
  });
}

async function main() {
  const { output, maxPages, headless, url } = parseArgs(process.argv.slice(2));
  const queryTechnology = 'Air Source Heat Pump';

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await dismissConsent(page);
    await applyInstallerFilters(page);
    await page.waitForTimeout(3000);

    const installers = [];
    let pageNumber = 1;

    while (true) {
      await page.waitForSelector('button.modal-toggle', { state: 'attached', timeout: 30000 });
      const buttons = page.locator('button.modal-toggle');
      const buttonCount = await buttons.count();

      for (let index = 0; index < buttonCount; index += 1) {
        const button = buttons.nth(index);
        const installerId = Number(await button.getAttribute('data-id'));
        const details = await extractInstallerFromModal(page, { installer_id: installerId });
        installers.push({
          installerId: Number.isFinite(installerId) ? installerId : null,
          companyName: details.companyName ?? null,
          address: details.address ?? null,
          addressParts: parseAddressParts(details.address),
          category: Array.from(new Set([queryTechnology, ...(details.category ?? [])])),
          regionsCovered: details.regionsCovered ?? [],
          boilerUpgradeSchemeRegistered: (details.boilerUpgradeSchemeRegistered ?? '').toLowerCase() === 'yes',
          certificationBody: details.certificationBody ?? null,
          certificationNumber: details.certificationNumber ?? null,
          website: normalizeWebsite(details.website),
          email: normalizeText(details.email),
          phone: normalizePhone(details.phone),
          sourcePage: pageNumber,
        });
      }

      console.log(`Scraped page ${pageNumber} (${buttonCount} installers)`);

      if (Number.isFinite(maxPages) && pageNumber >= maxPages) {
        break;
      }

      const nextLink = page.locator('#pagination a').filter({ hasText: /^Next$/ }).first();
      if ((await nextLink.count().catch(() => 0)) === 0) {
        break;
      }

      const firstInstallerId = await buttons.first().getAttribute('data-id');
      await nextLink.evaluate((element) => element.click());
      const advanced = await page.waitForFunction(
        (previousId) => document.querySelector('button.modal-toggle')?.getAttribute('data-id') !== previousId,
        firstInstallerId,
        { timeout: 30000 },
      ).then(() => true).catch(() => false);

      if (!advanced) {
        break;
      }

      pageNumber += 1;
    }

    const result = {
      sourceUrl: url,
      query: {
        technology: queryTechnology,
        region: 'England',
      },
      totalCount: installers.length,
      totalPages: pageNumber,
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
