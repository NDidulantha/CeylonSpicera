import { Suspense } from "react";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import ShopPage from "@/components/shop-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Shop — Ceylon Spicera",
    description:
        "Sixteen single-estate lots — Ceylon cinnamon, pepper, cardamom, roots and blends — packed with their origin and harvest date.",
    path: "/shop",
});

export default function Shop() {
    return (
        <>
            <SiteHeader />
            <main>
                <Suspense fallback={null}>
                    <ShopPage />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
