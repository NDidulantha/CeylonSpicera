import type { Metadata } from "next";

const SITE_URL = "https://www.ceylonspicera.com";
const SITE_NAME = "Ceylon Spicera";
const DEFAULT_OG_IMAGE = "/hero/plantation.jpg";

/** Builds a page's title/description plus matching OpenGraph and Twitter
 *  Card metadata, so every page gets a correct social-share preview
 *  without hand-repeating the same shape everywhere. */
export function pageMetadata({
    title,
    description,
    path,
    image = DEFAULT_OG_IMAGE,
    noIndex = false,
}: {
    title: string;
    description: string;
    path: string;
    image?: string;
    noIndex?: boolean;
}): Metadata {
    const url = `${SITE_URL}${path}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        ...(noIndex && { robots: { index: false, follow: false } }),
        openGraph: {
            type: "website",
            url,
            siteName: SITE_NAME,
            title,
            description,
            images: [{ url: image, width: 1200, height: 800, alt: SITE_NAME }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}
