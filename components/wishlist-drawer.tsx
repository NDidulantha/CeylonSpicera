"use client";

import { useEffect } from "react";
import ImageSlot from "@/components/image-slot";
import { Heart } from "@/components/shop-ui";
import { useStore } from "@/components/store-context";
import { useCatalog } from "@/lib/catalog-context";
import { money } from "@/lib/shop-data";

const HAIR = "#D8C8AE";

export default function WishlistDrawer() {
    const { wishlist, wishOpen, closeWish, toggleWish, addToCart, openCart } = useStore();
    const { getProduct } = useCatalog();

    useEffect(() => {
        if (!wishOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeWish();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [wishOpen, closeWish]);

    if (!wishOpen) return null;

    const items = [...wishlist].map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

    return (
        <div className="fixed inset-0 z-[80] flex justify-end" onClick={closeWish} style={{ background: "rgba(14,22,15,.55)", backdropFilter: "blur(5px)", animation: "csFade .3s ease" }}>
            <div onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-[420px] flex-col bg-cream" style={{ borderLeft: `1px solid ${HAIR}`, boxShadow: "-40px 0 100px -50px rgba(14,22,15,.8)", animation: "csSlideIn .42s cubic-bezier(.16,.84,.34,1)" }}>
                <div className="flex items-center justify-between border-b px-7 py-[26px]" style={{ borderColor: HAIR }}>
                    <div>
                        <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold">Saved for Later</div>
                        <div className="mt-1 font-display text-[28px] font-semibold text-forest">Wishlist</div>
                    </div>
                    <button type="button" onClick={closeWish} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border bg-cream transition-[transform,background,color] duration-300 hover:rotate-90 hover:bg-forest hover:text-gold" style={{ borderColor: HAIR }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                        <span className="text-[#8A7C68]"><Heart filled={false} beat={false} /></span>
                        <div className="mt-4 font-display text-[24px] text-forest">Nothing saved yet.</div>
                        <p className="mt-2 w-[250px] text-[13px] text-[#8A7C68]">Tap the heart on any spice to keep it here for later.</p>
                        <button type="button" onClick={closeWish} className="mt-6 rounded-[25px] bg-forest px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-[#2b4d38]">Browse the store</button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-7">
                        {items.map((p) => {
                            const out = p.stock === "out";
                            return (
                                <div key={p.id} className="flex gap-4 border-b py-5" style={{ borderColor: "#EFE8D8" }}>
                                    <div className="relative h-[74px] w-[74px] flex-none overflow-hidden">
                                        <ImageSlot alt={p.name} label={p.name} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="font-display text-[19px] font-semibold leading-[1.15] text-forest">{p.name}</div>
                                            <button type="button" onClick={() => toggleWish(p.id)} aria-label="Remove" className="text-[15px] leading-none text-[#8A7C68] transition-colors hover:text-[#8A5B33]">×</button>
                                        </div>
                                        <div className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-gold">{p.cat}</div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="font-display text-[18px] font-semibold text-forest">{money(p.price)}</span>
                                            {out ? (
                                                <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#8A5B33]">Sold out</span>
                                            ) : (
                                                <button type="button" onClick={() => { addToCart(p.id, "100g", 1); toggleWish(p.id); closeWish(); openCart(); }} className="rounded-[25px] bg-forest px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-[#2b4d38]">Add to Cart</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}