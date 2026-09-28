import type { MetadataRoute } from "next";

const SITE_URL = "https://www.ceylonspicera.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
        { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${SITE_URL}/about-ceylon`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ];
}
