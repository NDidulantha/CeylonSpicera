"use client";

import { useState } from "react";

const TOPICS = [
    "General Inquiry",
    "Wholesale & Bulk Order",
    "Private Label",
    "Returns & Refunds",
    "Press & Partnerships",
    "Other",
];

const inputCls =
    "rounded-[4px] border border-[#D8C8AE] bg-[#FCFAF5] px-4 py-3.5 font-sans text-[14px] text-[#232323] outline-none transition-colors duration-200 focus:border-gold";
const labelCls =
    "flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F6558]";

export default function ContactForm() {
    const [sent, setSent] = useState(false);
    const [f, setF] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        topic: TOPICS[0],
        subject: "",
        message: "",
    });

    const set =
        (k: keyof typeof f) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                setF({ ...f, [k]: e.target.value });

    const isOther = f.topic === "Other";
    const send = () => {
        if (f.name.trim() && f.email.trim() && f.message.trim()) setSent(true);
    };

    return (
        <div>
      <span className="text-[11px] uppercase tracking-[0.42em] text-gold">
        Send a Message
      </span>
            <h2 className="mt-3 font-display text-[clamp(30px,3.6vw,44px)] font-semibold tracking-[-0.01em] text-forest">
                How Can We Help?
            </h2>

            {sent ? (
                <div className="mt-8 rounded-[6px] border-l-[3px] border-[#56733C] bg-[#F7F1E7] p-8">
                    <div className="font-display text-[26px] italic text-forest">
                        Thank you — your message is on its way.
                    </div>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#6F6558]">
                        A member of our export team will respond within one business day.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                        <label className={labelCls}>
                            <span>Full Name</span>
                            <input className={inputCls} placeholder="Your name" value={f.name} onChange={set("name")} />
                        </label>
                        <label className={labelCls}>
                            <span>Email</span>
                            <input type="email" className={inputCls} placeholder="you@company.com" value={f.email} onChange={set("email")} />
                        </label>
                        <label className={labelCls}>
                            <span>Telephone <span className="font-normal normal-case tracking-normal text-[rgba(111,101,88,0.7)]">(WhatsApp)</span></span>
                            <input type="tel" className={inputCls} placeholder="+94 77 123 4567" value={f.phone} onChange={set("phone")} />
                        </label>
                        <label className={labelCls}>
                            <span>Company <span className="font-normal lowercase tracking-normal text-[rgba(111,101,88,0.7)]">(optional)</span></span>
                            <input className={inputCls} placeholder="Business name" value={f.company} onChange={set("company")} />
                        </label>

                        <label className={`${labelCls} ${isOther ? "" : "sm:col-span-2"}`}>
                            <span>Inquiry Type</span>
                            <select className={inputCls} value={f.topic} onChange={set("topic")}>
                                {TOPICS.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </label>
                        {isOther && (
                            <label className={labelCls}>
                                <span>Subject</span>
                                <input className={inputCls} placeholder="Subject of your message" value={f.subject} onChange={set("subject")} />
                            </label>
                        )}

                        <label className={`${labelCls} sm:col-span-2`}>
                            <span>Message</span>
                            <textarea
                                rows={5}
                                className={`${inputCls} resize-y`}
                                placeholder="Tell us what you're looking for — spices, quantities, destination…"
                                value={f.message}
                                onChange={set("message")}
                            />
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={send}
                        className="mt-6 rounded-[25px] bg-forest px-10 py-4 text-[12px] font-medium uppercase tracking-[0.15em] text-cream transition-colors duration-300 hover:bg-gold hover:text-forest"
                    >
                        Send Message
                    </button>
                </>
            )}
        </div>
    );
}