import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { getLocationPageKeys } from "@/lib/seo/location-pages";
import { siteUrl } from "@/lib/runtime";

export default async function sitemap() {
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
  const base = siteUrl();

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/directory`, lastModified: new Date() },
    { url: `${base}/apply`, lastModified: new Date() },
    { url: `${base}/login`, lastModified: new Date() },
    { url: `${base}/billing`, lastModified: new Date() },
    ...getLocationPageKeys().map((location) => ({ url: `${base}/heat-pump-installers/${location}`, lastModified: new Date() })),
    ...installers.map((installer) => ({ url: `${base}/installers/${installer.slug}`, lastModified: new Date() })),
    ...territories.map((territory) => ({ url: `${base}/directory?q=${encodeURIComponent(territory.name)}`, lastModified: new Date() }))
  ];
}
