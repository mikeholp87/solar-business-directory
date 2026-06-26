import Link from "next/link";
import { DirectoryResultCard } from "@/components/directory-result-card";
import { DirectoryToolbar, type DirectorySortOption } from "@/components/directory-toolbar";
import {
  DEFAULT_PER_PAGE,
  type McsInstaller,
  normalizeSearchParam,
  parseFlag,
  parsePage,
  parsePerPage,
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

function parseSort(value: string): DirectorySortOption {
  return value === "name" || value === "type" ? value : "relevance";
}

function sortInstallers(
  a: McsInstaller,
  b: McsInstaller,
  sort: DirectorySortOption
) {
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
  sort: DirectorySortOption;
  perPage: number;
  bus: boolean;
  website: boolean;
  email: boolean;
}) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="editorial-rail mt-2 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
      <p className="text-sm font-bold text-navy/65">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <PaginationLink page={currentPage - 1} disabled={currentPage <= 1} label="Previous" query={query} type={type} sort={sort} perPage={perPage} bus={bus} website={website} email={email} />
        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const gap = previousPage && page - previousPage > 1;
          return (
            <span key={page} className="flex items-center gap-2">
              {gap ? <span className="px-2 text-sm font-bold text-navy/45">…</span> : null}
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
  sort: DirectorySortOption;
  perPage: number;
  bus: boolean;
  website: boolean;
  email: boolean;
}) {
  const baseClass = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-bold transition";
  const activeClass = "border-accent bg-accent text-white shadow-soft";
  const inactiveClass = "border-border bg-white text-navy hover:border-stone-300 hover:bg-white";
  const disabledClass = "pointer-events-none border-border bg-white/60 text-navy/35";

  const className = `${baseClass} ${disabled ? disabledClass : active ? activeClass : inactiveClass}`;
  const href = buildDirectoryHref({ page, query, type, sort, perPage, bus, website, email });

  if (disabled) {
    return <span className={className}>{label ?? page}</span>;
  }

  return (
    <Link className={className} href={href} aria-current={active ? "page" : undefined}>
      {label ?? page}
    </Link>
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
  sort: DirectorySortOption;
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

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: { page?: string | string[]; q?: string | string[]; type?: string | string[]; category?: string | string[]; sort?: string | string[]; perPage?: string | string[]; bus?: string | string[]; website?: string | string[]; email?: string | string[] };
}) {
  const data = await readDirectoryData();
  const currentPage = parsePage(searchParams.page);
  const searchInput = normalizeSearchParam(searchParams.q);
  const query = searchInput.toLowerCase();
  const type = normalizeSearchParam(searchParams.type ?? searchParams.category);
  const sort = parseSort(normalizeSearchParam(searchParams.sort));
  const perPage = parsePerPage(searchParams.perPage);
  const bus = parseFlag(searchParams.bus);
  const website = parseFlag(searchParams.website);
  const email = parseFlag(searchParams.email);
  const types = Array.from(new Set(data.installers.flatMap((i) => i.category))).sort();

  const filteredInstallers = data.installers
    .filter((installer) => {
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
      if (type && !installer.category.some((c) => c.toLowerCase() === type.toLowerCase())) return false;
      if (bus && !installer.boilerUpgradeSchemeRegistered) return false;
      if (website && !installer.website) return false;
      if (email && !installer.email) return false;
      return true;
    })
    .sort((a, b) => sortInstallers(a, b, sort));

  const totalPages = Math.max(1, Math.ceil(filteredInstallers.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * perPage;
  const end = start + perPage;
  const results = filteredInstallers.slice(start, end);

  return (
    <main className="section-band">
      <div className="container-page grid gap-8">
        <section className="surface-card surface-card-cream p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="eyebrow">Renewable Directory index</p>
              <h1 className="mt-4 text-4xl font-black leading-[0.96] sm:text-5xl">Search the installer index by territory, type, and record detail</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">
                Browse the current MCS directory for {data.query.technology.toLowerCase()} installers in {data.query.region}. Filter by the details that matter: company, coverage, certification, and contact information.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Matching installers" value={filteredInstallers.length.toLocaleString("en-GB")} />
              <Stat label="Types in view" value={types.length.toLocaleString("en-GB")} />
              <Stat label="Rows per page" value={String(perPage)} />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-navy/64">
            <span className="chip chip-soft">{data.query.technology}</span>
            <span className="chip chip-soft">{data.query.region}</span>
            <span className="chip">{data.totalCount.toLocaleString("en-GB")} source rows</span>
          </div>
        </section>

        <DirectoryToolbar
          query={searchInput}
          type={type}
          sort={sort}
          perPage={perPage}
          types={types}
          bus={bus}
          website={website}
          email={email}
          totalResults={filteredInstallers.length}
          showingCount={results.length}
        />

        <div className="grid gap-5">
          {results.map((installer) => (
            <DirectoryResultCard key={installer.installerId ?? `${installer.companyName}-${installer.sourcePage}`} installer={installer} />
          ))}
        </div>

        <Pagination currentPage={safePage} totalPages={totalPages} query={searchInput} type={type} sort={sort} perPage={perPage} bus={bus} website={website} email={email} />
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-navy/10 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-navy">{value}</p>
    </div>
  );
}
