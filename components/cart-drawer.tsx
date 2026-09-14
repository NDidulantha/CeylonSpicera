"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import ImageSlot from "@/components/image-slot";
import { Bag } from "@/components/shop-ui";
import { useStore } from "@/components/store-context";
import { useCatalog } from "@/lib/catalog-context";
import { FREE_SHIP_AT, SHIP_FEE, sizePrice, money, type Product } from "@/lib/shop-data";

const HAIR = "#D8C8AE";

export default function CartDrawer() {
    const { cart, cartOpen, closeCart, setLineQty } = useStore();
    const { products: CATALOG } = useCatalog();
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const checkout = () => {
        closeCart();
        if (!user) router.push(`/account?returnTo=${encodeURIComponent(pathname)}`);
        else router.push("/checkout");
    };

    useEffect(() => {
        if (!cartOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [cartOpen, closeCart]);

    if (!cartOpen) return null;

    const lines = Object.entries(cart)
        .map(([key, qty]) => {
            const [pid, sizeKey] = key.split("|");
            const p = CATALOG.find((x) => x.id === pid);
            const size = p?.sizes.find((s) => s.key === sizeKey);
            if (!p || !size) return null;
            return { key, qty, p, size, lineTotal: sizePrice(p, sizeKey) * qty };
        })
        .filter(Boolean) as { key: string; qty: number; p: Product; size: NonNullable<Product["sizes"][number]>; lineTotal: number }[];

    const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
    const shipping = subtotal >= FREE_SHIP_AT || subtotal === 0 ? 0 : SHIP_FEE;
    const total = subtotal + shipping;

    return (
        <div className="fixed inset-0 z-[80] flex justify-end" onClick={closeCart} style={{ background: "rgba(14,22,15,.55)", backdropFilter: "blur(5px)", animation: "csFade .3s ease" }}>
            <div onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-[420px] flex-col bg-cream" style={{ borderLeft: `1px solid ${HAIR}`, boxShadow: "-40px 0 100px -50px rgba(14,22,15,.8)", animation: "csSlideIn .42s cubic-bezier(.16,.84,.34,1)" }}>
                <div className="flex items-center justify-between border-b px-7 py-[26px]" style={{ borderColor: HAIR }}>
                    <div>
                        <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold">Your Selection</div>
                        <div className="mt-1 font-display text-[28px] font-semibold text-forest">Cart</div>
                    </div>
                    <button type="button" onClick={closeCart} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border bg-cream transition-[transform,background,color] duration-300 hover:rotate-90 hover:bg-forest hover:text-gold" style={{ borderColor: HAIR }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                </div>

                {lines.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                        <span className="text-[#8A7C68]"><Bag size={34} stroke={1.3} /></span>
                        <div className="mt-4 font-display text-[24px] text-forest">Your cart is empty.</div>
                        <p className="mt-2 w-[250px] text-[13px] text-[#8A7C68]">Every tin is peeled, dried and packed on the estate it came from.</p>
                        <button type="button" onClick={closeCart} className="mt-6 rounded-[25px] bg-forest px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-[#2b4d38]">Browse the store</button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-7">
                            {lines.map((l) => (
                                <div key={l.key} className="flex gap-4 border-b py-5" style={{ borderColor: "#EFE8D8" }}>
                                    <div className="relative h-[74px] w-[74px] flex-none overflow-hidden">
                                        <ImageSlot alt={l.p.name} label={l.p.name} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="font-display text-[19px] font-semibold leading-[1.15] text-forest">{l.p.name}</div>
                                            <button type="button" onClick={() => setLineQty(l.key, 0)} aria-label="Remove" className="text-[15px] leading-none text-[#8A7C68] transition-colors hover:text-[#8A5B33]">×</button>
                                        </div>
                                        <div className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#8A7C68]">{l.size.label}</div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex h-[30px] items-center rounded-[25px]" style={{ border: `1px solid ${HAIR}`, background: "#F7F1E7" }}>
                                                <button type="button" onClick={() => setLineQty(l.key, l.qty - 1)} className="grid h-full w-8 place-items-center text-forest">−</button>
                                                <span className="w-6 text-center font-display text-[16px] text-forest">{l.qty}</span>
                                                <button type="button" onClick={() => setLineQty(l.key, l.qty + 1)} className="grid h-full w-8 place-items-center text-forest">+</button>
                                            </div>
                                            <div className="font-display text-[18px] font-semibold text-forest">{money(l.lineTotal)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-7 py-6" style={{ background: "#F7F1E7", borderTop: `1px solid ${HAIR}` }}>
                            <div className="flex justify-between text-[13.5px] text-[#5F5648]">
                                <span>Subtotal</span>
                                <span className="font-display text-[16px] text-forest">{money(subtotal)}</span>
                            </div>
                            <div className="mt-2 flex justify-between text-[13.5px] text-[#5F5648]">
                                <span>Shipping</span>
                                <span className="font-display text-[16px] text-forest">{shipping === 0 ? "Free" : money(shipping)}</span>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between border-t pt-4" style={{ borderColor: HAIR }}>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A7C68]">Total</span>
                                <span className="font-display text-[32px] font-semibold text-forest">{money(total)}</span>
                            </div>
                            <button type="button" onClick={checkout} className="mt-4 w-full rounded-[25px] bg-gold py-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-forest transition-colors hover:bg-[#d8ac52]">Checkout</button>
                            <p className="mt-3 text-center text-[11.5px] text-[#8A7C68]">Free shipping over {money(FREE_SHIP_AT)} · ships from Colombo</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}