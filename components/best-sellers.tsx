"use client";

import Link from "next/link";
import ImageSlot from "@/components/image-slot";
import { Stars, Heart } from "@/components/shop-ui";
import { useStore } from "@/components/store-context";
import { FEATURED, getProduct, money } from "@/lib/shop-data";

const HAIR = "#D8C8AE";

export default function BestSellers() {
    const { wished, toggleWish, wishBeatId, addToCart, openCart, openQuick } = useStore();
    const products = FEATURED.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

    const add = (id: string, stock: string) => {
        if (stock === "out") return;
        addToCart(id, "100g", 1);
        openCart();
    };

    return (
        <section id="shop" className="bg-cream px-6 py-24 lg:px-11">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-12 text-center">
                    <span className="text-[11px] uppercase tracking-[0.42em] text-gold">The Cellar Favourites</span>
                    <h2 className="mt-4 font-display text-[clamp(34px,4vw,52px)] font-semibold tracking-[-0.01em] text-forest">Best Sellers</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((p) => {
                        const out = p.stock === "out";
                        return (
                            <div key={p.id} className="group relative flex flex-col bg-white transition-[translate,box-shadow,border-color] duration-[450ms] ease-[cubic-bezier(.16,.84,.34,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_56px_-34px_rgba(31,58,42,.55)]" style={{ border: "1px solid #EFE8D8" }}>
                                <div className="relative h-[236px] overflow-hidden">
                                    <div className="absolute inset-0 transition-[scale] duration-[900ms] ease-[cubic-bezier(.16,.84,.34,1)] group-hover:scale-[1.07]">
                                        <ImageSlot alt={p.name} label={`Photo · ${p.name}`} />
                                    </div>
                                    {p.badge && (<span className="absolute left-[14px] top-[14px] rounded-[25px] bg-forest px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-cream">{p.badge}</span>)}
                                    <button type="button" onClick={() => toggleWish(p.id)} aria-label="Save" className="absolute right-3 top-3 flex h-[34px] w-[34px] items-center justify-center rounded-full border" style={{ background: "rgba(247,243,234,.9)", borderColor: HAIR }}>
                                        <Heart filled={wished(p.id)} beat={wishBeatId === p.id} />
                                    </button>
                                    <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-[opacity,translate] duration-[350ms] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                                        <button type="button" onClick={() => openQuick(p.id)} className="w-full rounded-[25px] border py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest" style={{ background: "#F7F3EA", borderColor: HAIR }}>Quick View</button>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col px-5 pb-[22px] pt-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold">{p.cat}</span>
                                        <Stars r={p.rating} />
                                    </div>
                                    <h3 className="mt-[9px] font-display text-[22px] font-semibold leading-[1.15] text-forest">{p.name}</h3>
                                    <p className="mt-[7px] min-h-[38px] text-[12.5px] font-light leading-[1.45] text-[#8A7C68]">{p.desc}</p>
                                    <div className="mt-[14px] flex items-center justify-between border-t pt-[14px]" style={{ borderColor: "#EFE8D8" }}>
                                        <span className="font-display text-[23px] font-semibold text-forest">{money(p.price)}</span>
                                        {out ? (
                                            <button type="button" disabled className="cursor-not-allowed rounded-[25px] px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={{ background: "#EFE8D8", color: "#A99C86" }}>Sold Out</button>
                                        ) : (
                                            <button type="button" onClick={() => add(p.id, p.stock)} className="rounded-[25px] bg-forest px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-[#2b4d38]">Add</button>
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