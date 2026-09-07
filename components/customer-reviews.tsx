import Reveal from "@/components/reveal";
import { reviews } from "@/lib/site-data";

export default function CustomerReviews() {
    return (
        <section style={{ background: "#EFE8D8" }}>
            <div className="mx-auto max-w-[1280px] px-6 py-[118px] lg:px-11">
                <Reveal className="mb-14 text-center">
          <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
            Trusted Worldwide
          </span>
                    <h2 className="mt-4 font-display text-[clamp(34px,4vw,52px)] font-semibold tracking-[-0.01em] text-forest">
                        What Our Clients Say
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {reviews.map((r) => (
                        <Reveal key={r.name} delay={r.delay}>
                            <div className="relative h-full rounded-[6px] border border-[rgba(44,44,44,0.08)] bg-cream px-[30px] pb-[30px] pt-[38px]">
                                <div className="h-[34px] font-display text-[72px] leading-[0.6] text-[rgba(197,154,61,0.35)]">
                                    &ldquo;
                                </div>
                                <div className="mb-3.5 mt-1.5 text-[11px] tracking-[0.12em] text-gold">
                                    ★★★★★
                                </div>
                                <p className="m-0 mb-[26px] font-display text-[20px] font-normal italic leading-[1.5] text-forest">
                                    {r.quote}
                                </p>
                                <div className="flex items-center gap-3.5 border-t border-[rgba(44,44,44,0.1)] pt-5">
                  <span
                      className="h-[46px] w-[46px] flex-none rounded-full border border-[rgba(44,44,44,0.1)]"
                      style={{
                          backgroundColor: "#e2d8c2",
                          backgroundImage:
                              "repeating-linear-gradient(45deg,rgba(138,79,36,.1) 0 8px,rgba(138,79,36,0) 8px 16px)",
                      }}
                  />
                                    <div>
                                        <div className="text-[14px] font-medium text-forest">{r.name}</div>
                                        <div className="mt-0.5 text-[11.5px] text-[rgba(44,44,44,0.55)]">
                                            {r.role}
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-[7px] text-[10.5px] uppercase tracking-[0.1em] text-spice">
                                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                        {r.country}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}