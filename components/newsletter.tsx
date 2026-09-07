"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/components/reveal";

/* Full-cover background photo behind the newsletter. */
const NEWSLETTER_BG = "/newsletter/plantation.jpg";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const subscribe = () => {
        if (email.trim()) setSubscribed(true);
    };

    return (
        <section className="relative overflow-hidden bg-forest text-cream">
            {/* Background photo + dark green scrim */}
            <Image src={NEWSLETTER_BG} alt="" fill sizes="100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0" style={{ background: "rgba(20,32,22,0.82)" }} />

            <Reveal className="relative mx-auto max-w-[720px] px-6 py-[104px] text-center lg:px-11">
        <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
          Newsletter
        </span>
                <h2 className="mt-4 font-display text-[clamp(34px,4.2vw,54px)] font-semibold tracking-[-0.01em]">
                    Join the Ceylon Spicera Circle
                </h2>
                <p className="mx-auto mt-4 mb-[34px] max-w-[560px] text-[15.5px] font-light leading-[1.7] text-[rgba(247,243,234,0.75)]">
                    Receive recipes, new arrivals, and exclusive offers — delivered with
                    the same care as our spices.
                </p>

                {subscribed ? (
                    <div className="font-display text-[24px] italic text-gold">
                        Welcome to the Circle — check your inbox.
                    </div>
                ) : (
                    <>
                        {/* Single pill bar: input flush left, button nested right */}
                        <div
                            className="mx-auto flex max-w-[520px] items-center rounded-[30px] p-1.5"
                            style={{
                                background: "rgba(247,243,234,0.06)",
                                border: "1px solid rgba(247,243,234,0.28)",
                            }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                                placeholder="Your email address"
                                className="min-w-0 flex-1 bg-transparent px-5 py-3 font-sans text-[14px] text-cream outline-none placeholder:text-[rgba(247,243,234,0.4)]"
                            />
                            <button
                                type="button"
                                onClick={subscribe}
                                className="flex-none rounded-[24px] bg-gold px-[26px] py-3 text-[12px] font-medium uppercase tracking-[0.15em] text-forest transition-colors duration-300 hover:bg-[#d8ac52]"
                            >
                                Subscribe
                            </button>
                        </div>
                        <div className="mt-4 text-[11px] tracking-[0.04em] text-[rgba(247,243,234,0.5)]">
                            No spam. Unsubscribe anytime.
                        </div>
                    </>
                )}
            </Reveal>
        </section>
    );
}