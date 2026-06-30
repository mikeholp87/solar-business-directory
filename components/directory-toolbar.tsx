import { Search } from "lucide-react";
import { PER_PAGE_OPTIONS } from "@/lib/mcs-directory";

export type DirectorySortOption = "relevance" | "name" | "type";

type DirectoryToolbarProps = {
  query: string;
  postcode: string;
  type: string;
  sort: DirectorySortOption;
  perPage: number;
  types: string[];
  bus: boolean;
  website: boolean;
  email: boolean;
  totalResults: number;
  showingCount: number;
};

export function DirectoryToolbar({
  query,
  postcode,
  type,
  sort,
  perPage,
  types,
  bus,
  website,
  email,
  totalResults,
  showingCount,
}: DirectoryToolbarProps) {
  return (
    <form method="get" className="editorial-rail p-5 sm:p-6">
      <input type="hidden" name="page" value="1" />
      <input type="hidden" name="postcode" value={postcode} />

      <div className="editorial-rail__header grid gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="eyebrow">Refine the index</p>
          <h2 className="mt-3 text-2xl font-black">Search installers, then narrow by type and coverage</h2>
          <p className="mt-2 text-sm leading-6 text-navy/66">
            Showing {showingCount.toLocaleString("en-GB")} of {totalResults.toLocaleString("en-GB")} installers in the directory.
          </p>
        </div>
        <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
          <label className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/88 px-3 py-2 text-sm font-bold">
            <span>Per page</span>
            <select name="perPage" defaultValue={perPage} className="bg-transparent text-sm outline-none">
              {PER_PAGE_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="directory-q">Search installers</label>
          <input
            id="directory-q"
            name="q"
            placeholder="Search company, address, certification number, email, phone..."
            defaultValue={query}
            className="text-base"
          />
          <button className="button-primary" type="submit">
            <Search size={18} />
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/88 px-3 py-2 text-sm font-bold">
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

          <label className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/88 px-3 py-2 text-sm font-bold">
            <span>Sort</span>
            <select name="sort" defaultValue={sort} className="bg-transparent text-sm outline-none">
              <option value="relevance">Relevance</option>
              <option value="name">Name</option>
              <option value="type">Type</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/88 px-3 py-2 text-sm font-bold">
            <input type="checkbox" name="bus" value="1" defaultChecked={bus} className="size-4 w-auto" />
            <span>BUS registered</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/88 px-3 py-2 text-sm font-bold">
            <input type="checkbox" name="website" value="1" defaultChecked={website} className="size-4 w-auto" />
            <span>Website listed</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/88 px-3 py-2 text-sm font-bold">
            <input type="checkbox" name="email" value="1" defaultChecked={email} className="size-4 w-auto" />
            <span>Email listed</span>
          </label>
        </div>
      </div>
    </form>
  );
}
