import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StoreProvider } from "@/components/store-context";
import { ShopKeyframes } from "@/components/shop-ui";
import CartDrawer from "@/components/cart-drawer";
import QuickView from "@/components/quick-view";
import WishlistDrawer from "@/components/wishlist-drawer";
import { AuthProvider } from "@/components/auth-context";

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

export const metadata: Metadata = {
  title: "Ceylon Spicera — Premium Sri Lankan Spices, Exported Worldwide",
  description:
    "Hand-selected Ceylon spices sourced directly from Sri Lanka's highland estates and delivered worldwide with uncompromising quality.",
  icons: { icon: "/logo/CS.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
      <AuthProvider>
        <StoreProvider>
          <ShopKeyframes />
          {children}
          <CartDrawer />
          <WishlistDrawer />
          <QuickView />
        </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// …inside the provider:

