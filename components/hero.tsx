import Image from "next/image";
import { trustBadges } from "@/lib/site-data";

/* Single-image hero with a slow Ken Burns zoom.
   Swap the file below if your hero image lives elsewhere. */
const HERO_IMG = "/hero/slide-3.jpg";

export default function Hero() {
    return (
        <section id="top" className="relative flex min-h-screen items-center overflow-hidden bg-[#16281d]">
            {/* Hero image — slow zoom in/out */}
            <Image
                src={HERO_IMG}
                alt="Ceylon spices"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ animation: "cs-ken 16s ease-in-out infinite alternate" }}
            />
            {/* Scrim */}
            <div aria-hidden className="absolute inset-0" style={{ background: "rgba(14,9,5,.4)" }} />

            {/* ---- Content ---- */}
            <div className="relative z-[2] mx-auto w-full max-w-[1280px] px-6 pb-[120px] pt-[130px] lg:px-11">
                <div className="max-w-[580px]">
                    <div className="mb-[26px] flex items-center gap-3.5">
                        <span className="h-px w-[42px] bg-gold" />
                        <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
              Authentic Sri Lankan Exports
            </span>
                    </div>

                    <h1 className="m-0 font-display text-[clamp(46px,5.4vw,80px)] font-semibold leading-[1.03] tracking-[-0.012em] text-cream">
                        Experience the World&apos;s Finest
                        <br />
                        <span className="font-normal italic text-gold">Ceylon Spices</span>
                    </h1>

                    <p className="mt-7 max-w-[480px] text-[16px] font-light leading-[1.75] text-cream/78">
                        Discover hand-selected premium spices sourced directly from Sri
                        Lanka and delivered worldwide with uncompromising quality.
                    </p>

                    <div className="mt-[38px] flex flex-wrap gap-4">
                        <a href="#shop" className="rounded-[25px] bg-gold px-[34px] py-4 text-[12.5px] font-medium uppercase tracking-[0.15em] text-forest transition-colors duration-300 hover:bg-[#d8ac52]">
                            Shop Collection
                        </a>
                        <a href="#heritage" className="rounded-[25px] border border-cream/50 px-[34px] py-4 text-[12.5px] uppercase tracking-[0.15em] text-cream transition-colors duration-300 hover:border-gold hover:text-gold">
                            Explore Heritage
                        </a>
                    </div>

                    <div className="mt-[30px] flex flex-wrap gap-x-[26px] gap-y-3 border-t border-cream/14 pt-[25px]">
                        {trustBadges.map((b) => (
                            <span key={b} className="flex items-center gap-[9px] text-[11.5px] uppercase tracking-[0.1em] text-cream/70">
                <span className="h-[5px] w-[5px] rounded-full bg-gold" />
                                {b}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}