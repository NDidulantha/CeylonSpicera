import Image from "next/image";
import Reveal from "@/components/reveal";
import { why } from "@/lib/site-data";


const HERITAGE_IMG: string | null = "/heritage/grader.jpg";

export default function WhyCeylon() {
    return (
        <section style={{ background: "#EFE8D8" }}>
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-stretch gap-16 px-6 py-[118px] lg:grid-cols-[0.92fr_1.08fr] lg:px-11">
                {/* Image + est. badge */}
                <Reveal className="h-full">
                    <div
                        className="relative flex h-[420px] items-end overflow-hidden rounded-[6px] border border-[rgba(44,44,44,0.08)] p-[40px] lg:h-full"
                        style={{
                            backgroundColor: "#e2d8c2",
                            backgroundImage:
                                "repeating-linear-gradient(45deg,rgba(138,79,36,.08) 0 16px,rgba(138,79,36,0) 16px 32px)",
                        }}
                    >
                        {HERITAGE_IMG ? (
                            <Image
                                src={HERITAGE_IMG}
                                alt="Master grader inspecting cinnamon quills"
                                fill
                                sizes="(max-width:1024px) 100vw, 45vw"
                                className="object-cover"
                            />
                        ) : (
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgba(44,44,44,0.35)]">
                Photo · Master grader inspecting cinnamon quills
              </span>
                        )}
                        <div className="absolute left-[22px] top-[22px] rounded-[3px] bg-forest px-[18px] py-3 text-center text-gold">
                            <div className="font-display text-[30px] leading-none">1867</div>
                            <div className="mt-0.5 text-[8.5px] uppercase tracking-[0.24em] text-[rgba(247,243,234,0.7)]">
                                Est. Trading
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Copy + reasons grid */}
                <div>
                    <Reveal className="mb-10">
            <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
              Our Promise
            </span>
                        <h2 className="mt-4 font-display text-[clamp(32px,3.6vw,48px)] font-semibold tracking-[-0.01em] text-forest">
                            Why Choose Ceylon Spicera
                        </h2>
                        <p className="mt-4 max-w-[520px] text-[15px] font-light leading-[1.7] text-[rgba(44,44,44,0.62)]">
                            Every gram carries the terroir of Sri Lanka&apos;s highlands and
                            generations of craft. We control the journey from estate to your
                            kitchen.
                        </p>
                    </Reveal>

                    <Reveal>
                        <div
                            className="grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-[rgba(44,44,44,0.1)] sm:grid-cols-2"
                            style={{ background: "rgba(44,44,44,0.1)" }}
                        >
                            {why.map((w) => (
                                <div
                                    key={w.n}
                                    className="bg-cream px-[26px] py-7 transition-colors duration-300 hover:bg-[#fffdf7]"
                                >
                                    <div className="mb-3 font-display text-[26px] italic text-gold">
                                        {w.n}
                                    </div>
                                    <div className="text-[15px] font-medium tracking-[0.01em] text-forest">
                                        {w.title}
                                    </div>
                                    <div className="mt-[7px] text-[12.5px] font-light leading-[1.6] text-[rgba(44,44,44,0.55)]">
                                        {w.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}