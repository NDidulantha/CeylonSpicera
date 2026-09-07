import Image from "next/image";
import Reveal from "@/components/reveal";

/* Inset newspaper photo. null keeps the placeholder. */
const HERITAGE_STORY_IMG: string | null = "/heritage/cinnamon-peeling.jpg";

export default function OurHeritage() {
    return (
        <section id="heritage" className="relative bg-forest px-5 py-[100px] sm:px-6 lg:px-11">
            <Reveal>
                <div
                    className="relative mx-auto max-w-[1080px] border border-[#d8cbaf] px-6 pb-10 pt-9 sm:px-[60px] sm:pb-[60px] sm:pt-[52px]"
                    style={{
                        background: "#EFE6D2",
                        backgroundImage: "radial-gradient(rgba(92,55,36,.05) 1px, transparent 1px)",
                        backgroundSize: "4px 4px",
                        color: "#2b2317",
                        boxShadow: "0 50px 90px -40px rgba(0,0,0,.6)",
                    }}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg,rgba(92,55,36,.07),transparent 20%,transparent 82%,rgba(92,55,36,.09))",
                        }}
                    />

                    {/* Masthead */}
                    <div className="border-b-[3px] border-double border-[#2b2317] pb-[18px] text-center">
                        <div className="mb-3 flex items-center justify-center gap-5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-[#5C3724]">
                            <span>Vol. MCMXXVI</span>
                            <span className="hidden h-px flex-1 bg-[#b7a884] sm:block" />
                            <span className="hidden sm:inline">Colombo · Ceylon</span>
                            <span className="h-px flex-1 bg-[#b7a884]" />
                            <span>Price · One Fanam</span>
                        </div>
                        <h2 className="m-0 font-display text-[clamp(38px,5.6vw,72px)] font-bold leading-[0.95] tracking-[0.01em] text-[#1a1408]">
                            The Ceylon Spice Chronicle
                        </h2>
                        <div className="mt-[14px] flex items-center justify-center gap-[14px] font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#5C3724]">
                            <span className="h-px flex-1 bg-[#2b2317]" />
                            <span className="text-center">
                Established on the Ancient Spice Routes · Two Thousand Years in Print
              </span>
                            <span className="h-px flex-1 bg-[#2b2317]" />
                        </div>
                    </div>

                    {/* Headline */}
                    <h3 className="mb-[6px] mt-[30px] text-center font-display text-[clamp(30px,4vw,50px)] font-bold leading-[1.04] text-[#1a1408]">
                        A Legacy Carried on the Ancient Spice Routes
                    </h3>
                    <div className="mb-[26px] border-y border-[#b7a884] py-[7px] text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C3724]">
                        From Our Correspondent · The Highlands of Ceylon
                    </div>

                    {/* Columns (real multi-column flow) */}
                    <div className="columns-1 text-justify font-display text-[16.5px] leading-[1.5] text-[#33291a] [column-gap:34px] lg:columns-3 lg:[column-rule:1px_solid_#c3b590]">
                        <p className="m-0">
              <span
                  className="float-left font-display font-bold"
                  style={{ fontSize: "74px", lineHeight: 0.72, padding: "6px 10px 0 0", color: "#5C3724" }}
              >
                F
              </span>
                            or more than two thousand years, traders crossed oceans for the
                            cinnamon of Ceylon — prized by the ancients, worth its weight in gold
                            in medieval markets, and coveted so fiercely that the Portuguese,
                            Dutch, and British each seized the island in turn to control the
                            world&apos;s only source of true cinnamon.
                        </p>

                        <figure className="my-[14px] break-inside-avoid border border-[#6f6146] bg-[#e6dabf] p-[6px]">
                            <div className="relative h-[150px] bg-[#e6dabf]">
                                {HERITAGE_STORY_IMG ? (
                                    <Image
                                        src={HERITAGE_STORY_IMG}
                                        alt="Cinnamon peeling, Ceylon, late 1800s"
                                        fill
                                        sizes="320px"
                                        className="object-cover"
                                        style={{ filter: "sepia(.55) contrast(1.05) brightness(.98)" }}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#5C3724]/50">
                                        Photo
                                    </div>
                                )}
                            </div>
                            <figcaption className="mt-[6px] text-center font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#5C3724]">
                                Cinnamon peeling, Ceylon · late 1800s
                            </figcaption>
                        </figure>

                        <p className="m-0 mb-3">
                            We honour that history with the same reverence for the land —
                            hand-harvesting at first light, drying in the mountain air, and
                            grading each batch by touch and by aroma alone. What finally arrives
                            at your door is not merely a spice, but the culmination of
                            generations of unbroken craft.
                        </p>
                        <p className="m-0">
                        <span className="font-semibold tracking-[0.04em] [font-variant:small-caps]">
                            Colombo.
                        </span>{" "}
                            — Three empires rose and fell over the right to trade these quills.
                            Today the same estates supply the finest kitchens of forty nations,
                            their harvest still peeled by hand and dried beneath the highland
                            sun, exactly as the old traders knew it.
                        </p>
                        {/*<div className="mt-3.5 break-inside-avoid">
                            <a
                            href="#"
                            className="inline-block border border-[#5C3724] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1a1408] transition-colors duration-300 hover:bg-[#1a1408] hover:text-[#EFE6D2]"
                            >
                            Read More
                        </a>
                    </div>*/}
                </div>

                {/* Footer rule */}
                <div className="mt-[30px] flex flex-wrap items-center justify-between gap-6 border-t-[3px] border-double border-[#2b2317] pt-4">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5C3724]">
                        Est. Trading · 1867 · Pure Ceylon
                    </div>
                    <a
                    href="#"
                    className="border-b border-[#5C3724] pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1a1408] transition-colors duration-300 hover:text-[#5C3724]"
                    >
                    Continued — Read Our Story →
                </a>
            </div>
        </div>
</Reveal>
</section>
);
}