import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "About Ceylon — Ceylon Spicera",
    description:
        "Grown, cured and priced on the island. The story, estates, families, and promise behind Ceylon Spicera.",
};

/* ---- Photos (drop files in public/about/) — null shows a fallback ---- */
const HERO_IMG: string | null = "/about/slide-2.jpg";
const FAMILIES_IMG: string | null = "/about/plantation.jpg";
const HERITAGE_IMG: string | null = "/about/heritage-engraving.jpg";
const HARVEST_IMG: string | null = "/about/harvest.jpg";

/* ---- Section toggles (spec) ---- */
const showTimeline = true;
const showFounders = true;

/* ---- Reusable classes ---- */
const wrap = "mx-auto max-w-[1180px] px-6 lg:px-11";
const eyebrow = "text-[11px] uppercase tracking-[0.42em] text-gold";
const bodyLight = "text-[16px] font-light leading-[1.85] text-[#5F5648]";
const cardLift =
    "transition-[translate,box-shadow] duration-[400ms] ease-brand hover:-translate-y-1";

/* ---- Data ---- */
const figures = [
    { n: "2020", l: "Founded in Colombo" },
    { n: "62", l: "Partner families" },
    { n: "4", l: "Estates, one ridge" },
    { n: "9", l: "Export markets" },
];

const ledger = [
    { l: "One pound of cinnamon, Venice", v: "7 sheep", accent: false },
    { l: "One pound of cloves, Venice", v: "A cow and a calf", accent: false },
    { l: "Paid to the grower in Ceylon", v: "Almost nothing", accent: true },
];

const estates = [
    { name: "Matale", crop: "Cinnamon", meta: "640 m · 34 acres" },
    { name: "Kandy", crop: "Clove", meta: "820 m · 22 acres" },
    { name: "Kegalle", crop: "Pepper", meta: "460 m · 28 acres" },
    { name: "Kandenuwara", crop: "Cardamom", meta: "1,100 m · 16 acres" },
];

const steps = [
    "Cut on the third day after rain, when the bark lifts clean",
    "Rubbed with the rod, then peeled in a single unbroken sheet",
    "Quilled by hand — thinner sheets nested inside thicker",
    "Four days on solar beds, graded by eye, never kiln-forced",
];

const familyStats = [
    { n: "62", l: "Partner families", gold: false },
    { n: "+22%", l: "Above auction price", gold: false },
    { n: "4", l: "Generations, average", gold: false },
    { n: "0", l: "Brokers in between", gold: true },
];

const sustainability = [
    { t: "Solar cured", b: "Drying beds on all four estates — no kiln, no diesel." },
    { t: "Whole plant", b: "Leaf and root distilled for oil; the rest composted on-estate." },
    { t: "Shade kept", b: "Canopy retained at sixty per cent — birds first, yield second." },
    { t: "No plastic", b: "Tins and quill wraps in unbleached kraft, no liner." },
];

const timeline = [
    { y: "2020", t: "Founded in Colombo. Four hundred kilos of Matale cinnamon graded, quilled and packed under our own name." },
    { y: "2021", t: "Written agreements with the first eighteen smallholder families. Farmgate price fixed above auction, before the season." },
    { y: "2022", t: "Organic and HACCP certification for the Matale curing house. First single-estate lot sheets issued." },
    { y: "2023", t: "First full container to Rotterdam. Ceylon Spicera reaches shelves in nine countries." },
    { y: "2024", t: "The tasting room opens at Cinnamon Gardens, Colombo 07. Trade visits by appointment." },
    { y: "2025", t: "Sixty-two partner families. Solar drying beds replace kiln curing across every estate." },
    { y: "2026", t: "Every tin traceable to one ridge and one season. The lot sheet ships in the box." },
];

const founders = [
    { i: "NW", name: "Nuwan Wijesinghe", role: "Founder & Managing Director", bio: "Grew up on the Matale ridge. Spent eleven years selling other people's cinnamon before deciding to sell his own." },
    { i: "AP", name: "Anjali Peiris", role: "Head of Sourcing", bio: "Walks every estate before every season. Sets the price the families are paid and defends it upward." },
    { i: "DF", name: "Dinesh Fernando", role: "Export & Quality", bio: "Grades by eye and by nose, then documents it twice. Signs off on nothing he has not smelled himself." },
];

const promise = [
    { t: "One origin", b: "Single-estate lots, never blended to hit a price." },
    { t: "One season", b: "Harvest date on the tin. Nothing held over a year." },
    { t: "One price", b: "Agreed with the grower before the cutting begins." },
    { t: "One name", b: "Ours on the box, the family's on the sheet inside." },
];

export default function AboutCeylonPage() {
    return (
        <>
            <SiteHeader />
            <main className="overflow-x-hidden">
                {/* HERO */}
                <section className="relative min-h-[80vh] overflow-hidden bg-forest px-6 pb-[96px] pt-[230px] text-cream lg:px-11">
                    {HERO_IMG && (
                        <Image src={HERO_IMG} alt="" fill priority sizes="100vw" className="object-cover" />
                    )}
                    <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(90deg,rgba(18,30,20,.52),rgba(18,30,20,.32) 55%,rgba(18,30,20,.5))" }}
                    />
                    <div className="relative mx-auto max-w-[1180px]">
                        <div className="mb-[22px] flex items-center gap-3.5">
                            <span className="h-px w-[42px] bg-gold" />
                            <span className={eyebrow}>About Ceylon Spicera</span>
                        </div>
                        <h1 className="font-display text-[clamp(42px,5.6vw,78px)] font-bold leading-[1.02] tracking-[-0.015em]">
                            Grown, Cured and
                            <br />
                            Priced on the Island
                        </h1>
                        <p className="mt-7 max-w-[560px] text-[16.5px] font-light leading-[1.8] text-[rgba(247,243,234,0.8)]">
                            Ceylon Spicera was founded in 2020 in Colombo, on a plain premise:
                            the island that grows the spice should be the island that grades,
                            cures, packs and prices it.
                        </p>
                    </div>
                </section>

                {/* STORY */}
                <section className={`${wrap} py-24`}>
                    <div className="grid grid-cols-1 items-start gap-[72px] lg:grid-cols-2">
                        <div>
                            <span className={eyebrow}>Our Story</span>
                            <h2 className="mt-4 font-display text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.05] tracking-[-0.01em] text-forest">
                                Four Hundred Kilos
                                <br />
                                and One Question
                            </h2>
                        </div>
                        <div className={bodyLight}>
                            <p>
                                For two thousand years the same cargo has left this island, and
                                for most of that time the profit was made somewhere else — in
                                Alexandria, in Venice, in a re-bagging shed at a foreign port.
                                The grower was paid least and named never.
                            </p>
                            <p className="mt-5">
                                We began in 2020 with four hundred kilos of Matale cinnamon,
                                graded and quilled under our own name, and a question worth
                                asking after all that history: what if the last mile started
                                here? Six years on, everything we sell comes off a forty-kilometre
                                stretch of the central highlands, bought from families we can
                                name.
                            </p>
                            <p className="mt-5">
                                No broker sits between the ridge and the tin. The lot sheet ships
                                in the box.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FIGURES (dark) */}
                <section className="bg-forest px-6 py-16 text-cream lg:px-11">
                    <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-10 lg:grid-cols-4">
                        {figures.map((f) => (
                            <div key={f.l}>
                                <div className="font-display text-[56px] font-semibold leading-none text-gold">
                                    {f.n}
                                </div>
                                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[rgba(247,243,234,0.62)]">
                                    {f.l}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* HERITAGE */}
                <section className={`${wrap} py-24`}>
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <div className="h-[420px] overflow-hidden rounded-[4px] border border-[#D8C8AE]" style={{ backgroundColor: "#e8dcc0" }}>
                            <div className="relative h-full w-full">
                                {HERITAGE_IMG ? (
                                    <Image src={HERITAGE_IMG} alt="Archival engraving of the Ceylon spice trade" fill sizes="(max-width:1024px) 100vw, 560px" className="object-cover" style={{ filter: "sepia(.28) saturate(.75)" }} />
                                ) : (
                                    <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(36,28,18,0.4)]" style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(138,79,36,.08) 0 16px,rgba(138,79,36,0) 16px 32px)" }}>
                                        Photo · The trade we inherited
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className={eyebrow}>Two Thousand Years</span>
                            <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em] text-forest">
                                The Trade We Inherited
                            </h2>
                            <p className={`mt-5 ${bodyLight}`}>
                                <span className="italic">Cinnamomum verum</span> — the true
                                cinnamon — takes its name from the only island that grows it
                                well. Roman and Arab traders wrote about it for centuries without
                                naming its position; a spice worth more than silver was worth a
                                lie about where it came from.
                            </p>
                            <p className={`mt-4 ${bodyLight}`}>
                                On the Rialto in the 1300s, a pound of Ceylon cinnamon was priced
                                beside metals and medicine. This is what a pound bought in a good
                                year — and what reached the grower.
                            </p>
                            <div className="mt-7">
                                {ledger.map((r, i) => (
                                    <div
                                        key={r.l}
                                        className={`flex items-center justify-between border-t border-[#D8C8AE] py-[13px] ${i === ledger.length - 1 ? "border-b" : ""}`}
                                    >
                                        <span className="text-[14px] font-light text-[#5F5648]">{r.l}</span>
                                        <span className={`font-display text-[19px] ${r.accent ? "italic text-[#8A5B33]" : "text-forest"}`}>
                      {r.v}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ESTATES (sandstone) */}
                <section className="bg-[#EFE8D8] px-6 py-24 lg:px-11">
                    <div className="mx-auto max-w-[1180px]">
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-10">
                            <div>
                                <span className={eyebrow}>The Land</span>
                                <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em] text-forest">
                                    Four Estates on One Ridge
                                </h2>
                            </div>
                            <p className="max-w-[460px] text-[15px] font-light leading-[1.8] text-[#5F5648]">
                                Between six hundred and eleven hundred metres in the central
                                highlands. Close enough that our graders walk the rows, far
                                enough apart that each estate tastes of its own soil.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {estates.map((e) => (
                                <div
                                    key={e.name}
                                    className={`rounded-[4px] border border-[#D8C8AE] bg-cream px-[26px] py-7 ${cardLift} hover:shadow-[0_24px_48px_-30px_rgba(31,58,42,0.45)]`}
                                >
                                    <div className="font-display text-[28px] font-semibold text-forest">{e.name}</div>
                                    <div className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-gold">{e.crop}</div>
                                    <div className="mt-3 text-[13.5px] text-[#8A7C68]">{e.meta}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* HARVEST */}
                <section className={`${wrap} py-24`}>
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <div className="order-2 lg:order-1">
                            <span className={eyebrow}>Harvest &amp; Cure</span>
                            <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em] text-forest">
                                Peeled by Hand, Still
                            </h2>
                            <p className={`mt-5 ${bodyLight}`}>
                                No machine has replaced the peeler&apos;s brass rod. The bark is
                                cut at the rains, bruised, lifted in one sheet and rolled inside
                                itself to dry — the same four movements photographed on this
                                island in the 1890s.
                            </p>
                            <div className="mt-7">
                                {steps.map((s, i) => (
                                    <div key={i} className="flex gap-5 border-t border-[#D8C8AE] py-4 first:border-t-0">
                    <span className="w-[26px] flex-none font-display text-[15px] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                                        <span className="text-[14.5px] font-light leading-[1.65] text-[#5F5648]">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 h-[520px] overflow-hidden rounded-[4px] border border-[#D8C8AE] lg:order-2" style={{ backgroundColor: "#e8dcc0" }}>
                            <div className="relative h-full w-full">
                                {HARVEST_IMG ? (
                                    <Image src={HARVEST_IMG} alt="Hand-peeling cinnamon" fill sizes="(max-width:1024px) 100vw, 560px" className="object-cover" style={{ objectPosition: "center 40%", filter: "sepia(.2) contrast(1.05)" }} />
                                ) : (
                                    <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(36,28,18,0.4)]" style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(138,79,36,.08) 0 16px,rgba(138,79,36,0) 16px 32px)" }}>
                                        Photo · Peeled by hand
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAMILIES (dark photo band) */}
                <section className="relative overflow-hidden bg-forest px-6 py-[92px] text-cream lg:px-11">
                    {FAMILIES_IMG && (
                        <Image src={FAMILIES_IMG} alt="" fill sizes="100vw" className="object-cover" />
                    )}
                    <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(18,30,20,.94),rgba(18,30,20,.74))" }} />
                    <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <div>
                            <span className={eyebrow}>The People</span>
                            <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em]">
                                Sixty-Two Families
                            </h2>
                            <p className="mt-5 text-[16px] font-light leading-[1.85] text-[rgba(247,243,234,0.8)]">
                                We buy from smallholders on written agreements, at a price set
                                before the season rather than at auction after it. Most of these
                                families have peeled cinnamon for four generations. They are named
                                on every lot sheet we ship.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-9">
                            {familyStats.map((s) => (
                                <div key={s.l}>
                                    <div className={`font-display text-[46px] font-semibold leading-none ${s.gold ? "text-gold" : "text-cream"}`}>
                                        {s.n}
                                    </div>
                                    <div className="mt-2.5 text-[11px] uppercase tracking-[0.2em] text-[rgba(247,243,234,0.6)]">
                                        {s.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SUSTAINABILITY */}
                <section className={`${wrap} py-24`}>
                    <div className="mb-11 max-w-[620px]">
                        <span className={eyebrow}>The Ground</span>
                        <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em] text-forest">
                            Nothing Leaves but the Spice
                        </h2>
                        <p className={`mt-5 ${bodyLight}`}>
                            Cinnamon rewards patience and punishes shortcuts. Ours grows under
                            shade trees, on land never cleared for it, and everything the peeler
                            discards goes back into the same soil.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-[#D8C8AE] sm:grid-cols-2 lg:grid-cols-4" style={{ background: "#D8C8AE" }}>
                        {sustainability.map((c) => (
                            <div key={c.t} className="bg-[#F7F1E7] px-[26px] py-[30px]">
                                <div className="font-display text-[22px] italic text-forest">{c.t}</div>
                                <p className="mt-2.5 text-[14px] font-light leading-[1.75] text-[#5F5648]">{c.b}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TIMELINE (sandstone) */}
                {showTimeline && (
                    <section className="bg-[#EFE8D8] px-6 py-24 lg:px-11">
                        <div className="mx-auto max-w-[1180px]">
                            <div className="mb-10 flex flex-wrap items-end justify-between gap-10">
                                <div>
                                    <span className={eyebrow}>Milestones</span>
                                    <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em] text-forest">
                                        Six Years, Kept in Order
                                    </h2>
                                </div>
                                <p className="max-w-[460px] text-[15px] font-light leading-[1.8] text-[#5F5648]">
                                    A young house on an old route. Every entry is a thing we can
                                    point at.
                                </p>
                            </div>
                            <div>
                                {timeline.map((r, i) => {
                                    const gold = i === 0 || i === timeline.length - 1;
                                    return (
                                        <div
                                            key={r.y}
                                            className={`grid grid-cols-[70px_1fr] gap-6 border-t py-[22px] sm:grid-cols-[130px_1fr] sm:gap-8 ${i === timeline.length - 1 ? "border-b" : ""}`}
                                            style={{ borderColor: "rgba(92,55,36,.2)" }}
                                        >
                                            <div className={`font-display text-[32px] font-semibold leading-none ${gold ? "text-gold" : "text-forest"}`}>
                                                {r.y}
                                            </div>
                                            <p className="text-[15.5px] font-light leading-[1.8] text-[#5F5648]">{r.t}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* FOUNDERS */}
                {showFounders && (
                    <section className={`${wrap} py-24`}>
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-10">
                            <div>
                                <span className={eyebrow}>The House</span>
                                <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em] text-forest">
                                    Who Signs the Lot Sheet
                                </h2>
                            </div>
                            <p className="max-w-[460px] text-[15px] font-light leading-[1.8] text-[#5F5648]">
                                Three people, one warehouse, and a habit of putting names on
                                things.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {founders.map((p) => (
                                <div
                                    key={p.name}
                                    className={`rounded-[6px] border border-[#D8C8AE] bg-[#F7F1E7] px-[30px] py-8 ${cardLift} hover:shadow-[0_26px_50px_-30px_rgba(31,58,42,0.45)]`}
                                >
                                    <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-forest font-display text-[20px] text-gold">
                                        {p.i}
                                    </div>
                                    <div className="mt-[22px] font-display text-[26px] font-semibold text-forest">{p.name}</div>
                                    <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#8A7C68]">{p.role}</div>
                                    <p className="mt-4 text-[14.5px] font-light leading-[1.75] text-[#5F5648]">{p.bio}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* PROMISE (dark) */}
                <section className="bg-forest px-6 py-[88px] text-cream lg:px-11">
                    <div className="mx-auto max-w-[1180px]">
                        <span className={eyebrow}>Our Promise</span>
                        <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.01em]">
                            Four Things We Do Not Bend
                        </h2>
                        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] sm:grid-cols-2 lg:grid-cols-4" style={{ background: "rgba(197,154,61,.28)" }}>
                            {promise.map((c) => (
                                <div key={c.t} className="bg-forest px-[26px] py-7">
                                    <div className="font-display text-[23px] italic text-[#E7D6A8]">{c.t}</div>
                                    <p className="mt-2.5 text-[14px] font-light leading-[1.75] text-[rgba(247,243,234,0.72)]">{c.b}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-11 flex flex-wrap gap-4">
                            <a href="/#shop" className="rounded-[25px] bg-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.15em] text-forest transition-colors duration-300 hover:bg-[#d8ac52]">
                                Shop the Estates
                            </a>
                            <a href="/contact" className="rounded-[25px] border border-[rgba(247,243,234,0.34)] px-9 py-4 text-[12px] font-medium uppercase tracking-[0.15em] text-cream transition-colors duration-300 hover:border-gold hover:text-gold">
                                Talk to the Export Desk
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}