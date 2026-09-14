export type Stock = "in" | "low" | "out";

export type ProductSize = { id: number; key: string; label: string; price: number };

export type Product = {
    id: string;
    numericId: number;
    slug: string;
    name: string;
    cat: string;
    price: number;
    rating: number;
    reviews: number;
    badge: string;
    stock: Stock;
    estate: string;
    harvest: string;
    lot: string;
    desc: string;
    long: string;
    sizes: ProductSize[];
};

export type Size = { key: string; label: string; mult: number };
export const SIZES: Size[] = [
    { key: "50g", label: "50 g", mult: 0.6 },
    { key: "100g", label: "100 g", mult: 1 },
    { key: "250g", label: "250 g", mult: 2.2 },
];

export type SortKey = "featured" | "low" | "high" | "top" | "az";
export const SORTS: { key: SortKey; label: string }[] = [
    { key: "featured", label: "Sort · Featured" },
    { key: "low", label: "Sort · Price, low to high" },
    { key: "high", label: "Sort · Price, high to low" },
    { key: "top", label: "Sort · Top rated" },
    { key: "az", label: "Sort · Name, A–Z" },
];

export const FREE_SHIP_AT = 75;
export const SHIP_FEE = 9.5;

export const money = (n: number) =>
    "$" + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, "");

/** Stock display metadata. */
export const stockMeta: Record<Stock, { label: string; color: string }> = {
    in: { label: "In stock", color: "#3F7A55" },
    low: { label: "Low stock · few left", color: "#B07A2A" },
    out: { label: "Sold out", color: "#8A5B33" },
};

/** Map a `product_sizes.size_key` price found on a product's own `sizes` array. */
export function sizePrice(product: Product, sizeKey: string): number {
    return product.sizes.find((s) => s.key === sizeKey)?.price ?? product.price;
}

export function sizeId(product: Product, sizeKey: string): number | undefined {
    return product.sizes.find((s) => s.key === sizeKey)?.id;
}
