import type { MetadataRoute } from "next";

const SITE_URL = "https://www.ceylonspicera.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/account", "/checkout"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
