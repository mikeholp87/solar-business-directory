import { listInstallers } from "@/lib/repositories/installers";
import { getLocationPageKeys } from "@/lib/seo/location-pages";
import { serviceFacets } from "@/lib/seo/service-facets";
import { readDirectoryData, getListingKey } from "@/lib/mcs-directory";
import { siteUrl } from "@/lib/runtime";

const MAX_DIRECTORY_URLS = 5000;

export default async function sitemap() {
  const installers = await listInstallers();
  const base = siteUrl();

  let directoryUrls: { url: string; lastModified: Date }[] = [];
  try {
    const { installers: mcsInstallers } = await readDirectoryData();
    directoryUrls = mcsInstallers.slice(0, MAX_DIRECTORY_URLS).map((i) => ({
      url: `${base}/directory/${getListingKey(i)}`,
      lastModified: new Date(),
    }));
  } catch {
    // Supabase unavailable — skip MCS directory URLs
  }

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/directory`, lastModified: new Date() },
    { url: `${base}/apply`, lastModified: new Date() },
    { url: `${base}/services`, lastModified: new Date() },
    { url: `${base}/for-installers`, lastModified: new Date() },
    { url: `${base}/pricing`, lastModified: new Date() },
    { url: `${base}/example-installer-profile`, lastModified: new Date() },
    ...getLocationPageKeys().map((location) => ({
      url: `${base}/heat-pump-installers/${location}`,
      lastModified: new Date(),
    })),
    ...serviceFacets.map((facet) => ({
      url: `${base}/services/${facet.slug}`,
      lastModified: new Date(),
    })),
    ...installers.map((installer) => ({
      url: `${base}/installers/${installer.slug}`,
      lastModified: new Date(),
    })),
    ...directoryUrls,
  ];
}
