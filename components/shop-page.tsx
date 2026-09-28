"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ImageSlot from "@/components/image-slot";
import { Stars, Heart } from "@/components/shop-ui";
import { useStore } from "@/components/store-context";
import { useCatalog } from "@/lib/catalog-context";
import { SORTS, money, stockMeta, type Product, type SortKey } from "@/lib/shop-data";

const HAIR = "#D8C8AE";

export default function ShopPage() {
    const { products: CATALOG, categories, priceMin, priceMax, loading } = useCatalog();
    const searchParams = useSearchParams();
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sort, setSort] = useState<SortKey>("featured");
    const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
    const [cat, setCat] = useState<string>("all");
    const [maxPrice, setMaxPrice] = useState(priceMax);
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        const q = searchParams.get("q");
        if (q !== null) setQuery(q);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        if (!loading) setMaxPrice(priceMax);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const { wishlist, wished, toggleWish, wishBeatId, addToCart, openCart, openQuick } = useStore();

    const add = (id: string) => {
        const p = CATALOG.find((x) => x.id === id);
        if (!p || p.stock === "out") return;
        addToCart(id, "100g", 1);
        openCart();
    };

    const list = useMemo(() => {
        const q = query.trim().toLowerCase();
        const out = CATALOG.filter((p) => {
            if (cat !== "all" && p.cat !== cat) return false;
            if (p.price > maxPrice) return false;
            if (q && !`${p.name} ${p.cat} ${p.desc}`.toLowerCase().includes(q)) return false;
            return true;
        });
        const by: Record<SortKey, (a: Product, b: Product) => number> = {
            featured: () => 0,
            low: (a, b) => a.price - b.price,
            high: (a, b) => b.price - a.price,
            top: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
            az: (a, b) => a.name.localeCompare(b.name),
        };
        return [...out].sort(by[sort]);
    }, [CATALOG, query, cat, maxPrice, sort]);

    const priceFilterOn = maxPrice < priceMax;
    const anyFilter = cat !== "all" || priceFilterOn || query.trim() !== "";
    const clearAll = () => {
        setCat("all");
        setMaxPrice(priceMax);
        setQuery("");
    };

    return (
        <div className="bg-cream">
            {/* Hero */}
            <section
                className="relative overflow-hidden px-6 py-[76px] text-cream lg:px-11"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,rgba(18,30,20,.94),rgba(18,30,20,.72) 58%,rgba(18,30,20,.5)), url('/shop/hero.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center 60%",
                }}
            >
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-3.5 flex items-center gap-3.5">
                        <span className="h-px w-[42px] bg-gold" />
                        <span className="text-[11px] uppercase tracking-[0.42em] text-gold">The Estate Store</span>
                    </div>
                    <h1 className="font-display text-[clamp(36px,4.6vw,62px)] font-bold leading-[1.02] tracking-[-0.015em]">
                        Shop the Harvest
                    </h1>
                    <p className="mt-[18px] max-w-[520px] text-[16px] font-light leading-[1.8] text-[rgba(247,243,234,0.8)]">
                        Sixteen lots, four estates, one ridge. Every tin carries its origin and its harvest date.
                    </p>
                </div>
            </section>

            {/* Body */}
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 pb-24 pt-8 lg:gap-11 lg:pt-14 lg:grid-cols-[250px_1fr] lg:px-11">
                {/* Mobile filter toggle */}
                <button
                    type="button"
                    onClick={() => setFiltersOpen((v) => !v)}
                    aria-expanded={filtersOpen}
                    className="flex items-center justify-between rounded-[10px] border px-4 py-3 font-sans text-[13px] font-medium text-forest lg:hidden"
                    style={{ borderColor: HAIR, background: "#F7F1E7" }}
                >
                    <span className="flex items-center gap-2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" fill="#F7F1E7" />
                            <line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2" fill="#F7F1E7" />
                            <line x1="4" y1="18" x2="20" y2="18" /><circle cx="11" cy="18" r="2" fill="#F7F1E7" />
                        </svg>
                        Filters
                        {anyFilter && <span className="h-[6px] w-[6px] rounded-full bg-gold" />}
                    </span>
                    <span className="text-[16px] leading-none">{filtersOpen ? "−" : "+"}</span>
                </button>

                {/* Sidebar */}
                <aside className={`${filtersOpen ? "flex" : "hidden"} flex-col gap-9 lg:flex lg:sticky lg:top-[100px] lg:self-start`}>
                    <div className="relative">
                        <svg className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A7C68" strokeWidth={1.6}>
                            <circle cx="10.5" cy="10.5" r="6.5" />
                            <line x1="15.5" y1="15.5" x2="20" y2="20" />
                        </svg>
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the store" className="w-full rounded-[25px] border py-3 pl-[38px] pr-4 font-sans text-[13.5px] font-light text-[#5F5648] outline-none transition-colors focus:border-gold" style={{ background: "#F7F1E7", borderColor: HAIR }} />
                    </div>

                    <div>
                        <div className="border-b pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5C3724]" style={{ borderColor: HAIR }}>Category</div>
                        <div className="mt-3 flex flex-col">
                            {[{ name: "All Spices", count: CATALOG.length, key: "all" }, ...categories.map((c) => ({ ...c, key: c.name }))].map((c) => {
                                const active = cat === c.key;
                                return (
                                    <button key={c.key} type="button" onClick={() => setCat(c.key)} className="flex items-center justify-between border-l-2 py-2.5 pl-3 pr-2 text-left text-[13.5px] transition-colors" style={{ borderColor: active ? "#C59A3D" : "transparent", color: active ? "#1F3A2A" : "#5F5648", fontWeight: active ? 600 : 300 }}>
                                        <span>{c.name}</span>
                                        <span style={{ color: active ? "#C59A3D" : "#B5A88F" }}>{c.count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <div className="border-b pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5C3724]" style={{ borderColor: HAIR }}>Price</div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A7C68]">Up to</span>
                            <span className="font-display text-[24px] font-semibold text-forest">{priceFilterOn ? money(maxPrice) : "Any price"}</span>
                        </div>
                        <input type="range" min={priceMin} max={priceMax} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-3 h-0.5 w-full" style={{ accentColor: "#C59A3D" }} />
                        <div className="mt-2 flex justify-between text-[11px] text-[#8A7C68]">
                            <span>{money(priceMin)}</span>
                            <span>{money(priceMax)}</span>
                        </div>
                    </div>

                    <div>
                        <div className="border-b pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5C3724]" style={{ borderColor: HAIR }}>Wishlist</div>
                        <div className="mt-3 flex items-baseline gap-3">
                            <span className="font-display text-[30px] font-semibold text-forest">{wishlist.size}</span>
                            <span className="text-[12.5px] text-[#8A7C68]">saved {wishlist.size === 1 ? "item" : "items"}</span>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <div>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-[18px]" style={{ borderColor: HAIR }}>
                        <div className="text-[13.5px] font-light text-[#5F5648]">
                            <span className="font-semibold text-forest">{list.length}</span> {list.length === 1 ? "product" : "products"}
                        </div>
                        <div className="flex items-center gap-3">
                            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-[25px] border px-4 py-2.5 font-sans text-[12.5px] text-[#5F5648] outline-none focus:border-gold" style={{ background: "#F7F1E7", borderColor: HAIR }}>
                                {SORTS.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
                            </select>
                            <div className="flex overflow-hidden rounded-[25px]" style={{ border: `1px solid ${HAIR}` }}>
                                {(["grid", "list"] as const).map((v, i) => {
                                    const active = view === v;
                                    return (
                                        <button key={v} type="button" onClick={() => setView(v)} aria-label={v} className="flex h-[38px] w-10 items-center justify-center transition-colors" style={{ background: active ? "#1F3A2A" : "#F7F1E7", color: active ? "#F7F3EA" : "#8A7C68", borderLeft: i === 1 ? `1px solid ${HAIR}` : undefined }}>
                                            {v === "grid" ? (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" /><rect x="3" y="13" width="8" height="8" /><rect x="13" y="13" width="8" height="8" /></svg>
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" /><rect x="3" y="10" width="18" height="4" /><rect x="3" y="16" width="18" height="4" /></svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {anyFilter && (
                        <div className="mt-4 flex flex-wrap items-center gap-2.5">
                            {cat !== "all" && <Chip label={cat} onClear={() => setCat("all")} />}
                            {priceFilterOn && <Chip label={`Up to ${money(maxPrice)}`} onClear={() => setMaxPrice(priceMax)} />}
                            {query.trim() && <Chip label={`“${query.trim()}”`} onClear={() => setQuery("")} />}
                            <button type="button" onClick={clearAll} className="text-[11.5px] uppercase tracking-[0.14em] text-[#8A7C68] transition-colors hover:text-gold">Clear all</button>
                        </div>
                    )}

                    {list.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="font-display text-[24px] text-forest">No spices match those filters.</div>
                            <button type="button" onClick={clearAll} className="mt-4 rounded-[25px] bg-forest px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-[#2b4d38]">Clear filters</button>
                        </div>
                    ) : view === "grid" ? (
                        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                            {list.map((p) => (
                                <ProductCard key={p.id} p={p} wished={wished(p.id)} beat={wishBeatId === p.id} onWish={() => toggleWish(p.id)} onQuick={() => openQuick(p.id)} onAdd={() => add(p.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-7 flex flex-col gap-[18px]">
                            {list.map((p) => (
                                <ProductRow key={p.id} p={p} wished={wished(p.id)} beat={wishBeatId === p.id} onWish={() => toggleWish(p.id)} onQuick={() => openQuick(p.id)} onAdd={() => add(p.id)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
    return (
        <button type="button" onClick={onClear} className="group flex items-center gap-2 rounded-[25px] border py-[7px] pl-[14px] pr-3 text-[12px] text-[#5C3724] transition-colors hover:border-gold hover:bg-[#E7DBC2]" style={{ borderColor: HAIR, background: "#EFE8D8" }}>
            {label}
            <span className="text-[13px] leading-none text-[#8A7C68] group-hover:text-[#5C3724]">×</span>
        </button>
    );
}

function ProductCard({ p, wished, beat, onWish, onQuick, onAdd }: { p: Product; wished: boolean; beat: boolean; onWish: () => void; onQuick: () => void; onAdd: () => void }) {
    const out = p.stock === "out";
    return (
        <div className="group relative flex flex-col bg-white transition-[translate,box-shadow,border-color] duration-[450ms] ease-[cubic-bezier(.16,.84,.34,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_56px_-34px_rgba(31,58,42,.55)]" style={{ border: "1px solid #EFE8D8" }}>
            <div className="relative h-[150px] overflow-hidden sm:h-[190px] lg:h-[236px]" role="button" tabIndex={0} onClick={onQuick} onKeyDown={(e) => e.key === "Enter" && onQuick()} aria-label={`Quick view ${p.name}`}>
                <div className="absolute inset-0 transition-[scale] duration-[900ms] ease-[cubic-bezier(.16,.84,.34,1)] group-hover:scale-[1.07]">
                    <ImageSlot alt={p.name} label={`Photo · ${p.name}`} />
                </div>
                {p.badge && (<span className="absolute left-2 top-2 rounded-[25px] bg-forest px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cream sm:left-[14px] sm:top-[14px] sm:px-3 sm:py-1 sm:text-[9.5px] sm:tracking-[0.16em]">{p.badge}</span>)}
                <button type="button" onClick={(e) => { e.stopPropagation(); onWish(); }} aria-label="Save" className="absolute right-2 top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full border sm:right-3 sm:top-3 sm:h-[34px] sm:w-[34px]" style={{ background: "rgba(247,243,234,.9)", borderColor: HAIR }}>
                    <Heart filled={wished} beat={beat} />
                </button>
                <div className="pointer-events-none absolute inset-x-4 bottom-4 hidden translate-y-3 opacity-0 transition-[opacity,translate] duration-[350ms] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onQuick(); }} className="w-full rounded-[25px] border py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest" style={{ background: "#F7F3EA", borderColor: HAIR }}>Quick View</button>
                </div>
            </div>
            <div className="flex flex-1 flex-col px-2.5 pb-3 pt-2.5 sm:px-5 sm:pb-[22px] sm:pt-5">
                <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-semibold uppercase tracking-[0.1em] text-gold sm:text-[10.5px] sm:tracking-[0.2em]">{p.cat}</span>
                    <Stars r={p.rating} />
                </div>
                <h3 className="mt-1 font-display text-[14px] font-semibold leading-[1.2] text-forest sm:mt-[9px] sm:text-[22px] sm:leading-[1.15]">{p.name}</h3>
                <p className="mt-1 hidden text-[12.5px] font-light leading-[1.45] text-[#8A7C68] sm:mt-[7px] sm:block sm:min-h-[38px]">{p.desc}</p>
                <div className="mt-2 flex items-center justify-between border-t pt-2 sm:mt-[14px] sm:pt-[14px]" style={{ borderColor: "#EFE8D8" }}>
                    <span className="font-display text-[15px] font-semibold text-forest sm:text-[23px]">{money(p.price)}</span>
                    {out ? (
                        <button type="button" disabled className="cursor-not-allowed rounded-[25px] px-2.5 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.1em] sm:px-5 sm:py-2.5 sm:text-[10.5px] sm:tracking-[0.12em]" style={{ background: "#EFE8D8", color: "#A99C86" }}>Sold Out</button>
                    ) : (
                        <button type="button" onClick={onAdd} className="rounded-[25px] bg-forest px-2.5 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-[#2b4d38] sm:px-5 sm:py-2.5 sm:text-[10.5px] sm:tracking-[0.12em]">Add</button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductRow({ p, wished, beat, onWish, onQuick, onAdd }: { p: Product; wished: boolean; beat: boolean; onWish: () => void; onQuick: () => void; onAdd: () => void }) {
    const sm = stockMeta[p.stock];
    const out = p.stock === "out";
    return (
        <div className="group flex flex-col overflow-hidden bg-white transition-[box-shadow,border-color] duration-[450ms] hover:shadow-[0_30px_56px_-34px_rgba(31,58,42,.55)] sm:flex-row" style={{ border: "1px solid #EFE8D8" }}>
            <div className="relative h-[180px] w-full flex-none overflow-hidden sm:h-auto sm:w-[210px]">
                <ImageSlot alt={p.name} label={`Photo · ${p.name}`} />
            </div>
            <div className="flex flex-1 flex-col justify-center px-4 py-4 sm:px-[26px] sm:py-6">
                <div className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.2em]">
                    <span className="text-gold">{p.cat}</span>
                    <span style={{ color: sm.color }}>· {sm.label}</span>
                </div>
                <h3 className="mt-2 font-display text-[20px] font-semibold text-forest sm:text-[26px]">{p.name}</h3>
                <p className="mt-2 max-w-[520px] text-[13.5px] font-light leading-[1.6] text-[#5F5648]">{p.long}</p>
            </div>
            <div className="flex w-full flex-none flex-row items-center justify-between gap-3 px-4 pb-4 sm:w-[190px] sm:flex-col sm:items-end sm:justify-center sm:px-6 sm:pb-0">
                <span className="font-display text-[22px] font-semibold text-forest sm:text-[28px]">{money(p.price)}</span>
                <div className="flex flex-1 items-center gap-2 sm:w-full sm:flex-none sm:flex-col-reverse">
                    {out ? (
                        <button type="button" disabled className="flex-1 cursor-not-allowed rounded-[25px] py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] sm:w-full" style={{ background: "#EFE8D8", color: "#A99C86" }}>Sold Out</button>
                    ) : (
                        <button type="button" onClick={onAdd} className="flex-1 rounded-[25px] bg-forest py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-[#2b4d38] sm:w-full">Add to Cart</button>
                    )}
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={onQuick} className="rounded-[25px] border px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest" style={{ borderColor: HAIR }}>Quick view</button>
                        <button type="button" onClick={onWish} aria-label="Save" className="flex h-[34px] w-[34px] items-center justify-center rounded-full border" style={{ borderColor: HAIR }}>
                            <Heart filled={wished} beat={beat} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}