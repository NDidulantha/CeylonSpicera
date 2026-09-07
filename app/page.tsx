import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import FeaturedCategories from "@/components/featured-categories";
import WhyCeylon from "@/components/why-ceylon";
import BestSellers from "@/components/best-sellers";
import OurHeritage from "@/components/our-heritage";
import ExportWorld from "@/components/export-world";
import CustomerReviews from "@/components/customer-reviews";
import SpiceExperience from "@/components/spice-experience";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

export default function Home() {
    return (
        <>
            <SiteHeader />
            <main>
                <Hero />
                <FeaturedCategories />
                <WhyCeylon />
                <BestSellers />
                <OurHeritage />
                <ExportWorld />
                <CustomerReviews />
                <SpiceExperience />
                <Newsletter />
            </main>
            <Footer />
        </>
    );
}