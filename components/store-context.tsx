"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { sizeId } from "@/lib/shop-data";
import { useCatalog } from "@/lib/catalog-context";
import { useAuth, type User } from "@/components/auth-context";

type Cart = Record<string, number>; // key: `${productId}|${sizeKey}`

type CartItemPayload = {
    id: number;
    product: { id: number };
    size: { id: number; size_key: string };
    quantity: number;
};
type CartPayload = { id: number | null; items: CartItemPayload[] };
type WishlistProductPayload = { id: number };

type StoreCtx = {
    cart: Cart;
    cartCount: number;
    addToCart: (idOrProduct: string | { id: string }, size?: string, qty?: number) => void;
    setLineQty: (key: string, qty: number) => void;
    refreshCart: () => Promise<void>;
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

const WISH_KEY = "cs_wishlist";

function cartFromPayload(data: CartPayload): { cart: Cart; itemIds: Record<string, number> } {
    const cart: Cart = {};
    const itemIds: Record<string, number> = {};
    for (const item of data.items) {
        const key = `${item.product.id}|${item.size.size_key}`;
        cart[key] = item.quantity;
        itemIds[key] = item.id;
    }
    return { cart, itemIds };
}

export function StoreProvider({ children }: { children: ReactNode }) {
    const { getProduct } = useCatalog();
    const { user, ready } = useAuth();

    const [cart, setCart] = useState<Cart>({});
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [wishBeatId, setWishBeatId] = useState<string | null>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const [quickId, setQuickId] = useState<string | null>(null);

    const itemIdsRef = useRef<Record<string, number>>({});
    const prevUserRef = useRef<User | null>(null);

    const syncCartFromServer = (data: CartPayload) => {
        const { cart: nextCart, itemIds } = cartFromPayload(data);
        itemIdsRef.current = itemIds;
        setCart(nextCart);
    };

    /** Re-fetch the cart from the server — e.g. after an order clears it. */
    const refreshCart = async () => {
        try {
            const res = await apiGet<{ data: CartPayload }>("/api/cart");
            syncCartFromServer(res.data);
        } catch {
            /* ignore — next mutation will reconcile */
        }
    };

    /* Hydrate the cart (guest-token or session cookie) once on mount. */
    useEffect(() => {
        apiGet<{ data: CartPayload }>("/api/cart")
            .then((res) => syncCartFromServer(res.data))
            .catch(() => {
                /* API unreachable — cart stays empty until it's back */
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Guest wishlist persists locally so it survives a reload before sign-in. */
    useEffect(() => {
        try {
            const raw = localStorage.getItem(WISH_KEY);
            if (raw) setWishlist(new Set(JSON.parse(raw) as string[]));
        } catch {
            /* ignore corrupt storage */
        }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem(WISH_KEY, JSON.stringify([...wishlist]));
        } catch {
            /* ignore */
        }
    }, [wishlist]);

    /* On sign-in (fresh or rehydrated session): merge the guest cart into the
       user's cart, and union the local wishlist with the user's saved one. */
    useEffect(() => {
        if (!ready || !user || prevUserRef.current) {
            prevUserRef.current = user;
            return;
        }
        prevUserRef.current = user;

        apiPost<{ data: CartPayload }>("/api/cart/merge")
            .then((res) => syncCartFromServer(res.data))
            .catch(() => {});

        apiGet<{ data: WishlistProductPayload[] }>("/api/wishlist")
            .then((res) => {
                const serverIds = new Set(res.data.map((p) => String(p.id)));
                setWishlist((local) => {
                    for (const id of local) {
                        if (!serverIds.has(id)) apiPost(`/api/wishlist/${id}`).catch(() => {});
                    }
                    return new Set([...local, ...serverIds]);
                });
            })
            .catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, user]);

    const addToCart: StoreCtx["addToCart"] = (idOrProduct, size = "100g", qty = 1) => {
        const id = typeof idOrProduct === "string" ? idOrProduct : idOrProduct.id;
        const key = `${id}|${size}`;
        setCart((p) => ({ ...p, [key]: (p[key] ?? 0) + qty }));

        const product = getProduct(id);
        const productSizeId = product ? sizeId(product, size) : undefined;
        if (!product || !productSizeId) return;

        apiPost<{ data: CartPayload }>("/api/cart/items", {
            product_id: product.numericId,
            product_size_id: productSizeId,
            quantity: qty,
        })
            .then((res) => syncCartFromServer(res.data))
            .catch(() => {
                /* optimistic value stands; next cart fetch reconciles */
            });
    };

    const setLineQty = (key: string, qty: number) => {
        setCart((p) => {
            const n = { ...p };
            if (qty <= 0) delete n[key];
            else n[key] = qty;
            return n;
        });

        const itemId = itemIdsRef.current[key];
        if (itemId == null) return;

        const request = qty <= 0 ? apiDelete<{ data: CartPayload }>(`/api/cart/items/${itemId}`) : apiPatch<{ data: CartPayload }>(`/api/cart/items/${itemId}`, { quantity: qty });

        request.then((res) => syncCartFromServer(res.data)).catch(() => {});
    };

    const wished = (id: string) => wishlist.has(id);
    const toggleWish = (id: string) =>
        setWishlist((prev) => {
            const n = new Set(prev);
            if (n.has(id)) {
                n.delete(id);
                if (user) apiDelete(`/api/wishlist/${id}`).catch(() => {});
            } else {
                n.add(id);
                setWishBeatId(id);
                setTimeout(() => setWishBeatId((b) => (b === id ? null : b)), 430);
                if (user) apiPost(`/api/wishlist/${id}`).catch(() => {});
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
            refreshCart,
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
        [cart, cartCount, wishlist, wishBeatId, cartOpen, wishOpen, quickId, user]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
    const c = useContext(Ctx);
    if (!c) throw new Error("useStore must be used within StoreProvider");
    return c;
}
