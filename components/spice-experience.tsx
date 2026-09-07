import Image from "next/image";
import Reveal from "@/components/reveal";

/* ---- Gallery photos live here (drop files in public/experience/) ---- */
const EXPERIENCE_IMG: Record<string, string> = {
    Harvesting: "/experience/harvesting.jpg",
    Packaging: "/experience/packaging.png",
    Cooking: "/experience/cooking.jpg",
    Plantations: "/experience/plantations.jpg",
    "Luxury Kitchens": "/experience/luxury-kitchens.jpg",
    Restaurants: "/experience/restaurants.jpg",
};

const pinstripe =
    "repeating-linear-gradient(45deg,rgba(138,79,36,.07) 0 14px,rgba(138,79,36,0) 14px 28px)";

const tiles: { label: string; h: number }[] = [
    { label: "Harvesting", h: 350 },
    { label: "Packaging", h: 320 },
    { label: "Cooking", h: 380 },
    { label: "Plantations", h: 340 },
    { label: "Luxury Kitchens", h: 240 },
    { label: "Restaurants", h: 300 },
];

export default function SpiceExperience() {
    return (
        <section className="mx-auto max-w-[1280px] px-6 py-[118px] lg:px-11">
            <Reveal className="mb-13 text-center">
        <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
          The Experience
        </span>
                <h2 className="mt-4 font-display text-[clamp(34px,4vw,52px)] font-semibold tracking-[-0.01em] text-forest">
                    From Estate to Table
                </h2>
            </Reveal>

            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {tiles.map((t) => {
                    const img = EXPERIENCE_IMG[t.label];
                    return (
                        <Reveal key={t.label} className="mb-5 break-inside-avoid">
                            <div
                                className="group relative overflow-hidden rounded-[6px] border border-[rgba(44,44,44,0.07)]"
                                style={{ height: t.h, backgroundColor: "#e6ddca", backgroundImage: pinstripe }}
                            >
                                {img && (
                                    <Image
                                        src={img}
                                        alt={t.label}
                                        fill
                                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                                    />
                                )}
                                <div
                                    className="absolute inset-x-0 bottom-0 flex items-end p-[18px]"
                                    style={{ background: img ? "linear-gradient(transparent,rgba(22,40,29,.82))" : "transparent" }}
                                >
                  <span
                      className={`font-mono text-[9.5px] uppercase tracking-[0.2em] ${
                          img ? "text-cream/90" : "text-[rgba(44,44,44,0.35)]"
                      }`}
                  >
                    {img ? t.label : `Photo · ${t.label}`}
                  </span>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}