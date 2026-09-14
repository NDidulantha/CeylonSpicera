"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiGet } from "@/lib/api";
import type { Product, Stock } from "@/lib/shop-data";

type Category = { name: string; count: number };

type RawSize = { id: number; size_key: string; label: string; price_cents: number };
type RawProduct = {
    id: number;
    slug: string;
    name: string;
    category: { name: string };
    base_price_cents: number;
    short_description: string | null;
    long_description: string | null;
    badge: string | null;
    stock_status: Stock;
    estate: string | null;
    harvest_month: string | null;
    lot_number: string | null;
    rating: number;
    review_count: number;
    sizes: RawSize[];
};

function mapProduct(raw: RawProduct): Product {
    return {
        id: String(raw.id),
        numericId: raw.id,
        slug: raw.slug,
        name: raw.name,
        cat: raw.category?.name ?? "",
        price: raw.base_price_cents / 100,
        rating: raw.rating,
        reviews: raw.review_count,
        badge: raw.badge ?? "",
        stock: raw.stock_status,
        estate: raw.estate ?? "",
        harvest: raw.harvest_month ?? "",
        lot: raw.lot_number ?? "",
        desc: raw.short_description ?? "",
        long: raw.long_description ?? "",
        sizes: (raw.sizes ?? []).map((s) => ({ id: s.id, key: s.size_key, label: s.label, price: s.price_cents / 100 })),
    };
}

type CatalogCtx = {
    products: Product[];
    featured: Product[];
    categories: Category[];
    loading: boolean;
    priceMin: number;
    priceMax: number;
    getProduct: (id: string) => Product | undefined;
};

const Ctx = createContext<CatalogCtx | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [featured, setFeatured] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [productsRes, featuredRes, categoriesRes] = await Promise.all([
                    apiGet<{ data: RawProduct[] }>("/api/products?per_page=100"),
                    apiGet<{ data: RawProduct[] }>("/api/products/featured"),
                    apiGet<{ data: { name: string; product_count: number }[] }>("/api/categories"),
                ]);
                if (cancelled) return;
                setProducts(productsRes.data.map(mapProduct));
                setFeatured(featuredRes.data.map(mapProduct));
                setCategories(categoriesRes.data.map((c) => ({ name: c.name, count: c.product_count })));
            } catch {
                /* API unreachable — pages fall back to their empty states */
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo<CatalogCtx>(() => {
        const prices = products.map((p) => p.price);
        return {
            products,
            featured,
            categories,
            loading,
            priceMin: prices.length ? Math.floor(Math.min(...prices)) : 0,
            priceMax: prices.length ? Math.ceil(Math.max(...prices)) : 100,
            getProduct: (id: string) => products.find((p) => p.id === id),
        };
    }, [products, featured, categories, loading]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
    const c = useContext(Ctx);
    if (!c) throw new Error("useCatalog must be used within CatalogProvider");
    return c;
}
