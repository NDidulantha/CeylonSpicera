import { Suspense } from "react";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import CheckoutView from "@/components/checkout-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Checkout — Ceylon Spicera",
    description: "Complete your Ceylon Spicera order.",
    path: "/checkout",
    noIndex: true,
});

export default function CheckoutPage() {
    return (
        <>
            <SiteHeader />
            <Suspense fallback={null}>
                <CheckoutView />
            </Suspense>
            <Footer />
        </>
    );
}
