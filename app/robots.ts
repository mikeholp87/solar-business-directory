import { siteUrl } from "@/lib/runtime";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/installer-dashboard", "/billing", "/login", "/signup", "/api/"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
