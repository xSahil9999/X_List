import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = ["", "/browse", "/search", "/blog", "/about", "/faq", "/contact", "/privacy", "/imprint"];

  return [
    ...pages.map((path) => ({
      url: `https://x-list.vercel.app${path}`,
      lastModified,
      changeFrequency: path === "/browse" ? "daily" as const : "weekly" as const,
      priority: path === "" ? 1 : path === "/browse" || path === "/search" ? 0.8 : 0.6
    }))
  ];
}
