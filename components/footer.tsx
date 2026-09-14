import Image from "next/image";
import { footer } from "@/lib/site-data";

const socialClass =
    "flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[rgba(44,44,44,0.18)] text-[rgba(44,44,44,0.6)] transition-colors duration-300 hover:border-spice hover:text-spice";

export default function Footer() {
    return (
        <footer className="border-t border-[rgba(44,44,44,0.1)] bg-cream text-[rgba(44,44,44,0.68)]">
            <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-10 px-6 pb-10 pt-20 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)] lg:px-11">
                {/* Brand block */}
                <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                    <div className="mb-5 flex items-center gap-3">
                        <Image src="/logo/CS.png" alt="Ceylon Spicera crest" width={72} height={72} className="h-[72px] w-auto" />
                        <span className="font-display text-[22px] leading-[1.1] tracking-[0.26em] text-forest">
              CEYLON
              <br />
              SPICERA
            </span>
                    </div>
                    <p className="max-w-[280px] text-[13px] font-light leading-[1.7]">
                        Premium Sri Lankan spices, hand-selected and exported worldwide with
                        uncompromising quality.
                    </p>
                    <div className="mt-6 flex gap-2.5">
                        <a href="#" title="Instagram" className={socialClass}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
                                <rect x="3" y="3" width="18" height="18" rx="5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                            </svg>
                        </a>
                        <a href="#" title="Facebook" className={`${socialClass} font-display text-[18px]`}>
                            f
                        </a>
                        <a href="#" title="LinkedIn" className={`${socialClass} text-[11px] tracking-[0.04em]`}>
                            in
                        </a>
                        <a href="#" title="YouTube" className={socialClass}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 6v12l10-6z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Link columns */}
                {footer.map((col) => (
                    <div key={col.title}>
                        <div className="mb-[18px] text-[11px] uppercase tracking-[0.2em] text-spice">
                            {col.title}
                        </div>
                        <div className="flex flex-col gap-[11px]">
                            {col.links.map((l) => (
                            <a
                                key={l}
                                href="#"
                                className="text-[13px] text-[rgba(44,44,44,0.62)] transition-colors duration-300 hover:text-spice"
                                >
                            {l}
                                </a>
                                ))}
                        </div>
                    </div>
                    ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[rgba(44,44,44,0.12)]">
                <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-[22px] text-[12px] text-[rgba(44,44,44,0.5)] lg:px-11">
                    <span>© 2026 Ceylon Spicera. All rights reserved.</span>
                    <span className="uppercase tracking-[0.16em] text-spice">
            Crafted in Sri Lanka
          </span>
                </div>
            </div>
        </footer>
    );
}