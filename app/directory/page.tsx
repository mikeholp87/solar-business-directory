import Link from "next/link";
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import {
  formatWebsite,
  getListingKey,
  type McsInstaller,
  DEFAULT_PER_PAGE,
  normalizeSearchParam,
  parseFlag,
  parsePage,
  parsePerPage,
  PER_PAGE_OPTIONS,
  readDirectoryData,
} from "@/lib/mcs-directory";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Search for an MCS certified installer for your renewable installation",
  "Browse the scraped MCS directory and filter installers by company, region, certification number, and contact details.",
  "/directory"
);

function pageWindow(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages]);
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

type SortOption = "relevance" | "name" | "type";

function parseSort(value: string): SortOption {
  return value === "name" || value === "type" ? value : "relevance";
}

function sortInstallers(a: McsInstaller, b: McsInstaller, sort: SortOption) {
  if (sort === "name") {
    return (a.companyName ?? "").localeCompare(b.companyName ?? "") || (a.address ?? "").localeCompare(b.address ?? "");
  }

  if (sort === "type") {
    const aType = a.category.join(" / ");
    const bType = b.category.join(" / ");
    return aType.localeCompare(bType) || (a.companyName ?? "").localeCompare(b.companyName ?? "");
  }

  return 0;
}

function Pagination({
  currentPage,
  totalPages,
  query,
  type,
  sort,
  perPage,
  bus,
  website,
  email,
}: {
  currentPage: number;
  totalPages: number;
  query: string;
  type: string;
  sort: SortOption;
  perPage: number;
  bus: boolean;
  website: boolean;
  email: boolean;
}) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="surface-card mt-8 flex flex-wrap items-center justify-between gap-4 p-4">
      <p className="text-sm font-bold text-ink/65">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <PaginationLink page={currentPage - 1} disabled={currentPage <= 1} label="Previous" query={query} type={type} sort={sort} perPage={perPage} bus={bus} website={website} email={email} />
        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const gap = previousPage && page - previousPage > 1;
          return (
            <span key={page} className="flex items-center gap-2">
              {gap ? <span className="px-2 text-sm font-bold text-ink/45">…</span> : null}
              <PaginationLink page={page} active={page === currentPage} query={query} type={type} sort={sort} perPage={perPage} bus={bus} website={website} email={email} />
            </span>
          );
        })}
        <PaginationLink page={currentPage + 1} disabled={currentPage >= totalPages} label="Next" query={query} type={type} sort={sort} perPage={perPage} bus={bus} website={website} email={email} />
      </div>
    </nav>
  );
}

function PaginationLink({
  page,
  active,
  disabled,
  label,
  query,
  type,
  sort,
  perPage,
  bus,
  website,
  email,
}: {
  page: number;
  active?: boolean;
  disabled?: boolean;
  label?: string;
  query: string;
  type: string;
  sort: SortOption;
  perPage: number;
  bus: boolean;
  website: boolean;
  email: boolean;
}) {
  const baseClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-bold transition";
  const activeClass = "border-fern bg-fern text-white shadow-soft";
  const inactiveClass = "border-stone-200 bg-white/90 text-ink hover:border-stone-300 hover:bg-white";
  const disabledClass = "pointer-events-none border-stone-200 bg-white/60 text-ink/35";

  const className = `${baseClass} ${disabled ? disabledClass : active ? activeClass : inactiveClass}`;
  const href = buildDirectoryHref({ page, query, type, sort, perPage, bus, website, email });

  if (disabled) {
    return <span className={className}>{label ?? page}</span>;
  }

  return <Link className={className} href={href} aria-current={active ? "page" : undefined}>{label ?? page}</Link>;
}

function ToggleFilter({ name, label, checked }: { name: "bus" | "website" | "email"; label: string; checked: boolean }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-2 text-sm font-bold">
      <input type="checkbox" name={name} value="1" defaultChecked={checked} className="size-4 w-auto" />
      <span>{label}</span>
    </label>
  );
}

function buildDirectoryHref({
  page,
  query,
  type,
  sort,
  perPage,
  bus,
  website,
  email,
}: {
  page: number;
  query: string;
  type: string;
  sort: SortOption;
  perPage: number;
  bus: boolean;
  website: boolean;
  email: boolean;
}) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query) params.set("q", query);
  if (type) params.set("type", type);
  if (sort !== "relevance") params.set("sort", sort);
  if (perPage !== DEFAULT_PER_PAGE) params.set("perPage", String(perPage));
  if (bus) params.set("bus", "1");
  if (website) params.set("website", "1");
  if (email) params.set("email", "1");
  const queryString = params.toString();
  return queryString ? `/directory?${queryString}` : "/directory";
}

export default function DirectoryPage({
  searchParams,
}: {
  searchParams: { page?: string | string[]; q?: string | string[]; type?: string | string[]; category?: string | string[]; sort?: string | string[]; perPage?: string | string[]; bus?: string | string[]; website?: string | string[]; email?: string | string[] };
}) {
  const data = readDirectoryData();
  const currentPage = parsePage(searchParams.page);
  const query = normalizeSearchParam(searchParams.q).toLowerCase();
  const type = normalizeSearchParam(searchParams.type ?? searchParams.category);
  const sort = parseSort(normalizeSearchParam(searchParams.sort));
  const perPage = parsePerPage(searchParams.perPage);
  const bus = parseFlag(searchParams.bus);
  const website = parseFlag(searchParams.website);
  const email = parseFlag(searchParams.email);
  const types = Array.from(new Set(data.installers.flatMap((installer) => installer.category))).sort((a, b) => a.localeCompare(b));
  const filteredInstallers = data.installers.filter((installer) => {
    const haystack = [
      installer.companyName,
      installer.address,
      installer.category.join(" "),
      installer.certificationBody,
      installer.certificationNumber,
      installer.website,
      installer.email,
      installer.phone,
      installer.regionsCovered.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (query && !haystack.includes(query)) return false;
    if (type && !installer.category.includes(type)) return false;
    if (bus && !installer.boilerUpgradeSchemeRegistered) return false;
    if (website && !installer.website) return false;
    if (email && !installer.email) return false;
    return true;
  }).sort((a, b) => sortInstallers(a, b, sort));
  const totalPages = Math.max(1, Math.ceil(filteredInstallers.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * perPage;
  const end = start + perPage;
  const results = filteredInstallers.slice(start, end);

  return (
    <main className="section-band">
      <div className="container-page">
        <div className="grid gap-8">
          <div>
            <div className="surface-card surface-card-cream p-8 sm:p-10">
              <p className="eyebrow">Scraped MCS directory</p>
              <h1 className="mt-3 text-4xl font-black">Search for an MCS certified installer for your renewable installation</h1>
              <p className="mt-4 max-w-3xl leading-7 text-ink/70">
                Browse the current MCS directory and filter installers by company, region, certification number, and contact details.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-ink/65">
                <span className="chip chip-soft">{data.query.technology}</span>
                <span className="chip chip-soft">{data.query.region}</span>
                <span className="chip">{perPage} per page</span>
              </div>
            </div>

            <form method="get" className="surface-card mt-6 grid gap-4 p-4">
              <input type="hidden" name="page" value="1" />
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <label className="sr-only" htmlFor="directory-q">Search installers</label>
                <input
                  id="directory-q"
                  name="q"
                  placeholder="Search company, address, certification number, region, email, phone..."
                  defaultValue={normalizeSearchParam(searchParams.q)}
                />
                <button className="button-primary" type="submit">
                  <Search size={18} />
                  Search
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-2 text-sm font-bold">
                  <span>Per page</span>
                  <select name="perPage" defaultValue={perPage} className="bg-transparent text-sm outline-none">
                    {PER_PAGE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-2 text-sm font-bold">
                  <span>Type</span>
                  <select name="type" defaultValue={type} className="bg-transparent text-sm outline-none">
                    <option value="">All types</option>
                    {types.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-3 py-2 text-sm font-bold">
                  <span>Sort</span>
                  <select name="sort" defaultValue={sort} className="bg-transparent text-sm outline-none">
                    <option value="relevance">Relevance</option>
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                  </select>
                </label>
                <ToggleFilter name="bus" label="BUS registered" checked={bus} />
                <ToggleFilter name="website" label="Website listed" checked={website} />
                <ToggleFilter name="email" label="Email listed" checked={email} />
              </div>
              <p className="text-sm font-bold text-ink/65">
                Showing {results.length} of {filteredInstallers.length.toLocaleString()} matching results
              </p>
            </form>

            <div className="mt-6 grid gap-5">
              {results.map((installer) => (
                <article key={installer.installerId ?? `${installer.companyName}-${installer.sourcePage}`} className="surface-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">Installer</p>
                      <h2 className="mt-3 text-2xl font-black">
                        <Link href={`/directory/${getListingKey(installer)}`} className="hover:text-fern">
                          {installer.companyName ?? "Unknown company"}
                        </Link>
                      </h2>
                      <p className="mt-3 max-w-3xl leading-7 text-ink/70">{installer.address ?? "No address listed"}</p>
                      {installer.category.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {installer.category.map((item) => (
                            <span key={item} className="chip chip-soft">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {installer.boilerUpgradeSchemeRegistered ? <span className="chip chip-success">BUS registered</span> : <span className="chip chip-warning">Not BUS registered</span>}
                      <span className="chip chip-soft">{installer.certificationBody ?? "Unknown body"}</span>
                      <span className="chip">Page {installer.sourcePage ?? "?"}</span>
                    </div>
                  </div>

                  <dl className="mt-6 grid gap-4 border-t border-ink/10 pt-5 sm:grid-cols-2 xl:grid-cols-3">
                    <Field label="Certification number" value={installer.certificationNumber} />
                    <Field
                      label="Website"
                      value={
                        installer.website ? (
                          <a href={formatWebsite(installer.website) ?? installer.website} target="_blank" rel="noreferrer">
                            {formatWebsite(installer.website) ?? installer.website}
                          </a>
                        ) : null
                      }
                    />
                    <Field label="Email" value={installer.email ? <a href={`mailto:${installer.email}`}>{installer.email}</a> : null} />
                    <Field label="Phone" value={installer.phone ? <a href={`tel:${installer.phone}`}>{installer.phone}</a> : null} />
                    <Field label="Source page" value={installer.sourcePage?.toString() ?? null} />
                    <Field label="Regions covered" value={installer.regionsCovered.length > 0 ? installer.regionsCovered.join(", ") : null} />
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
                    <Link className="button-primary" href={`/directory/${getListingKey(installer)}`}>
                      View details
                    </Link>
                    {installer.website ? (
                      <a className="button-secondary" href={formatWebsite(installer.website) ?? installer.website} target="_blank" rel="noreferrer">
                        Open website
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <Pagination currentPage={safePage} totalPages={totalPages} query={normalizeSearchParam(searchParams.q)} type={type} sort={sort} perPage={perPage} bus={bus} website={website} email={email} />
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.18em] text-ink/50">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-ink/80">{value ?? "Not listed"}</dd>
    </div>
  );
}
