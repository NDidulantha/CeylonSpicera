import { Suspense } from "react";
import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import AccountView from "@/components/account-view";

export const metadata: Metadata = { title: "Account — Ceylon Spicera" };

export default function AccountPage() {
    return (
        <>
            <SiteHeader />
            <Suspense fallback={null}>
                <AccountView />
            </Suspense>
            <Footer />
        </>
    );
}