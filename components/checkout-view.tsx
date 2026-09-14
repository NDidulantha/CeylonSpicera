"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { useStore } from "@/components/store-context";
import { useCatalog } from "@/lib/catalog-context";
import { COUNTRIES } from "@/lib/countries";
import { sizePrice, money, type Product } from "@/lib/shop-data";
import { apiGet, apiPost, ApiError } from "@/lib/api";

/* ---- palette (page-local) ---- */
const HAIR = "#E4D8BF";
const SAND = "#EFE8D8";
const OLIVE = "#1F3A2A";
const GOLD = "#C59A3D";
const TERRA = "#8A5B33";
const BODY = "#5F5648";
const MUTED = "#8A7C68";
const FAINT = "#B5A88F";
const LABEL = "#3d3a33";
const PAPER = "#F3EDDF";
const INK = "#2b2317";

/* Reference shipping data (Section 13 of the backend spec) — there is no
   public listing endpoint for this, it mirrors the seeded shipping_rates. */
const RATES = [
    { key: "standard", name: "Standard export", eta: "8–12 working days · tracked", price: 9.5 },
    { key: "express", name: "Express air", eta: "3–5 working days · tracked", price: 24 },
];
const FREE_AT = 75;
const GIFT_WRAP = 6;

type Address = {
    first_name: string;
    last_name: string;
    company: string | null;
    country: string;
    street: string;
    apartment: string | null;
    city: string;
    state: string | null;
    postcode: string;
    phone: string | null;
};

type QuoteData = {
    subtotal_cents: number;
    discount_cents: number;
    shipping_cents: number;
    gift_wrap_cents: number;
    duty_cents: number;
    total_cents: number;
    promo_code: { code: string; type: "percent" | "fixed"; value: number } | null;
};

type OrderItemData = { id: number; product_name: string; size_label: string; quantity: number; line_total_cents: number };
type OrderData = {
    reference: string;
    status: string;
    total_cents: number;
    shipping_rate_key: string;
    email: string;
    shipping_address: Address;
    items: OrderItemData[];
};

type PayHerePayload = {
    checkout_url: string;
    merchant_id: string;
    order_id: string;
    amount: string;
    currency: string;
    hash: string;
    items: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
};

type Receipt = {
    reference: string;
    status: string;
    email: string;
    consignee: string;
    street: string;
    apartment: string | null;
    city: string;
    postcode: string;
    country: string;
    rateName: string;
    rateEta: string;
    items: { key: string; label: string; total: number }[];
    total: number;
    paidOn: string;
};

function buildReceipt(order: OrderData): Receipt {
    const rate = RATES.find((r) => r.key === order.shipping_rate_key);
    return {
        reference: order.reference,
        status: order.status,
        email: order.email,
        consignee: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`.trim(),
        street: order.shipping_address.street,
        apartment: order.shipping_address.apartment,
        city: order.shipping_address.city,
        postcode: order.shipping_address.postcode,
        country: order.shipping_address.country,
        rateName: rate?.name ?? order.shipping_rate_key,
        rateEta: rate?.eta ?? "",
        items: order.items.map((it) => ({
            key: String(it.id),
            label: `${it.product_name} · ${it.size_label} × ${it.quantity}`,
            total: it.line_total_cents / 100,
        })),
        total: order.total_cents / 100,
        paidOn: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
}

function submitToPayHere(payload: PayHerePayload) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = payload.checkout_url;
    (Object.keys(payload) as (keyof PayHerePayload)[])
        .filter((key) => key !== "checkout_url")
        .forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(payload[key] ?? "");
            form.appendChild(input);
        });
    document.body.appendChild(form);
    form.submit();
}

const inputCls =
    "w-full rounded-[25px] border bg-white px-4 py-3 font-sans text-[14px] font-light text-[#232323] outline-none transition-colors duration-300 focus:border-gold";
const labelCls = "mb-2 block font-sans text-[13px] font-medium";

function Label({ children, req }: { children: React.ReactNode; req?: boolean }) {
    return (
        <span className={labelCls} style={{ color: LABEL }}>
      {children}
            {req && <span style={{ color: TERRA }}> *</span>}
    </span>
    );
}

/* ---- card helpers (front-end formatting only — never transmitted; PayHere's
   own hosted checkout collects and processes the real payment details) ---- */
const luhn = (n: string) => {
    const d = n.replace(/\D/g, "");
    if (d.length < 12) return false;
    let sum = 0, alt = false;
    for (let i = d.length - 1; i >= 0; i--) {
        let x = parseInt(d[i], 10);
        if (alt) { x *= 2; if (x > 9) x -= 9; }
        sum += x; alt = !alt;
    }
    return sum % 10 === 0;
};
const brandOf = (n: string) => {
    const d = n.replace(/\D/g, "");
    if (/^4/.test(d)) return "VISA";
    if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "MASTERCARD";
    if (/^3[47]/.test(d)) return "AMEX";
    return "";
};
const groupCard = (v: string) => v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
};
const expValid = (v: string) => {
    const m = parseInt(v.slice(0, 2), 10), y = parseInt(v.slice(3), 10);
    if (!m || m < 1 || m > 12 || !y) return false;
    const now = new Date();
    const yr = 2000 + y;
    return yr > now.getFullYear() || (yr === now.getFullYear() && m >= now.getMonth() + 1);
};

export default function CheckoutView() {
    const { user, ready } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cart, setLineQty, refreshCart } = useStore();
    const { products: CATALOG } = useCatalog();

    const [step, setStep] = useState<"details" | "payment" | "done">("details");
    const [err, setErr] = useState("");
    const [placing, setPlacing] = useState(false);
    const [receipt, setReceipt] = useState<Receipt | null>(null);

    const [promoInput, setPromoInput] = useState("");
    const [promo, setPromo] = useState<string | null>(null);
    const [promoErr, setPromoErr] = useState("");
    const [quote, setQuote] = useState<QuoteData | null>(null);

    const [v, setV] = useState({
        first: "", last: "", company: "", country: "Sri Lanka", street: "", apt: "",
        city: "", state: "", zip: "", phone: "", email: "",
        rate: "standard", gift: false, giftMsg: "", notes: "", news: true,
        method: "card" as "card" | "paypal",
        card: "", cardName: "", exp: "", cvc: "",
    });
    const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setV({ ...v, [k]: e.target.value });

    const topRef = useRef<HTMLDivElement>(null);
    useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [step]);

    /* auth gate */
    useEffect(() => {
        if (ready && !user) router.replace("/account?returnTo=%2Fcheckout");
    }, [ready, user, router]);

    useEffect(() => {
        if (user) setV((s) => ({ ...s, email: s.email || user.email, first: s.first || user.name.split(" ")[0] || "" }));
    }, [user]);

    /* Returning from PayHere's hosted checkout: read the receipt back from
       the server rather than trusting anything in the URL. */
    useEffect(() => {
        const reference = searchParams.get("reference");
        if (!reference) return;
        if (searchParams.get("cancelled")) {
            setErr("Payment was cancelled. You can try again below.");
            setStep("payment");
            return;
        }
        apiGet<{ data: OrderData }>(`/api/orders/${reference}`)
            .then((res) => {
                setReceipt(buildReceipt(res.data));
                setStep("done");
                refreshCart();
            })
            .catch(() => {
                setErr("We couldn't find that order. If you completed payment, check your email for confirmation.");
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* lines from the shared cart, for display only — the charged total
       always comes from the server quote below. */
    const lines = useMemo(() => {
        return Object.entries(cart)
            .map(([key, qty]) => {
                const [pid, sizeKey] = key.split("|");
                const p = CATALOG.find((x) => x.id === pid);
                const size = p?.sizes.find((s) => s.key === sizeKey);
                if (!p || !size) return null;
                const q = Math.max(1, Math.min(99, qty));
                return { key, p, s: size, qty: q, total: sizePrice(p, sizeKey) * q };
            })
            .filter(Boolean) as { key: string; p: Product; s: NonNullable<Product["sizes"][number]>; qty: number; total: number }[];
    }, [cart, CATALOG]);

    /* The authoritative pricing breakdown — recomputed server-side every
       time the shipping rate, destination, gift-wrap flag or promo changes. */
    useEffect(() => {
        if (lines.length === 0) { setQuote(null); return; }
        let cancelled = false;
        const params = new URLSearchParams({
            shipping_key: v.rate,
            country: v.country || "Sri Lanka",
            gift_wrap: v.gift ? "1" : "0",
        });
        if (promo) params.set("promo_code", promo);

        apiGet<{ data: QuoteData }>(`/api/cart/quote?${params.toString()}`)
            .then((res) => {
                if (cancelled) return;
                setQuote(res.data);
                if (promo) setPromoErr("");
            })
            .catch((e) => {
                if (cancelled) return;
                setQuote(null);
                if (promo && e instanceof ApiError && e.errors?.promo_code) {
                    setPromoErr(e.fieldError ?? "That code was not recognised.");
                    setPromo(null);
                }
            });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, v.rate, v.country, v.gift, promo]);

    const localSub = lines.reduce((a, l) => a + l.total, 0);
    const sub = quote ? quote.subtotal_cents / 100 : localSub;
    const disc = quote ? quote.discount_cents / 100 : 0;
    const afterDisc = sub - disc;
    const rate = RATES.find((r) => r.key === v.rate)!;
    const carriage = quote ? quote.shipping_cents / 100 : (v.rate === "standard" && afterDisc >= FREE_AT ? 0 : rate.price);
    const wrap = quote ? quote.gift_wrap_cents / 100 : (v.gift ? GIFT_WRAP : 0);
    const duty = quote ? quote.duty_cents / 100 : 0;
    const total = quote ? quote.total_cents / 100 : Math.max(0, afterDisc + carriage + wrap + duty);
    const toFree = Math.max(0, FREE_AT - afterDisc);
    const pct = Math.min(100, (afterDisc / FREE_AT) * 100);
    const promoLabel = quote?.promo_code
        ? `${quote.promo_code.code} · ${quote.promo_code.type === "percent" ? `${quote.promo_code.value}% off` : `${money(quote.promo_code.value / 100)} off`}`
        : null;

    const cardOk = luhn(v.card) && v.cardName.trim() !== "" && expValid(v.exp) && /^\d{3,4}$/.test(v.cvc);
    const payValid = (v.method === "paypal" || cardOk) && !!quote && !placing;

    const applyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (!code) return;
        setPromoErr("");
        setPromo(code);
        setPromoInput("");
    };

    const proceed = () => {
        setErr("");
        if (!v.first.trim() || !v.last.trim()) return setErr("Please enter the name for the consignment.");
        if (!/^\S+@\S+\.\S+$/.test(v.email)) return setErr("Please enter a valid email address.");
        if (!v.street.trim() || !v.city.trim() || !v.zip.trim()) return setErr("Please complete the delivery address.");
        if (lines.length === 0) return setErr("Your cart is empty.");
        setStep("payment");
    };

    const placeOrder = async () => {
        if (!payValid) return;
        setErr("");
        setPlacing(true);
        try {
            const address: Address = {
                first_name: v.first.trim(),
                last_name: v.last.trim(),
                company: v.company.trim() || null,
                country: v.country,
                street: v.street.trim(),
                apartment: v.apt.trim() || null,
                city: v.city.trim(),
                state: v.state.trim() || null,
                postcode: v.zip.trim(),
                phone: v.phone.trim() || null,
            };

            const orderRes = await apiPost<{ data: OrderData }>("/api/orders", {
                shipping_address: address,
                billing_address: address,
                shipping_key: v.rate,
                gift_wrap: v.gift,
                gift_message: v.gift ? v.giftMsg || undefined : undefined,
                customer_notes: v.notes || undefined,
                promo_code: promo || undefined,
            });

            await refreshCart();

            const initiateRes = await apiPost<{ data: PayHerePayload }>("/api/payments/payhere/initiate", {
                order_reference: orderRes.data.reference,
            });

            if (!initiateRes.data.merchant_id) {
                setErr(`Payment isn't configured on the server yet (missing PayHere credentials). Your order was recorded as ${orderRes.data.reference} — add PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET to the backend .env, then contact us to complete payment.`);
                setPlacing(false);
                return;
            }

            submitToPayHere(initiateRes.data);
            // Browser navigates to PayHere — no need to clear `placing`.
        } catch (e) {
            setErr(e instanceof ApiError ? (e.fieldError ?? e.message) : "Something went wrong placing your order.");
            setPlacing(false);
        }
    };

    if (!ready || !user) return null;

    const title = step === "done" ? "Order Recorded" : step === "payment" ? "Payment" : "Checkout";

    return (
        <div ref={topRef} style={{ overflowX: "clip" }}>
            <style>{`
        @keyframes csFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes csPanelIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform:none } }
        @keyframes csStampIn { 0% { opacity:0; transform: rotate(-16deg) scale(1.9) } 60% { opacity:1; transform: rotate(-7deg) scale(.94) } 100% { transform: rotate(-7deg) scale(1) } }
        @media print { [data-noprint] { display: none !important } }
      `}</style>

            {/* Title band — hero treatment */}
            <section data-noprint className="relative overflow-hidden px-6 py-[76px] text-cream lg:px-11" style={{ backgroundImage: `linear-gradient(90deg,rgba(18,30,20,.94),rgba(18,30,20,.72) 58%,rgba(18,30,20,.5)), url('/shop/hero.jpg')`, backgroundSize: "cover", backgroundPosition: "center 60%" }}>
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-3.5 flex items-center gap-3.5">
                        <span className="h-px w-[42px] bg-gold" />
                        <span className="text-[11px] uppercase tracking-[0.42em] text-gold">Secure · TLS 1.3</span>
                    </div>
                    <h1 className="font-display text-[clamp(38px,4.6vw,60px)] font-bold leading-[1.02] tracking-[-0.015em]">{title}</h1>
                    <p className="mt-3 font-sans text-[12.5px] font-light text-[rgba(247,243,234,0.7)]">
                        Home · Shop · <span className="text-gold">{title}</span>
                    </p>
                </div>
            </section>

            {/* Body */}
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-14 bg-white px-6 pb-24 pt-14 lg:grid-cols-[1fr_372px] lg:px-11">
                {/* LEFT */}
                <div style={{ animation: "csFadeIn .35s ease" }}>
                    {step === "details" && (
                        <>
                            <h2 className="font-display text-[30px] font-semibold tracking-[-0.01em]" style={{ color: OLIVE }}>Billing Details</h2>
                            <div className="mt-6 grid grid-cols-1 gap-[22px] sm:grid-cols-2">
                                <label><Label req>First name</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="Ex. Nuwan" value={v.first} onChange={set("first")} autoComplete="given-name" /></label>
                                <label><Label req>Last name</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="Ex. Perera" value={v.last} onChange={set("last")} autoComplete="family-name" /></label>
                                <label className="sm:col-span-2"><Label>Company (optional)</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="Business name" value={v.company} onChange={set("company")} autoComplete="organization" /></label>
                                <label className="sm:col-span-2"><Label req>Country / region</Label>
                                    <select className={inputCls} style={{ borderColor: HAIR }} value={v.country} onChange={set("country")} autoComplete="country-name">
                                        {COUNTRIES.map((c) => (<option key={c}>{c}</option>))}
                                    </select>
                                </label>
                                <label className="sm:col-span-2"><Label req>Street address</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="House number and street name" value={v.street} onChange={set("street")} autoComplete="address-line1" /></label>
                                <label className="sm:col-span-2"><Label>Apartment, suite (optional)</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="Apartment, unit, floor" value={v.apt} onChange={set("apt")} autoComplete="address-line2" /></label>
                                <label><Label req>Town / city</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="Enter city" value={v.city} onChange={set("city")} autoComplete="address-level2" /></label>
                                <label><Label>State / province</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="Enter state" value={v.state} onChange={set("state")} autoComplete="address-level1" /></label>
                                <label><Label req>Post code</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="Enter post code" value={v.zip} onChange={set("zip")} autoComplete="postal-code" /></label>
                                <label><Label>Phone</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="+94 77 123 4567" value={v.phone} onChange={set("phone")} autoComplete="tel" /></label>
                                <label className="sm:col-span-2"><Label req>Email</Label><input className={inputCls} style={{ borderColor: HAIR }} placeholder="name@company.com" value={v.email} onChange={set("email")} autoComplete="email" spellCheck={false} /></label>
                            </div>

                            {/* Carriage */}
                            <h2 className="mt-12 font-display text-[30px] font-semibold tracking-[-0.01em]" style={{ color: OLIVE }}>Carriage</h2>
                            <div className="mt-5 flex flex-col gap-3">
                                {RATES.map((r) => {
                                    const on = v.rate === r.key;
                                    const free = r.key === "standard" && afterDisc >= FREE_AT;
                                    return (
                                        <button key={r.key} type="button" onClick={() => setV({ ...v, rate: r.key })} className="flex items-center gap-4 rounded-[16px] border px-[22px] py-[17px] text-left transition-colors duration-300" style={{ borderColor: on ? OLIVE : HAIR, background: on ? "rgba(31,58,42,.04)" : "#fff" }}>
                      <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border" style={{ borderColor: on ? OLIVE : HAIR }}>
                        {on && <span className="h-2 w-2 rounded-full" style={{ background: OLIVE }} />}
                      </span>
                                            <span className="flex-1">
                        <span className="block font-display text-[20px] font-semibold" style={{ color: OLIVE }}>{r.name}</span>
                        <span className="block font-sans text-[12.5px] font-light" style={{ color: MUTED }}>{r.eta}</span>
                      </span>
                                            <span className="font-display text-[19px] font-semibold" style={{ color: free ? "#3F7A55" : OLIVE }}>{free ? "Free" : money(r.price)}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Gift + notes */}
                            <div className="mt-8 flex flex-col gap-4">
                                <button type="button" role="checkbox" aria-checked={v.gift} onClick={() => setV({ ...v, gift: !v.gift })} className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-[4px] border" style={{ borderColor: HAIR, background: v.gift ? OLIVE : "transparent" }}>
                    {v.gift && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round"><path d="M5 12l5 5L20 6" /></svg>}
                  </span>
                                    <span className="font-sans text-[13.5px] font-light" style={{ color: BODY }}>Add gift wrap — linen wrap and a hand-written card ({money(GIFT_WRAP)}).</span>
                                </button>
                                {v.gift && (
                                    <textarea rows={3} className="rounded-[16px] border bg-white px-4 py-3 font-sans text-[14px] font-light outline-none focus:border-gold" style={{ borderColor: HAIR, animation: "csFadeIn .3s ease" }} placeholder="Gift message (optional)" value={v.giftMsg} onChange={set("giftMsg")} maxLength={300} />
                                )}
                                <label><Label>Order notes for our packers (optional)</Label>
                                    <textarea rows={3} className="w-full rounded-[16px] border bg-white px-4 py-3 font-sans text-[14px] font-light outline-none focus:border-gold" style={{ borderColor: HAIR }} value={v.notes} onChange={set("notes")} maxLength={400} placeholder="Anything we should know" />
                                </label>
                                <button type="button" role="checkbox" aria-checked={v.news} onClick={() => setV({ ...v, news: !v.news })} className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-[4px] border" style={{ borderColor: HAIR, background: v.news ? OLIVE : "transparent" }}>
                    {v.news && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round"><path d="M5 12l5 5L20 6" /></svg>}
                  </span>
                                    <span className="font-sans text-[13.5px] font-light" style={{ color: BODY }}>Send me the harvest notes — four letters a year.</span>
                                </button>
                            </div>

                            {err && <div role="alert" className="mt-6 rounded-[12px] border px-4 py-3 font-sans text-[13px]" style={{ borderColor: "#C08A62", color: TERRA, background: "#FBF8F1" }}>{err}</div>}

                            <button type="button" onClick={proceed} className="mt-7 w-full rounded-[25px] py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#2b4d38]" style={{ background: OLIVE }}>
                                Proceed to payment
                            </button>
                        </>
                    )}

                    {step === "payment" && (
                        <>
                            <button type="button" onClick={() => setStep("details")} className="font-sans text-[13px]" style={{ color: TERRA }}>← Back to billing details</button>

                            {/* Recap */}
                            <div className="mt-5 grid gap-6 rounded-[12px] p-6" style={{ background: "#FBF8F1", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
                                <div>
                                    <div className="font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Consigned to</div>
                                    <div className="mt-1.5 font-sans text-[13.5px] font-light" style={{ color: BODY }}>
                                        {v.first} {v.last}<br />{v.street}{v.apt ? `, ${v.apt}` : ""}<br />{v.city} {v.zip}, {v.country}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Carriage</div>
                                    <div className="mt-1.5 font-sans text-[13.5px] font-light" style={{ color: BODY }}>{rate.name}<br />{rate.eta}</div>
                                </div>
                            </div>

                            {/* Express */}
                            <h2 className="mt-10 font-display text-[30px] font-semibold tracking-[-0.01em]" style={{ color: OLIVE }}>Express Checkout</h2>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                <button type="button" aria-label="Pay with Apple Pay" onClick={() => setErr("Wallet payments connect with the backend.")} className="rounded-[25px] py-3 font-sans text-[13.5px] font-medium text-white transition-opacity hover:opacity-80" style={{ background: "#000" }}> Pay</button>
                                <button type="button" aria-label="Pay with Google Pay" onClick={() => setErr("Wallet payments connect with the backend.")} className="rounded-[25px] border py-3 font-sans text-[13.5px] font-medium transition-colors hover:bg-[#FBF8F1]" style={{ borderColor: HAIR, color: "#3c4043" }}>G Pay</button>
                                <button type="button" aria-label="Pay with PayPal" onClick={() => setErr("Wallet payments connect with the backend.")} className="rounded-[25px] py-3 font-sans text-[13.5px] font-bold transition-[filter] hover:brightness-105" style={{ background: "#FFC439", color: "#123b80" }}>PayPal</button>
                            </div>

                            <div className="my-8 flex items-center gap-4">
                                <span className="h-px flex-1" style={{ background: SAND }} />
                                <span className="font-sans text-[12.5px] font-light" style={{ color: MUTED }}>Or choose a payment method</span>
                                <span className="h-px flex-1" style={{ background: SAND }} />
                            </div>

                            {/* Methods */}
                            <div className="flex flex-col gap-3">
                                {([["card", "Credit or debit card", "Visa, Mastercard, American Express"], ["paypal", "PayPal", "You will be redirected to approve the payment"]] as const).map(([k, name, desc]) => {
                                    const on = v.method === k;
                                    return (
                                        <button key={k} type="button" onClick={() => setV({ ...v, method: k as "card" | "paypal" })} className="flex items-center gap-4 rounded-[16px] border px-[22px] py-[17px] text-left transition-colors duration-300" style={{ borderColor: on ? OLIVE : HAIR, background: on ? "rgba(31,58,42,.04)" : "#fff" }}>
                      <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border" style={{ borderColor: on ? OLIVE : HAIR }}>
                        {on && <span className="h-2 w-2 rounded-full" style={{ background: OLIVE }} />}
                      </span>
                                            <span className="flex-1">
                        <span className="block font-display text-[20px] font-semibold" style={{ color: OLIVE }}>{name}</span>
                        <span className="block font-sans text-[12.5px] font-light" style={{ color: MUTED }}>{desc}</span>
                      </span>
                                            {k === "card" && (
                                                <span className="hidden gap-1.5 sm:flex">
                          {["VISA", "MC", "AMEX"].map((c) => (<span key={c} className="rounded-[4px] border px-1.5 py-1 font-mono text-[8.5px] tracking-[0.1em]" style={{ borderColor: HAIR, color: MUTED }}>{c}</span>))}
                        </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {v.method === "card" ? (
                                <div className="mt-6 grid grid-cols-1 gap-[22px] sm:grid-cols-2" style={{ animation: "csFadeIn .3s ease" }}>
                                    <label className="relative sm:col-span-2"><Label req>Card number</Label>
                                        <input className={`${inputCls} font-mono tracking-[0.08em]`} style={{ borderColor: HAIR }} inputMode="numeric" autoComplete="cc-number" spellCheck={false} placeholder="4242 4242 4242 4242" value={v.card} onChange={(e) => setV({ ...v, card: groupCard(e.target.value) })} maxLength={24} />
                                        {brandOf(v.card) && <span className="absolute right-[18px] top-[42px] font-mono text-[9px] tracking-[0.1em]" style={{ color: MUTED }}>{brandOf(v.card)}</span>}
                                    </label>
                                    <label className="sm:col-span-2"><Label req>Name on card</Label><input className={inputCls} style={{ borderColor: HAIR }} autoComplete="cc-name" spellCheck={false} placeholder="As printed on the card" value={v.cardName} onChange={set("cardName")} /></label>
                                    <label><Label req>Expiry</Label><input className={`${inputCls} font-mono`} style={{ borderColor: HAIR }} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={v.exp} onChange={(e) => setV({ ...v, exp: fmtExp(e.target.value) })} maxLength={5} /></label>
                                    <label><Label req>Security code</Label><input type="password" className={`${inputCls} font-mono`} style={{ borderColor: HAIR }} inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" value={v.cvc} onChange={(e) => setV({ ...v, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} maxLength={4} /></label>
                                </div>
                            ) : (
                                <div className="mt-6 rounded-[12px] p-6 font-sans text-[13.5px] font-light" style={{ background: "#FBF8F1", color: BODY, animation: "csFadeIn .3s ease" }}>
                                    You will be taken to PayHere&apos;s secure checkout to approve this payment.
                                </div>
                            )}

                            <div className="mt-6 flex gap-3 rounded-[8px] p-4" style={{ background: "#FBF8F1" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth={1.5} className="mt-0.5 flex-none"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" /></svg>
                                <p className="font-sans text-[12.5px] font-light leading-[1.6]" style={{ color: BODY }}>
                                    Tokenised, encrypted end to end. Card details never touch our servers — you will complete payment on PayHere&apos;s own hosted checkout.
                                </p>
                            </div>
                            {err && <div role="alert" className="mt-4 rounded-[12px] border px-4 py-3 font-sans text-[13px]" style={{ borderColor: "#C08A62", color: TERRA }}>{err}</div>}
                        </>
                    )}

                    {step === "done" && receipt && (
                        <div className="mx-auto max-w-[720px] px-6 py-6 sm:px-12" style={{ background: PAPER, borderLeft: `3px solid ${TERRA}`, borderRadius: "2px 10px 10px 2px", boxShadow: "0 40px 90px -50px rgba(6,12,7,.7)", animation: "csPanelIn .6s cubic-bezier(.16,.84,.34,1)" }}>
                            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>
                                <span>Ceylon Spicera · Bill of Lading</span><span>{receipt.reference}</span>
                            </div>
                            <div className="my-4 border-t-2 border-double" style={{ borderColor: INK }} />
                            <div className="relative">
                                <h2 className="font-display text-[38px] font-bold tracking-[-0.01em]" style={{ color: INK }}>{receipt.status === "paid" ? "Order Recorded" : "Order Received"}</h2>
                                <p className="mt-2 font-sans text-[13.5px] font-light" style={{ color: BODY }}>
                                    {receipt.status === "paid" ? `A confirmation is on its way to ${receipt.email}.` : "Awaiting payment confirmation from PayHere."}
                                </p>

                                {/* stamp */}
                                {receipt.status === "paid" && (
                                    <div data-noprint className="pointer-events-none absolute -top-2 right-0 hidden h-[150px] w-[150px] items-center justify-center rounded-full text-center sm:flex" style={{ border: `2px solid ${TERRA}`, outline: `1px solid ${TERRA}`, outlineOffset: 5, color: TERRA, animation: "csStampIn .8s cubic-bezier(.16,.84,.34,1) .3s both" }}>
                                        <div className="font-mono text-[11px] uppercase leading-[2] tracking-[0.22em]">Paid<br />{receipt.paidOn}<br />Colombo</div>
                                    </div>
                                )}

                                <div className="mt-8 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
                                    <div>
                                        <div className="font-mono text-[9.5px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>Consigned to</div>
                                        <div className="mt-1.5 font-sans text-[13.5px] font-light" style={{ color: INK }}>{receipt.consignee}<br />{receipt.street}{receipt.apartment ? `, ${receipt.apartment}` : ""}<br />{receipt.city} {receipt.postcode}, {receipt.country}</div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-[9.5px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>Carriage</div>
                                        <div className="mt-1.5 font-sans text-[13.5px] font-light" style={{ color: INK }}>{receipt.rateName}<br />{receipt.rateEta}</div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    {receipt.items.map((l) => (
                                        <div key={l.key} className="flex justify-between border-b py-2.5 font-sans text-[13.5px]" style={{ borderColor: "rgba(43,35,23,.12)", color: INK }}>
                                            <span>{l.label}</span><span className="font-display text-[16px]">{money(l.total)}</span>
                                        </div>
                                    ))}
                                    <div className="mt-4 flex items-baseline justify-between border-t-2 border-double pt-4" style={{ borderColor: INK }}>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>Total {receipt.status === "paid" ? "paid" : "due"}</span>
                                        <span className="font-display text-[36px] font-semibold" style={{ color: INK }}>{money(receipt.total)}</span>
                                    </div>
                                    <div className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>
                                        Paid via PayHere
                                    </div>
                                </div>

                                <div data-noprint className="mt-8 flex flex-wrap gap-3">
                                    <button type="button" onClick={() => window.print()} className="rounded-[25px] px-8 py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.15em] text-white" style={{ background: OLIVE }}>Print receipt</button>
                                    <button type="button" onClick={() => router.push("/shop")} className="rounded-[25px] border px-8 py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.15em]" style={{ borderColor: TERRA, color: TERRA }}>Continue shopping</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT — summary */}
                {step !== "done" && (
                    <aside data-noprint className="rounded-[10px] border lg:sticky lg:top-[110px]" style={{ borderColor: SAND }}>
                        <h2 className="border-b px-6 py-5 font-display text-[24px] font-semibold" style={{ borderColor: SAND, color: OLIVE }}>Order Summary</h2>

                        <div className="max-h-[300px] overflow-y-auto px-6">
                            {lines.length === 0 ? (
                                <p className="py-6 font-sans text-[13.5px] font-light" style={{ color: MUTED }}>Your cart is empty.</p>
                            ) : lines.map((l) => (
                                <div key={l.key} className="flex gap-3.5 border-b py-4" style={{ borderColor: SAND }}>
                                    <div className="flex h-[62px] w-[62px] flex-none items-center justify-center rounded-[6px] font-display text-[22px]" style={{ background: SAND, color: "#C0B49B" }}>{l.p.name[0]}</div>
                                    <div className="flex-1">
                                        <div className="font-display text-[18px] font-semibold leading-[1.2]" style={{ color: OLIVE }}>{l.p.name}</div>
                                        <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>{l.s.label}{l.p.lot ? ` · Lot ${l.p.lot}` : ""}</div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="flex h-[28px] items-center rounded-[25px] border" style={{ borderColor: HAIR }}>
                                                <button type="button" onClick={() => setLineQty(l.key, l.qty - 1)} className="grid h-full w-7 place-items-center" style={{ color: TERRA }}>−</button>
                                                <span className="w-5 text-center font-display text-[15px]" style={{ color: OLIVE }}>{l.qty}</span>
                                                <button type="button" onClick={() => setLineQty(l.key, l.qty + 1)} className="grid h-full w-7 place-items-center" style={{ color: TERRA }}>+</button>
                                            </div>
                                            <span className="font-display text-[19px] font-semibold" style={{ color: OLIVE }}>{money(l.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* free carriage progress */}
                        <div className="px-6 pt-4">
                            <div className="h-[3px] w-full rounded-full" style={{ background: SAND }}>
                                <div className="h-full rounded-full transition-[width] duration-[600ms] ease-[cubic-bezier(.16,.84,.34,1)]" style={{ width: `${pct}%`, background: GOLD }} />
                            </div>
                            <div className="mt-2 flex justify-between font-sans text-[11.5px] font-light" style={{ color: MUTED }}>
                                <span>{toFree > 0 ? `${money(toFree)} to free carriage` : "Free carriage unlocked"}</span>
                                <span>{Math.round(pct)}%</span>
                            </div>
                        </div>

                        {/* promo */}
                        <div className="px-6 pt-5">
                            {promo ? (
                                <div className="flex items-center justify-between rounded-[25px] border border-dashed px-4 py-2.5" style={{ borderColor: GOLD }}>
                                    <span className="font-sans text-[12.5px]" style={{ color: OLIVE }}>{promoLabel ?? `${promo} · checking…`}</span>
                                    <button type="button" onClick={() => setPromo(null)} aria-label="Remove code" style={{ color: TERRA }}>×</button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-2">
                                        <input className="flex-1 rounded-[25px] border px-4 py-2.5 font-sans text-[13px] font-light outline-none focus:border-gold" style={{ borderColor: HAIR, background: "#F7F1E7" }} placeholder="Promo code" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyPromo()} />
                                        <button type="button" onClick={applyPromo} className="rounded-[25px] px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white" style={{ background: OLIVE }}>Apply</button>
                                    </div>
                                    {promoErr && <div className="mt-2 font-sans text-[12px]" style={{ color: TERRA }}>{promoErr}</div>}
                                </>
                            )}
                        </div>

                        {/* totals */}
                        <div className="mt-5 px-6 py-5" style={{ background: "#FBF8F1", borderTop: `1px solid ${SAND}` }}>
                            {[
                                { l: "Subtotal", v: money(sub) },
                                ...(disc > 0 ? [{ l: "Discount", v: "−" + money(disc), terra: true }] : []),
                                { l: "Carriage", v: carriage === 0 ? "Free" : money(carriage), green: carriage === 0 },
                                ...(wrap > 0 ? [{ l: "Gift wrap", v: money(wrap) }] : []),
                                { l: v.country === "Sri Lanka" ? "Duty · domestic" : "Estimated duty", v: duty === 0 ? "—" : money(duty) },
                            ].map((r: any) => (
                                <div key={r.l} className="flex justify-between py-1.5 font-sans text-[13.5px] font-light" style={{ color: BODY }}>
                                    <span>{r.l}</span>
                                    <span style={{ color: r.terra ? TERRA : r.green ? "#3F7A55" : OLIVE }}>{r.v}</span>
                                </div>
                            ))}
                            <div className="mt-3 flex items-baseline justify-between border-t pt-3" style={{ borderColor: SAND }}>
                                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Total</span>
                                <span className="font-display text-[34px] font-semibold" style={{ color: OLIVE }}>{money(total)}</span>
                            </div>

                            {step === "payment" && (
                                <button type="button" onClick={placeOrder} disabled={!payValid} className="mt-4 w-full rounded-[25px] py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors duration-[350ms]" style={{ background: payValid ? OLIVE : SAND, color: payValid ? "#fff" : "#A99C86", cursor: payValid ? "pointer" : "not-allowed" }}>
                                    {placing ? "Placing order…" : !quote ? "Preparing your order…" : v.method === "paypal" ? `Continue to PayHere · ${money(total)}` : payValid ? `Place order · ${money(total)}` : "Complete the card details"}
                                </button>
                            )}
                        </div>
                    </aside>
                )}
            </div>

            {/* Trust strip */}
            <section data-noprint className="border-t bg-white px-6 py-12 lg:px-11" style={{ borderColor: SAND }}>
                <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 sm:grid-cols-3">
                    {[
                        { t: "Free carriage", d: `Standard export free above ${money(FREE_AT)}` },
                        { t: "Secure payment", d: "Tokenised and encrypted end to end" },
                        { t: "Traceable lots", d: "Every tin carries its estate and harvest" },
                    ].map((x) => (
                        <div key={x.t} className="flex items-center gap-4">
              <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full" style={{ background: "#F7F3EA", color: GOLD }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" /></svg>
              </span>
                            <span>
                <span className="block font-display text-[19px] font-semibold" style={{ color: OLIVE }}>{x.t}</span>
                <span className="block font-sans text-[12.5px] font-light" style={{ color: MUTED }}>{x.d}</span>
              </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
