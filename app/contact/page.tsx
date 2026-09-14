import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import Reveal from "@/components/reveal";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
    title: "Contact — Ceylon Spicera",
    description:
        "Get in touch with the Ceylon Spicera export team in Colombo for orders, wholesale, private label, and trade visits.",
};

/* Page-head background photo (plantation.jpg). */
const HERO_IMG = "/contact/plantation.jpg";

const details = [
    { icon: "email", label: "Email", value: "trade@ceylonspicera.com", sub: "For orders & wholesale" },
    { icon: "phone", label: "Phone", value: "+94 11 234 5678", sub: "Mon–Fri, 9am–6pm (GMT+5:30)" },
    { icon: "flag", label: "Export Desk", value: "export@ceylonspicera.com", sub: "Documentation & shipping" },
    { icon: "pin", label: "Head Office", value: "Cinnamon Gardens, Colombo 07", sub: "Sri Lanka" },
];

const hours = [
    { day: "Monday – Friday", time: "9:00 – 18:00" },
    { day: "Saturday", time: "9:00 – 13:00" },
    { day: "Sunday", time: "Closed" },
];

const socials = ["Instagram", "Facebook", "LinkedIn", "YouTube"];

function InfoIcon({ name }: { name: string }) {
    const p = {
        width: 18,
        height: 18,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.4,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    } as const;
    switch (name) {
        case "email":
            return (
                <svg {...p}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M4 7l8 6 8-6" />
                </svg>
            );
        case "phone":
            return (
                <svg {...p}>
                    <path d="M5 4h3.4l1.5 5-2 1.3a12 12 0 0 0 5 5l1.3-2 5 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
                </svg>
            );
        case "flag":
            return (
                <svg {...p}>
                    <path d="M6 3v18" />
                    <path d="M6 4h11l-2.2 3.2L17 10.4H6" />
                </svg>
            );
        default:
            return (
                <svg {...p}>
                    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.4" />
                </svg>
            );
    }
}

function SocialIcon({ name }: { name: string }) {
    switch (name) {
        case "Instagram":
            return (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
            );
        case "Facebook":
            return (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.5c0-.8.2-1.3 1.3-1.3H16.3V5.9c-.3 0-1.3-.1-2.4-.1-2.3 0-3.9 1.4-3.9 4v2.5H7.7V14h2.3v7h3.5z" />
                </svg>
            );
        case "LinkedIn":
            return (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.94 8.5H4V20h2.94V8.5zM5.47 4a1.72 1.72 0 1 0 0 3.44 1.72 1.72 0 0 0 0-3.44zM20 20h-2.94v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H10.1V8.5h2.82v1.57h.04c.39-.74 1.35-1.52 2.78-1.52 2.97 0 3.52 1.96 3.52 4.5V20z" />
                </svg>
            );
        default:
            return (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 8.2a2.6 2.6 0 0 0-1.8-1.85C18.6 6 12 6 12 6s-6.6 0-8.2.35A2.6 2.6 0 0 0 2 8.2 27 27 0 0 0 1.8 12 27 27 0 0 0 2 15.8a2.6 2.6 0 0 0 1.8 1.85C5.4 18 12 18 12 18s6.6 0 8.2-.35A2.6 2.6 0 0 0 22 15.8 27 27 0 0 0 22.2 12 27 27 0 0 0 22 8.2zM10 15V9l5.2 3L10 15z" />
                </svg>
            );
    }
}

export default function ContactPage() {
    return (
        <>
            <SiteHeader />
            <main>
                {/* Page head */}
                <section className="relative min-h-[80vh] overflow-hidden px-6 pb-[96px] pt-[280px] text-cream lg:px-11">
                    <Image src={HERO_IMG} alt="" fill priority sizes="100vw" className="object-cover" />
                    <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg,rgba(18,30,20,.62),rgba(18,30,20,.42) 55%,rgba(18,30,20,.5))",
                        }}
                    />
                    <Reveal className="relative mx-auto max-w-[1180px]">
                        <div className="mb-6 flex items-center gap-3.5">
                            <span className="h-px w-[42px] bg-gold" />
                            <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
                Get in Touch
              </span>
                        </div>
                        <h1 className="font-display text-[clamp(42px,5.4vw,74px)] font-bold leading-[1.02] tracking-[-0.01em]">
                            Let&apos;s Talk Spice
                        </h1>
                        <p className="mt-5 max-w-[520px] text-[16px] font-light leading-[1.7] text-[rgba(247,243,234,0.82)] italic">
                            Whether you are a chef, a retailer or planning a bulk export
                            order, our team in Colombo is ready to help you source the finest
                            Ceylon spices
                        </p>
                    </Reveal>
                </section>

                {/* Form + info */}
                <section id="form" className="bg-cream px-6 py-[96px] lg:px-11">
                    <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-16 lg:grid-cols-[1.15fr_0.85fr]">
                        <Reveal>
                            <ContactForm />
                        </Reveal>

                        <Reveal className="flex flex-col gap-[18px]">
                            {details.map((d) => (
                                <div
                                    key={d.label}
                                    className="flex items-center gap-4 rounded-[6px] border border-[#D8C8AE] bg-[#F7F1E7] p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[0_22px_45px_-28px_rgba(31,58,42,0.4)]"
                                >
                  <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-forest text-gold">
                    <InfoIcon name={d.icon} />
                  </span>
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.2em] text-[#5C3724]">
                                            {d.label}
                                        </div>
                                        <div className="font-display text-[20px] text-forest">
                                            {d.value}
                                        </div>
                                        <div className="text-[13px] text-[#6F6558]">{d.sub}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Follow the Trade */}
                            <div className="rounded-[6px] bg-forest p-6 text-cream">
                                <div className="mb-4 text-[11px] uppercase tracking-[0.2em] text-gold">
                                    Follow the Trade
                                </div>
                                <div className="flex gap-3">
                                    {socials.map((s) => (
                                    <a
                                        key={s}
                                        href="#"
                                        title={s}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(247,243,234,0.22)] text-cream transition-colors duration-300 hover:border-gold hover:bg-[rgba(197,154,61,0.08)] hover:text-gold"
                                        >
                                        <SocialIcon name={s} />
                                        </a>
                                        ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Location strip */}
                <section className="bg-[#EFE8D8] px-6 py-[80px] lg:px-11">
                    <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
                        <Reveal>
              <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
                Visit Us
              </span>
                            <h2 className="mt-3 font-display text-[clamp(30px,3.4vw,46px)] font-semibold tracking-[-0.01em] text-forest">
                                The Colombo Spice House
                            </h2>
                            <p className="mt-4 max-w-[480px] text-[15px] font-light leading-[1.7] text-[#6F6558]">
                                Our warehouse and tasting room sit at the heart of the old spice
                                quarter. Trade visits are welcome by appointment.
                            </p>
                            <div className="mt-7 max-w-[420px]">
                                {hours.map((h) => (
                                    <div
                                        key={h.day}
                                        className="flex justify-between border-b border-[#D8C8AE] py-3 text-[14px] last:border-0"
                                    >
                                        <span className="text-[#6F6558]">{h.day}</span>
                                        <span className="font-semibold text-forest">{h.time}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal>
                            <div className="relative h-[340px] overflow-hidden rounded-[6px] border border-[#D8C8AE]">
                                <iframe
                                    src="/contact-map.html"
                                    title="The Colombo Spice House location map"
                                    loading="lazy"
                                    className="block h-full w-full border-0"
                                />
                                <div className="pointer-events-none absolute left-4 top-4 rounded-[4px] bg-forest px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-cream shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)]">
                                    No. 12, Cinnamon Gardens · Colombo 07
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}