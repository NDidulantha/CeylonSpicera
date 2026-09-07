export type Stock = "in" | "low" | "out";

export type Product = {
    id: string;
    name: string;
    cat: string;
    price: number;
    rating: number;
    reviews: number;
    badge: string;
    stock: Stock;
    estate: string;
    harvest: string;
    desc: string;
    long: string;
};

/* 16 lots · placeholder catalogue (replace before launch) */
export const CATALOG: Product[] = [
    { id: "p1", name: "Ceylon Cinnamon Quills", cat: "Cinnamon", price: 18, rating: 4.9, reviews: 312, badge: "Best Seller", stock: "in", estate: "Matale", harvest: "Mar 2026", desc: "Grade C5 · hand-rolled true cinnamon", long: "Hand-peeled on the third day after rain and quilled by eye. Sweet enough to eat plain, thin enough to roll between the fingers." },
    { id: "p2", name: "Estate Ground Cinnamon", cat: "Cinnamon", price: 14, rating: 4.7, reviews: 186, badge: "", stock: "in", estate: "Matale", harvest: "Mar 2026", desc: "Milled to order from C5 quills", long: "Milled the week it ships, never held in bulk. The oil is still in the powder when it reaches you." },
    { id: "p3", name: "Alba Grade Cinnamon", cat: "Cinnamon", price: 32, rating: 5.0, reviews: 74, badge: "Limited", stock: "low", estate: "Matale", harvest: "Feb 2026", desc: "The finest grade the island produces", long: "Under six millimetres across, cut from the youngest shoots. One row on one estate yields what we sell in a season." },
    { id: "p4", name: "Cinnamon Bark Oil", cat: "Cinnamon", price: 46, rating: 4.8, reviews: 58, badge: "", stock: "in", estate: "Matale", harvest: "Jan 2026", desc: "Steam-distilled, 10 ml amber vial", long: "Distilled on-estate from bark trimmings the peelers set aside. Two hundred kilos of bark to the litre." },
    { id: "p5", name: "Malabar Black Pepper", cat: "Pepper", price: 14.5, rating: 4.8, reviews: 241, badge: "", stock: "in", estate: "Kegalle", harvest: "Apr 2026", desc: "Bold, high-piperine single origin", long: "Vine-ripened and sun-dried on mats. Sharp at the front, resinous underneath, with none of the dust of commodity pepper." },
    { id: "p6", name: "Kegalle White Pepper", cat: "Pepper", price: 16.5, rating: 4.7, reviews: 96, badge: "", stock: "in", estate: "Kegalle", harvest: "Apr 2026", desc: "Stream-retted, clean and hot", long: "Retted in running water for nine days, then rubbed and dried. Cleaner heat than black, and no fermented note." },
    { id: "p7", name: "Ceylon Long Pepper", cat: "Pepper", price: 21, rating: 4.6, reviews: 41, badge: "New", stock: "in", estate: "Kegalle", harvest: "Mar 2026", desc: "Sweet, floral, slow-building heat", long: "The pepper Rome bought before it found the round kind. Sweeter, more floral, and the heat arrives late." },
    { id: "p8", name: "Green Cardamom Pods", cat: "Cardamom", price: 22, rating: 4.9, reviews: 203, badge: "", stock: "in", estate: "Kandenuwara", harvest: "Feb 2026", desc: "Highland-grown, intensely aromatic", long: "Picked green at eleven hundred metres and cured slowly so the pods stay closed and the seeds stay black." },
    { id: "p9", name: "Whole Cloves", cat: "Cardamom", price: 16, rating: 4.8, reviews: 154, badge: "", stock: "in", estate: "Kandy", harvest: "Jan 2026", desc: "Sun-dried, richly aromatic buds", long: "Picked at the blush, before the bud opens. Heavy with oil — they sink rather than float." },
    { id: "p10", name: "Nutmeg & Mace", cat: "Cardamom", price: 19.5, rating: 4.9, reviews: 88, badge: "", stock: "low", estate: "Kandy", harvest: "Dec 2025", desc: "Twin spice, warm and sweet", long: "Sold as a pair because they grow as one. The mace is dried in shade to hold its colour." },
    { id: "p11", name: "Ceylon Turmeric", cat: "Roots & Leaf", price: 12, rating: 4.7, reviews: 167, badge: "", stock: "in", estate: "Kegalle", harvest: "Mar 2026", desc: "High-curcumin golden root", long: "Boiled, sun-dried and stone-milled. Tested above four per cent curcumin on the current lot." },
    { id: "p12", name: "Curry Leaf, Estate Dried", cat: "Roots & Leaf", price: 15.5, rating: 4.8, reviews: 73, badge: "", stock: "in", estate: "Matale", harvest: "Apr 2026", desc: "Shade-dried on the branch", long: "Dried on the stem in shade so the leaf keeps its green and its oil. Snaps rather than crumbles." },
    { id: "p13", name: "Ceylon Vanilla Beans", cat: "Roots & Leaf", price: 34, rating: 5.0, reviews: 112, badge: "Limited", stock: "low", estate: "Kandenuwara", harvest: "Nov 2025", desc: "Plump Grade A gourmet pods", long: "Hand-pollinated, cured over five months. Sixteen centimetres and pliable enough to knot." },
    { id: "p14", name: "Roasted Curry Powder", cat: "Blends", price: 13.5, rating: 4.8, reviews: 229, badge: "", stock: "in", estate: "Four estates", harvest: "Apr 2026", desc: "The dark Sri Lankan roast", long: "Nine spices roasted separately to their own colour, then ground together. Dark, smoky, unlike any yellow curry powder." },
    { id: "p15", name: "The Four Estates Box", cat: "Gift Sets", price: 68, rating: 4.9, reviews: 134, badge: "Best Seller", stock: "in", estate: "All four", harvest: "Mixed", desc: "One tin from every ridge", long: "Cinnamon from Matale, clove from Kandy, pepper from Kegalle, cardamom from Kandenuwara. Four tins in a rough linen case." },
    { id: "p16", name: "Founder's Reserve Tin", cat: "Gift Sets", price: 95, rating: 5.0, reviews: 29, badge: "Limited", stock: "out", estate: "Matale", harvest: "Feb 2026", desc: "Alba cinnamon, numbered lot", long: "Alba quills, vanilla and long pepper in a numbered tin, signed off by hand. Two hundred made each season." },
];

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

/* Category order (spec) + computed counts */
const CAT_ORDER = ["Cinnamon", "Pepper", "Cardamom", "Roots & Leaf", "Blends", "Gift Sets"];
export const CATEGORIES = CAT_ORDER.map((name) => ({
    name,
    count: CATALOG.filter((p) => p.cat === name).length,
}));

export const PRICE_MIN = Math.floor(Math.min(...CATALOG.map((p) => p.price)));
export const PRICE_MAX = Math.ceil(Math.max(...CATALOG.map((p) => p.price)));

export const FREE_SHIP_AT = 75;
export const SHIP_FEE = 9.5;

export const money = (n: number) =>
    "$" + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, "");

/* Stock display metadata */
export const stockMeta: Record<Stock, { label: string; color: string }> = {
    in: { label: "In stock", color: "#3F7A55" },
    low: { label: "Low stock · few left", color: "#B07A2A" },
    out: { label: "Sold out", color: "#8A5B33" },
};

/* Curated Best Sellers subset (ids from the same catalogue) */
export const FEATURED = ["p1", "p5", "p8", "p3", "p9", "p11", "p14", "p15"];

export const getProduct = (id: string) => CATALOG.find((p) => p.id === id);