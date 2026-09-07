import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import ShopPage from "@/components/shop-page";

export const metadata: Metadata = {
    title: "Shop — Ceylon Spicera",
    description:
        "Sixteen single-estate lots — Ceylon cinnamon, pepper, cardamom, roots and blends — packed with their origin and harvest date.",
};

export default function Shop() {
    return (
        <>
            <SiteHeader />
            <main>
                <ShopPage />
            </main>
            <Footer />
        </>
    );
}