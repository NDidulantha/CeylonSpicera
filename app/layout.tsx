import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StoreProvider } from "@/components/store-context";
import { ShopKeyframes } from "@/components/shop-ui";
import CartDrawer from "@/components/cart-drawer";
import QuickView from "@/components/quick-view";
import WishlistDrawer from "@/components/wishlist-drawer";
import { AuthProvider } from "@/components/auth-context";
import { CatalogProvider } from "@/lib/catalog-context";
import WhatsAppButton from "@/components/whatsapp-button";

/* Display face — Cormorant Garamond, self-hosted (used with restraint) */
const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

/* Body / utility face — Manrope, self-hosted */
const manrope = localFont({
  variable: "--font-manrope",
  display: "swap",
  src: [
    { path: "./fonts/manrope-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/manrope-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/manrope-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/manrope-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

const SITE_URL = "https://www.ceylonspicera.com";
const SITE_NAME = "Ceylon Spicera";
const SITE_DESCRIPTION =
  "Hand-selected Ceylon spices sourced directly from Sri Lanka's highland estates and delivered worldwide with uncompromising quality.";
const DEFAULT_OG_IMAGE = "/hero/plantation.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ceylon Spicera — Premium Sri Lankan Spices, Exported Worldwide",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Ceylon Spicera — Premium Sri Lankan Spices, Exported Worldwide",
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 800, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ceylon Spicera — Premium Sri Lankan Spices, Exported Worldwide",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo/CS.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+94-72-025-4466",
        email: "Ceylonspicera@gmail.com",
        contactType: "customer service",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Colombo",
        addressRegion: "Cinnamon Gardens",
        addressCountry: "LK",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/shop?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuthProvider>
        <CatalogProvider>
        <StoreProvider>
          <ShopKeyframes />
          {children}
          <CartDrawer />
          <WishlistDrawer />
          <QuickView />
          <WhatsAppButton />
        </StoreProvider>
        </CatalogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

