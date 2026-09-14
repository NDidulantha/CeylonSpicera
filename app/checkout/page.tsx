import { Suspense } from "react";
import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import CheckoutView from "@/components/checkout-view";

export const metadata: Metadata = { title: "Checkout — Ceylon Spicera" };

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
