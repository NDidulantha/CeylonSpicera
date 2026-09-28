import { Suspense } from "react";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import AccountView from "@/components/account-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Account — Ceylon Spicera",
    description: "Sign in or open an account to order Ceylon Spicera's single-estate spices.",
    path: "/account",
    noIndex: true,
});

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