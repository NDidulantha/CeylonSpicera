import Reveal from "@/components/reveal";
import { stats } from "@/lib/site-data";

export default function ExportWorld() {
    return (
        <section className="mx-auto max-w-[1280px] px-6 py-[118px] lg:px-11">
            <Reveal className="mb-[54px] text-center">
        <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
          Global Reach
        </span>
                <h2 className="mt-4 font-display text-[clamp(34px,4vw,52px)] font-semibold tracking-[-0.01em] text-forest">
                    Exported to the World
                </h2>
            </Reveal>

            <Reveal>
                <div className="overflow-hidden rounded-[8px] border border-[rgba(197,154,61,0.2)] bg-[#16281d]">
                    <iframe
                        src="/world-map.html"
                        title="Interactive antique globe — Ceylon export routes"
                        loading="lazy"
                        className="block h-[440px] w-full border-0 sm:h-[560px] lg:h-[620px]"
                    />
                </div>
            </Reveal>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {stats.map((s) => (
                    <Reveal key={s.l} delay={s.delay} className="p-5 text-center">
                        <div className="font-display text-[clamp(44px,5vw,64px)] leading-none text-forest">
                            {s.v}
                        </div>
                        <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-spice">
                            {s.l}
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}