import Image from "next/image";
import Reveal from "@/components/reveal";
import { categories } from "@/lib/site-data";

/* ---- Category photos live here (not in site-data) ----
   Drop files in public/categories/ and map them by category name.
   Remove/comment a line to fall back to the placeholder for that card.
   Match the file extension to your actual files (.jpg/.png/.webp). */
const CATEGORY_IMG: Record<string, string> = {
    "Ceylon Cinnamon": "/categories/cinnamon.jpg",
    "Black Pepper": "/categories/black-pepper.jpg",
    "Green Cardamom": "/categories/cardamom.jpg",
    "Cloves": "/categories/cloves.jpg",
    "Nutmeg & Mace": "/categories/nutmeg.jpg",
    "Coriander": "/categories/Coriander.jpg",
};

export default function FeaturedCategories() {
    return (
        <section id="categories" className="mx-auto max-w-[1280px] px-6 py-16 sm:py-20 lg:px-11 lg:py-[118px]">
            <Reveal className="mb-14 text-center">
        <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
          The Collection
        </span>
                <h2 className="mt-4 font-display text-[clamp(34px,4vw,52px)] font-semibold tracking-[-0.01em] text-forest">
                    Explore Our Spices
                </h2>
            </Reveal>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {categories.map((c) => {
                    const img = CATEGORY_IMG[c.name];
                    return (
                        <Reveal key={c.name} delay={c.delay}>
                        <a
                            href="#shop"
                            className="group relative flex h-[180px] flex-col justify-end overflow-hidden rounded-[6px] border border-[rgba(44,44,44,0.07)] transform-gpu transition-[translate,box-shadow] duration-500 ease-brand hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(31,58,42,0.45)] sm:h-[260px] lg:h-[340px]"
                            style={{
                            backgroundColor: "#e6ddca",
                            backgroundImage:
                                "repeating-linear-gradient(45deg,rgba(138,79,36,.07) 0 14px,rgba(138,79,36,0) 14px 28px)",
                        }}
                            >
                            {img ? (
                                <Image
                                    src={img}
                                    alt={c.name}
                                    fill
                                    sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.06]"
                                />
                            ) : (
                                <span className="absolute left-[18px] top-4 font-mono text-[9px] uppercase tracking-[0.22em] text-[rgba(44,44,44,0.32)]">
                    Photo · {c.name}
                  </span>
                            )}
                            <div
                                className="relative px-3 py-3 text-cream sm:px-[22px] sm:py-6"
                                style={{ background: "linear-gradient(transparent,rgba(22,40,29,.86) 55%)" }}
                            >
                                <div className="mb-1 text-[9px] uppercase tracking-[0.1em] text-gold sm:mb-1.5 sm:text-[11px] sm:tracking-[0.14em]">
                                    {c.tag}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-display text-[16px] font-medium sm:text-[28px]">{c.name}</span>
                                    <span className="text-[14px] text-gold transition-transform duration-300 group-hover:translate-x-1 sm:text-[20px]">
                      →
                    </span>
                                </div>
                            </div>
                        </a>
                </Reveal>
                );
                })}
            </div>
        </section>
    );
}