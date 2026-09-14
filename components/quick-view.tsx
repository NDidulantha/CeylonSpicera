"use client";

import { useEffect, useState } from "react";
import ImageSlot from "@/components/image-slot";
import { Stars, Heart } from "@/components/shop-ui";
import { useStore } from "@/components/store-context";
import { useCatalog } from "@/lib/catalog-context";
import { SIZES, sizePrice, stockMeta, money } from "@/lib/shop-data";

const HAIR = "#D8C8AE";

export default function QuickView() {
    const { quickId } = useStore();
    if (!quickId) return null;
    return <QuickViewModal key={quickId} id={quickId} />;
}

function QuickViewModal({ id }: { id: string }) {
    const { closeQuick, addToCart, openCart, wished, toggleWish, wishBeatId } = useStore();
    const { getProduct } = useCatalog();
    const p = getProduct(id);
    const [size, setSize] = useState("100g");
    const [qty, setQty] = useState(1);
    const [thumb, setThumb] = useState(0);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuick();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [closeQuick]);

    if (!p) return null;
    const sm = stockMeta[p.stock];
    const out = p.stock === "out";
    const total = sizePrice(p, size) * qty;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={closeQuick} style={{ background: "rgba(14,22,15,.62)", backdropFilter: "blur(7px)", animation: "csFade .3s ease" }}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative grid max-h-[88vh] w-full max-w-[960px] grid-cols-1 overflow-y-auto bg-cream lg:grid-cols-[420px_1fr]"
                style={{ border: `1px solid ${HAIR}`, boxShadow: "0 60px 120px -50px rgba(14,22,15,.7)", animation: "csQvIn .42s cubic-bezier(.16,.84,.34,1)" }}
            >
                <button type="button" onClick={closeQuick} aria-label="Close" className="absolute right-[18px] top-[18px] z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-cream transition-[transform,background,color] duration-300 hover:rotate-90 hover:bg-forest hover:text-gold" style={{ borderColor: HAIR }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>

                <div className="p-[26px]" style={{ background: "#EFE8D8" }}>
                    <div className="relative h-[340px] overflow-hidden" style={{ background: "#E5DAC4" }}>
                        <ImageSlot alt={p.name} label={`${p.name} · view ${thumb + 1}`} />
                    </div>
                    <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                        {[0, 1, 2].map((i) => (
                            <button key={i} type="button" onClick={() => setThumb(i)} className="relative h-[76px] overflow-hidden" style={{ background: "#E5DAC4", border: `1px solid ${i === thumb ? "#C59A3D" : "transparent"}`, opacity: i === thumb ? 1 : 0.72 }}>
                                <ImageSlot alt={`${p.name} thumbnail ${i + 1}`} label={`#${i + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-10 py-10 lg:pr-11">
                    <div className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.2em]">
                        <span className="text-gold">{p.cat}</span>
                        <Stars r={p.rating} />
                        <span className="font-normal tracking-normal text-[#8A7C68]">{p.reviews} reviews</span>
                    </div>
                    <h2 className="mt-2 font-display text-[38px] font-semibold leading-[1.05] tracking-[-0.01em] text-forest">{p.name}</h2>
                    <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: sm.color }}>
                        <span className="inline-block h-2 w-2 rounded-full" style={{ background: sm.color }} />
                        {sm.label}
                    </div>
                    <p className="mt-4 text-[15px] font-light leading-[1.7] text-[#5F5648]">{p.long}</p>

                    <div className="mt-6 flex gap-7 border-y py-4" style={{ borderColor: HAIR }}>
                        {[
                            { k: "Estate", v: p.estate },
                            { k: "Harvest", v: p.harvest },
                            { k: "Lot", v: p.lot || "—" },
                        ].map((m) => (
                            <div key={m.k}>
                                <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A7C68]">{m.k}</div>
                                <div className="mt-1 font-display text-[18px] text-forest">{m.v}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A7C68]">Size</div>
                        <div className="mt-2.5 flex gap-2.5">
                            {SIZES.map((s) => {
                                const active = size === s.key;
                                return (
                                    <button key={s.key} type="button" onClick={() => setSize(s.key)} className="flex-1 rounded-[6px] px-2 py-2.5 text-center transition-colors" style={{ background: active ? "#1F3A2A" : "#F7F1E7", color: active ? "#F7F3EA" : "#5F5648", border: active ? "1px solid #1F3A2A" : `1px solid ${HAIR}` }}>
                                        <div className="text-[13px] font-semibold">{s.label}</div>
                                        <div className="mt-0.5 font-display text-[15px]">{money(sizePrice(p, s.key))}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A7C68]">Quantity</div>
                            <div className="mt-2.5 flex h-11 items-center rounded-[25px]" style={{ border: `1px solid ${HAIR}`, background: "#F7F1E7" }}>
                                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-10 place-items-center text-[18px] text-forest">−</button>
                                <span className="w-9 text-center font-display text-[21px] text-forest">{qty}</span>
                                <button type="button" onClick={() => setQty((q) => q + 1)} className="grid h-full w-10 place-items-center text-[18px] text-forest">+</button>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A7C68]">Total</div>
                            <div className="mt-1 font-display text-[34px] font-semibold text-forest">{money(total)}</div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        {out ? (
                            <button type="button" disabled className="flex-1 cursor-not-allowed rounded-[25px] py-4 text-[12px] font-semibold uppercase tracking-[0.15em]" style={{ background: "#EFE8D8", color: "#A99C86" }}>Sold Out</button>
                        ) : (
                            <button type="button" onClick={() => { addToCart(p.id, size, qty); closeQuick(); openCart(); }} className="flex-1 rounded-[25px] bg-gold py-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-forest transition-colors hover:bg-[#d8ac52]">
                                Add to Cart · {money(total)}
                            </button>
                        )}
                        <button type="button" onClick={() => toggleWish(p.id)} aria-label="Save" className="grid w-[54px] place-items-center rounded-[25px] border" style={{ borderColor: HAIR }}>
                            <Heart filled={wished(p.id)} beat={wishBeatId === p.id} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}