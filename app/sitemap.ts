import { listInstallers } from "@/lib/repositories/installers";
import { getLocationPageKeys } from "@/lib/seo/location-pages";
import { serviceFacets } from "@/lib/seo/service-facets";
import { siteUrl } from "@/lib/runtime";

export default async function sitemap() {
  const installers = await listInstallers();
  const base = siteUrl();

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/directory`, lastModified: new Date() },
    { url: `${base}/apply`, lastModified: new Date() },
    { url: `${base}/services`, lastModified: new Date() },
    ...getLocationPageKeys().map((location) => ({ url: `${base}/heat-pump-installers/${location}`, lastModified: new Date() })),
    ...serviceFacets.map((facet) => ({ url: `${base}/services/${facet.slug}`, lastModified: new Date() })),
    ...installers.map((installer) => ({ url: `${base}/installers/${installer.slug}`, lastModified: new Date() })),
  ];
}
