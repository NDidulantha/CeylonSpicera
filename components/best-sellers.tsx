"use client";

import Link from "next/link";
import ImageSlot from "@/components/image-slot";
import { Stars, Heart } from "@/components/shop-ui";
import { useStore } from "@/components/store-context";
import { useCatalog } from "@/lib/catalog-context";
import { money } from "@/lib/shop-data";

const HAIR = "#D8C8AE";

export default function BestSellers() {
    const { wished, toggleWish, wishBeatId, addToCart, openCart, openQuick } = useStore();
    const { featured: products } = useCatalog();

    const add = (id: string, stock: string) => {
        if (stock === "out") return;
        addToCart(id, "100g", 1);
        openCart();
    };

    return (
        <section id="shop" className="bg-cream px-6 py-16 sm:py-20 lg:px-11 lg:py-24">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-12 text-center">
                    <span className="text-[11px] uppercase tracking-[0.42em] text-gold">The Cellar Favourites</span>
                    <h2 className="mt-4 font-display text-[clamp(34px,4vw,52px)] font-semibold tracking-[-0.01em] text-forest">Best Sellers</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                    {products.map((p) => {
                        const out = p.stock === "out";
                        return (
                            <div key={p.id} className="group relative flex flex-col bg-white transition-[translate,box-shadow,border-color] duration-[450ms] ease-[cubic-bezier(.16,.84,.34,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_56px_-34px_rgba(31,58,42,.55)]" style={{ border: "1px solid #EFE8D8" }}>
                                <div className="relative h-[150px] overflow-hidden sm:h-[190px] lg:h-[236px]" role="button" tabIndex={0} onClick={() => openQuick(p.id)} onKeyDown={(e) => e.key === "Enter" && openQuick(p.id)} aria-label={`Quick view ${p.name}`}>
                                    <div className="absolute inset-0 transition-[scale] duration-[900ms] ease-[cubic-bezier(.16,.84,.34,1)] group-hover:scale-[1.07]">
                                        <ImageSlot alt={p.name} label={`Photo · ${p.name}`} />
                                    </div>
                                    {p.badge && (<span className="absolute left-2 top-2 rounded-[25px] bg-forest px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cream sm:left-[14px] sm:top-[14px] sm:px-3 sm:py-1 sm:text-[9.5px] sm:tracking-[0.16em]">{p.badge}</span>)}
                                    <button type="button" onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }} aria-label="Save" className="absolute right-2 top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full border sm:right-3 sm:top-3 sm:h-[34px] sm:w-[34px]" style={{ background: "rgba(247,243,234,.9)", borderColor: HAIR }}>
                                        <Heart filled={wished(p.id)} beat={wishBeatId === p.id} />
                                    </button>
                                    <div className="pointer-events-none absolute inset-x-4 bottom-4 hidden translate-y-3 opacity-0 transition-[opacity,translate] duration-[350ms] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
                                        <button type="button" onClick={(e) => { e.stopPropagation(); openQuick(p.id); }} className="w-full rounded-[25px] border py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest" style={{ background: "#F7F3EA", borderColor: HAIR }}>Quick View</button>
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
                                            <button type="button" onClick={() => add(p.id, p.stock)} className="rounded-[25px] bg-forest px-2.5 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-[#2b4d38] sm:px-5 sm:py-2.5 sm:text-[10.5px] sm:tracking-[0.12em]">Add</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View all */}
                <div className="mt-12 flex justify-center">
                    <Link href="/shop" className="inline-flex items-center gap-2.5 rounded-[25px] border border-forest px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-forest transition-colors duration-300 hover:bg-forest hover:text-cream">
                        View All Products
                        <span aria-hidden>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}