"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/site-data";
import {getNavHref} from "@/lib/site-data"
import { useStore } from "@/components/store-context";
import { useAuth } from "@/components/auth-context";
import LanguageTranslator from "@/components/language-translator";


/* ---- inline icons (refined set: 21px, stroke 1.5, round caps/joins) ---- */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.4 } as const; // mobile toggle
const ico = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
} as const;

function IconSearch() {
    return (
        <svg {...ico}>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="15.5" y1="15.5" x2="20" y2="20" />
        </svg>
    );
}
function IconGlobe() {
    return (
        <svg {...ico}>
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <line x1="3.2" y1="9" x2="20.8" y2="9" />
            <line x1="3.2" y1="15" x2="20.8" y2="15" />
        </svg>
    );
}
function IconHeart() {
    return (
        <svg {...ico}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}
function IconBag() {
    return (
        <svg {...ico}>
            <circle cx="9" cy="20.5" r="1.15" />
            <circle cx="18" cy="20.5" r="1.15" />
            <path d="M2.5 3h2.3l2.4 12a1.8 1.8 0 0 0 1.77 1.45h8.05a1.8 1.8 0 0 0 1.77-1.42L21.5 7H6.2" />
        </svg>
    );
}
function IconUser() {
    return (
        <svg {...ico}>
            <circle cx="12" cy="7.5" r="4" />
            <path d="M4.5 20v-1a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v1" />
        </svg>
    );
}

const tagline = ["PURE", "HERITAGE", "·", "RICH", "FLAVOR"];

export default function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const { cartCount, openCart, openWish, wishlist } = useStore();
    const { user } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 70);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!langOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLangOpen(false);
        const onClick = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("mousedown", onClick);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("mousedown", onClick);
        };
    }, [langOpen]);

    const iconLink =
        "flex items-center text-inherit opacity-90 transition-[opacity,color] duration-300 hover:opacity-100 hover:text-gold";
    const navLink =
        "relative text-inherit opacity-90 transition-[opacity,color] duration-300 hover:opacity-100 hover:text-gold after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-[width] after:duration-300 after:content-[''] hover:after:w-full";

    const headerClass = [
        "fixed inset-x-0 top-0 z-60 flex items-center justify-between gap-6 border-b",
        "transition-[background,color,box-shadow,border-color,padding] duration-[450ms] ease-brand",
        scrolled
            ? "bg-cream/82 text-forest-700 border-hairline shadow-[0_6px_34px_rgba(31,58,42,0.08)] backdrop-blur-md py-2.5 px-6 lg:px-11"
            : "bg-transparent text-cream border-transparent py-4 px-6 lg:px-11",
    ].join(" ");

    return (
        <header className={headerClass}>
            {/* Brand */}
            <a href="#top" className="flex items-center gap-3 text-inherit shrink-0">
                <Image src="/logo/CS.png" alt="Ceylon Spicera crest" width={56} height={56} priority className="h-12 w-auto sm:h-14" />
                <span className="flex w-fit flex-col leading-none">
          <span className="font-display text-[15px] sm:text-[16px] font-semibold tracking-[0.14em] whitespace-nowrap text-inherit">CEYLON&nbsp;SPICERA</span>
          <span className="mt-[6px] flex justify-between font-sans text-[8px] font-medium tracking-[0.04em] text-inherit opacity-70">
            {tagline.map((t, i) => (
                <span key={i}>{t}</span>
            ))}
          </span>
        </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex gap-7 font-sans text-[14px] tracking-[0.05em]">
                {nav.map((link) => (
                    <a key={link} href={getNavHref(link)} className={navLink}>
                        {link}
                    </a>
                ))}
            </nav>

            {/* Utilities */}
            <div className="flex items-center gap-4 text-inherit">
                <a href="#" title="Search" className={`${iconLink} hidden sm:flex`}>
                    <IconSearch />
                </a>
                <div ref={langRef} className="relative hidden sm:block">
                    <button
                        type="button"
                        title="Language"
                        aria-expanded={langOpen}
                        onClick={() => setLangOpen((v) => !v)}
                        className={`${iconLink} flex gap-1.5 text-[13px] tracking-[0.08em]`}
                    >
                        <IconGlobe />
                        EN
                    </button>
                    {/* Kept mounted (just hidden) rather than conditionally rendered — Google's
                        translate widget initialises once into this div and won't reappear
                        if the div is removed and recreated. */}
                    <div
                        className="absolute right-0 top-full mt-3 min-w-[170px] rounded-[10px] border border-hairline bg-cream px-3 py-2.5 text-forest-700 shadow-[0_20px_40px_rgba(31,58,42,0.15)]"
                        hidden={!langOpen}
                    >
                        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">Translate page</div>
                        <LanguageTranslator />
                    </div>
                </div>
                <button type="button" onClick={openWish} title="Wishlist" className={`${iconLink} relative hidden sm:flex`}>
                    <IconHeart />
                    {wishlist.size > 0 && (
                        <span className="absolute -top-2 -right-2.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-gold px-[3px] text-[9px] font-medium text-forest">
              {wishlist.size}
            </span>
                    )}
                </button>
                <button type="button" onClick={openCart} title="Cart" className={`${iconLink} relative`}>
                    <IconBag />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-gold px-[3px] text-[9px] font-medium text-forest">
              {cartCount}
            </span>
                    )}
                </button>
                <Link href="/account" title={user ? user.name : "Account"} className={`${iconLink} hidden sm:flex`}>
                    <IconUser />
                </Link>
                <a href="/shop" className="hidden sm:inline-block rounded-[25px] bg-gold px-[22px] py-[11px] text-[12px] font-medium uppercase tracking-[0.14em] text-forest transition-colors duration-300 hover:bg-[#d8ac52]">
                    Shop Now
                </a>

                {/* Mobile menu toggle */}
                <button type="button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)} className={`${iconLink} lg:hidden`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
                        {menuOpen ? (
                            <>
                                <line x1="6" y1="6" x2="18" y2="18" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="7" x2="21" y2="7" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="17" x2="21" y2="17" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
                <div className="absolute left-0 right-0 top-full lg:hidden border-t border-hairline bg-cream/97 backdrop-blur-md shadow-[0_20px_40px_rgba(31,58,42,0.1)]">
                    <nav className="flex flex-col px-6 py-3 font-sans text-[14px] tracking-[0.04em] text-forest-700">
                        {nav.map((link) => (
                            <a
                                key={link}
                                href={getNavHref(link)}
                                onClick={() => setMenuOpen(false)}
                                className="border-b border-hairline py-3 last:border-0 transition-colors hover:text-gold"
                            >
                                {link}
                            </a>
                        ))}
                        <a href="#shop" onClick={() => setMenuOpen(false)} className="mt-3 mb-2 rounded-[25px] bg-gold px-6 py-3 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-forest">
                            Shop Now
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}