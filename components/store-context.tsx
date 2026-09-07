"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Cart = Record<string, number>; // key: `${productId}|${sizeKey}`

type StoreCtx = {
    cart: Cart;
    cartCount: number;
    addToCart: (idOrProduct: string | { id: string }, size?: string, qty?: number) => void;
    setLineQty: (key: string, qty: number) => void;
    wishlist: Set<string>;
    wished: (id: string) => boolean;
    toggleWish: (id: string) => void;
    wishBeatId: string | null;
    cartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    wishOpen: boolean;
    openWish: () => void;
    closeWish: () => void;
    quickId: string | null;
    openQuick: (id: string) => void;
    closeQuick: () => void;
};

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = "cs_cart";
const WISH_KEY = "cs_wishlist";

export function StoreProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>({});
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [wishBeatId, setWishBeatId] = useState<string | null>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const [quickId, setQuickId] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    /* Load persisted state once (client only) */
    useEffect(() => {
        try {
            const c = localStorage.getItem(CART_KEY);
            if (c) setCart(JSON.parse(c));
            const w = localStorage.getItem(WISH_KEY);
            if (w) setWishlist(new Set(JSON.parse(w) as string[]));
        } catch {
            /* ignore corrupt storage */
        }
        setHydrated(true);
    }, []);

    /* Persist on change (after first load) */
    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch {}
    }, [cart, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(WISH_KEY, JSON.stringify([...wishlist]));
        } catch {}
    }, [wishlist, hydrated]);

    const addToCart: StoreCtx["addToCart"] = (idOrProduct, size = "100g", qty = 1) => {
        const id = typeof idOrProduct === "string" ? idOrProduct : idOrProduct.id;
        const key = `${id}|${size}`;
        setCart((p) => ({ ...p, [key]: (p[key] ?? 0) + qty }));
    };

    const setLineQty = (key: string, qty: number) =>
        setCart((p) => {
            const n = { ...p };
            if (qty <= 0) delete n[key];
            else n[key] = qty;
            return n;
        });

    const wished = (id: string) => wishlist.has(id);
    const toggleWish = (id: string) =>
        setWishlist((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else {
                n.add(id);
                setWishBeatId(id);
                setTimeout(() => setWishBeatId((b) => (b === id ? null : b)), 430);
            }
            return n;
        });

    const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

    const value = useMemo<StoreCtx>(
        () => ({
            cart,
            cartCount,
            addToCart,
            setLineQty,
            wishlist,
            wished,
            toggleWish,
            wishBeatId,
            cartOpen,
            openCart: () => setCartOpen(true),
            closeCart: () => setCartOpen(false),
            wishOpen,
            openWish: () => setWishOpen(true),
            closeWish: () => setWishOpen(false),
            quickId,
            openQuick: (id: string) => setQuickId(id),
            closeQuick: () => setQuickId(null),
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cart, cartCount, wishlist, wishBeatId, cartOpen, wishOpen, quickId]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
    const c = useContext(Ctx);
    if (!c) throw new Error("useStore must be used within StoreProvider");
    return c;
}