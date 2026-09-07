"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-context";
import { COUNTRIES } from "@/lib/countries";

const PAPER = "#F3EDDF";
const INK = "#2b2317";
const BODY = "#6b5f4c";
const MUTED = "#8A7C68";
const FAINT = "#A2977F";
const HAIR = "#D8C8AE";
const TERRA = "#8A5B33";
const GOLD = "#C59A3D";
const GREEN = "#3F7A55";

const ACCOUNT_BG: string | null = "/account/plantation.jpg";


/* password policy checks */
function pwRules(pw: string, name: string, email: string) {
    const lower = pw.toLowerCase();
    const seqs = ["123", "234", "345", "456", "567", "678", "789", "012", "qwe", "wer", "ert", "rty", "asd", "sdf", "abc", "bcd", "cde"];
    const hasSeq = seqs.some((s) => lower.includes(s));
    const hasRepeat = /(.)\1\1/.test(pw);
    const deny = ["password", "letmein", "welcome", "ceylon", "spicera", "admin", "qwerty", "111111", "123456", "iloveyou"];
    const local = (email.split("@")[0] || "").toLowerCase();
    const first = name.trim().toLowerCase().split(" ")[0] || "";
    const known =
        deny.some((d) => lower.includes(d)) ||
        (first.length >= 3 && lower.includes(first)) ||
        (local.length >= 3 && lower.includes(local));
    return [
        { k: "12 characters or more", ok: pw.length >= 12 },
        { k: "Upper and lower case", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
        { k: "A number", ok: /[0-9]/.test(pw) },
        { k: "A symbol", ok: /[^A-Za-z0-9]/.test(pw) },
        { k: "No repeated runs", ok: pw.length > 0 && !hasRepeat && !hasSeq },
        { k: "Not a known phrase", ok: pw.length > 0 && !known },
    ];
}

/* ---- ruled field ---- */
function Row({ label, trailing, children }: { label: string; trailing?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[110px_1fr_auto] items-end gap-4 border-b py-3.5 sm:grid-cols-[150px_1fr_auto]" style={{ borderColor: HAIR }}>
            <label className="pb-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>{label}</label>
            {children}
            {trailing ? <div className="pb-1.5">{trailing}</div> : <span />}
        </div>
    );
}
const inputCls = "w-full bg-transparent font-display text-[20px] outline-none placeholder:text-[#A2977F]";

export default function AccountView() {
    const { user, login, register, logout } = useAuth();
    const router = useRouter();
    const params = useSearchParams();
    const returnTo = params.get("returnTo") || "/";
    const initialMode = params.get("mode") === "register" ? "register" : "login";

    const [mode, setMode] = useState<"login" | "register">(initialMode);
    const [reveal, setReveal] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    const [today, setToday] = useState("");
    const [f, setF] = useState({ name: "", email: "", region: "", pw: "", confirm: "", remember: false, news: true, terms: false });

    useEffect(() => {
        const d = new Date();
        setToday(`${d.getDate()} ${d.toLocaleString("en", { month: "short" }).toUpperCase()} ${d.getFullYear()}`);
    }, []);

    const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

    const rules = useMemo(() => pwRules(f.pw, f.name, f.email), [f.pw, f.name, f.email]);
    const pwOk = rules.every((r) => r.ok);
    const met = rules.filter((r) => r.ok).length;
    const segColor = met >= 6 ? GREEN : met >= 5 ? GOLD : met >= 3 ? "#B07A2A" : TERRA;
    const segFilled = met >= 6 ? 4 : met >= 5 ? 3 : met >= 3 ? 2 : met >= 1 ? 1 : 0;

    const loginValid = f.email.trim() !== "" && f.pw !== "";
    const regValid = f.name.trim() !== "" && f.email.trim() !== "" && pwOk && f.pw === f.confirm && f.terms;
    const valid = mode === "register" ? regValid : loginValid;

    const goBack = () => router.push(returnTo);

    const submit = () => {
        setError("");
        if (mode === "login") {
            const r = login(f.email, f.pw);
            if (r.ok) goBack();
            else setError(r.error);
            return;
        }
        const r = register(f.name, f.email, f.pw);
        if (!r.ok) return setError(r.error);
        setF({ name: "", email: f.email, region: "", pw: "", confirm: "", remember: false, news: true, terms: false });
        setMode("login");
        setNotice("Account opened. Please sign in to continue.");
    };

    const socialNote = () => setNotice("Social sign-in connects with the backend — coming soon.");

    return (
        <Sheet bg={ACCOUNT_BG}>
            {/* Masthead */}
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>
                <span>Ceylon Spicera · Export Ledger</span>
                <span>Folio VII</span>
                <span>Colombo · Ceylon</span>
            </div>
            <div className="mb-6 mt-3.5 border-t-2 border-double" style={{ borderColor: INK }} />

            {user ? (
                <>
                    <div className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.24em]" style={{ color: TERRA }}>Entry No. 0630 · Ledger</div>
                    <h1 className="font-display text-[clamp(32px,3.6vw,46px)] font-bold tracking-[-0.01em]" style={{ color: INK }}>Welcome back</h1>
                    <p className="mt-2 max-w-[440px] font-sans text-[14.5px] font-light leading-[1.6]" style={{ color: BODY }}>
                        Signed in as <span className="font-medium" style={{ color: INK }}>{user.name}</span> · {user.email}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <button type="button" onClick={goBack} className="rounded-[25px] px-8 py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-[#2b4d38]" style={{ background: "#1F3A2A" }}>Continue</button>
                        <button type="button" onClick={() => { logout(); setNotice("You have signed out."); }} className="rounded-[25px] border px-8 py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors" style={{ borderColor: "#C9B896", color: TERRA }}>Sign out</button>
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.24em]" style={{ color: TERRA }}>
                        {mode === "register" ? "Entry No. 0631 · New" : "Entry No. 0630 · Returning"}
                    </div>
                    <h1 className="font-display text-[clamp(32px,3.6vw,46px)] font-bold tracking-[-0.01em]" style={{ color: INK }}>
                        {mode === "register" ? "Open an Account" : "Sign In"}
                    </h1>
                    <p className="mt-2 max-w-[460px] font-sans text-[14.5px] font-light leading-[1.6]" style={{ color: BODY }}>
                        {mode === "register"
                            ? "Every account is written into the folio: your name, your region, and the lots you take. Nothing else."
                            : "Return to your standing order, saved lots and export paperwork."}
                    </p>

                    {/* Tabs */}
                    <div className="mt-6 inline-flex overflow-hidden rounded-[25px] border" style={{ borderColor: "#C9B896" }}>
                        {(["login", "register"] as const).map((m) => (
                            <button key={m} type="button" onClick={() => { setMode(m); setError(""); setNotice(""); }} className="px-6 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.2em] transition-colors" style={{ background: mode === m ? INK : "transparent", color: mode === m ? PAPER : MUTED, borderRadius: 25}}>
                                {m === "login" ? "Sign In" : "Open Account"}
                            </button>
                        ))}
                    </div>

                    {notice && <div className="mt-6 rounded-[6px] border px-4 py-3 font-sans text-[13px]" style={{ borderColor: "#E0D4B8", background: "#F7F3EA", color: GREEN }}>{notice}</div>}
                    {error && <div role="alert" className="mt-6 rounded-[6px] border px-4 py-3 font-sans text-[13px]" style={{ borderColor: TERRA, background: "rgba(138,91,51,.06)", color: TERRA }}>{error}</div>}

                    {/* Fields */}
                    <div className="mt-6">
                        {mode === "register" && (
                            <Row label="Name in Full">
                                <input className={inputCls} style={{ color: INK }} value={f.name} onChange={set("name")} autoComplete="name" placeholder="As it should appear on the invoice" />
                            </Row>
                        )}

                        <Row label={mode === "register" ? "Email" : "Registered Email"}>
                            <input className={inputCls} style={{ color: INK }} type="email" value={f.email} onChange={set("email")} autoComplete="username" spellCheck={false} autoCapitalize="none" placeholder="name@company.com" />
                        </Row>

                        {mode === "register" && (
                            <Row label="Shipping Region" trailing={<span className="font-mono text-[9px]" style={{ color: MUTED }}>▾</span>}>
                                <select className={`${inputCls} appearance-none`} style={{ color: f.region ? INK : FAINT }} value={f.region} onChange={set("region")}>
                                    <option value="">Select a destination</option>
                                    {COUNTRIES.map((r) => (<option key={r} value={r}>{r}</option>))}
                                </select>
                            </Row>
                        )}

                        <Row label="Pass Phrase" trailing={<button type="button" onClick={() => setReveal((r) => !r)} className="font-mono text-[9px] uppercase tracking-[0.16em] transition-colors" style={{ color: MUTED }}>{reveal ? "Hide" : "Show"}</button>}>
                            <input className={inputCls} style={{ color: INK }} type={reveal ? "text" : "password"} value={f.pw} onChange={set("pw")} autoComplete={mode === "register" ? "new-password" : "current-password"} spellCheck={false} placeholder={mode === "register" ? "Twelve characters or more" : "Your pass phrase"} />
                        </Row>

                        {mode === "register" && (
                            <>
                                {/* strength + checklist */}
                                <div className="grid grid-cols-[110px_1fr] gap-4 border-b py-4 sm:grid-cols-[150px_1fr]" style={{ borderColor: HAIR }}>
                                    <label className="font-mono text-[9.5px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>Phrase Strength</label>
                                    <div>
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2, 3].map((i) => (<span key={i} className="h-[3px] flex-1 rounded-full transition-colors duration-500" style={{ background: i < segFilled ? segColor : "#E3D8C0" }} />))}
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
                                            {rules.map((r) => (
                                                <div key={r.k} className="flex items-center gap-2 font-sans text-[11.5px] font-light transition-colors" style={{ color: r.ok ? GREEN : FAINT }}>
                                                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: r.ok ? GREEN : FAINT }} />
                                                    {r.k}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Row label="Repeat Phrase">
                                    <input className={inputCls} style={{ color: INK }} type={reveal ? "text" : "password"} value={f.confirm} onChange={set("confirm")} autoComplete="new-password" spellCheck={false} placeholder="Once more" />
                                </Row>
                            </>
                        )}
                    </div>

                    {/* consent / device */}
                    {mode === "login" ? (
                        <div className="mt-5 flex items-start justify-between gap-4">
                            <button type="button" role="checkbox" aria-checked={f.remember} onClick={() => setF({ ...f, remember: !f.remember })} className="flex items-start gap-3 text-left">
                <span className="mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-[4px] border" style={{ borderColor: "#C9B896", background: f.remember ? TERRA : "transparent" }}>
                  {f.remember && <Tick />}
                </span>
                                <span className="font-sans text-[13px] font-light leading-[1.5]" style={{ color: BODY }}>Trust this device for 30 days — only on hardware you own.</span>
                            </button>
                            <button type="button" onClick={() => setNotice("Recovery connects with the backend.")} className="flex-none font-mono text-[9px] uppercase tracking-[0.16em] transition-colors" style={{ color: MUTED }}>Forgotten Pass Phrase</button>
                        </div>
                    ) : (
                        <div className="mt-5 flex flex-col gap-3">
                            <button type="button" role="checkbox" aria-checked={f.news} onClick={() => setF({ ...f, news: !f.news })} className="flex items-start gap-3 text-left">
                                <span className="mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-[4px] border" style={{ borderColor: "#C9B896", background: f.news ? TERRA : "transparent" }}>{f.news && <Tick />}</span>
                                <span className="font-sans text-[13px] font-light leading-[1.5]" style={{ color: BODY }}>Send me the harvest notes — four letters a year, when the cutting starts.</span>
                            </button>
                            <div className="flex items-start gap-3">
                                <button type="button" role="checkbox" aria-checked={f.terms} onClick={() => setF({ ...f, terms: !f.terms })} className="mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-[4px] border" style={{ borderColor: "#C9B896", background: f.terms ? TERRA : "transparent" }}>{f.terms && <Tick />}</button>
                                <span className="font-sans text-[13px] font-light leading-[1.5]" style={{ color: BODY }}>
                  I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="underline" style={{ color: TERRA }}>terms of trade</a> and the <a href="#" onClick={(e) => e.preventDefault()} className="underline" style={{ color: TERRA }}>privacy notice</a>.
                </span>
                            </div>
                        </div>
                    )}

                    {/* primary */}
                    <button type="button" disabled={!valid} onClick={valid ? submit : undefined} className="mt-7 w-full rounded-[25px] py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors" style={{ background: valid ? "#1F3A2A" : "#E3D8C0", color: valid ? "#F7F3EA" : FAINT, cursor: valid ? "pointer" : "not-allowed" }}>
                        {valid ? (mode === "register" ? "Open an Account" : "Sign In") : mode === "register" ? "Complete the Entry" : "Enter Your Details"}
                    </button>

                    <div className="mt-4 text-center font-sans text-[13px] font-light" style={{ color: BODY }}>
                        {mode === "login" ? "No entry on file? " : "Already on the ledger? "}
                        <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setNotice(""); }} className="underline" style={{ color: TERRA }}>
                            {mode === "login" ? "Open an account" : "Sign in"}
                        </button>
                    </div>

                    {/* social */}
                    <div className="mt-8 flex items-center gap-4">
                        <span className="h-px flex-1" style={{ background: HAIR }} />
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Or countersign with</span>
                        <span className="h-px flex-1" style={{ background: HAIR }} />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2.5">
                        {[{ n: "Google", i: <Google /> }, { n: "Apple", i: <Apple /> }, { n: "Facebook", i: <Facebook /> }].map((s) => (
                            <button key={s.n} type="button" onClick={socialNote} className="flex items-center justify-center gap-2 rounded-[25px] border py-3 font-sans text-[12px] transition-colors" style={{ borderColor: "#C9B896", color: "#5C3724" }}>
                                {s.i}<span className="hidden sm:inline">{s.n}</span>
                            </button>
                        ))}
                    </div>

                    {/* guest */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                        <span className="font-sans text-[13px] font-light" style={{ color: BODY }}>Buying once and moving on?</span>
                        <button type="button" onClick={goBack} className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors" style={{ color: MUTED}}>Continue as guest <span aria-hidden>→</span></button>
                    </div>

                    {/* security notice */}
                    <div className="mt-6 flex gap-3 rounded-[6px] border px-4 py-3.5" style={{ borderColor: "#E0D4B8" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth={1.5} className="mt-0.5 flex-none"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" /></svg>
                        <p className="font-sans text-[12px] font-light leading-[1.6]" style={{ color: BODY }}>
                            Sent over TLS 1.3. Pass phrases are salted and hashed with Argon2id — never stored or logged in the clear. Sessions expire after 30 minutes idle. We will never ask for your pass phrase by email or telephone.
                        </p>
                    </div>
                </>
            )}

            {/* Footer */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t pt-4 font-mono text-[9px] uppercase tracking-[0.24em]" style={{ borderColor: HAIR, color: FAINT }}>
                <span>Entered by Hand</span>
                <span>{today}</span>
                <span>Recorded at Colombo</span>
            </div>
        </Sheet>
    );
}

function Tick() {
    return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F3EDDF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>;
}
function Google() {
    return (<svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" /><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" /><path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l4-3.1z" /><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" /></svg>);
}
function Apple() {
    return (<svg width="15" height="15" viewBox="0 0 24 24" fill="#1a1a1a"><path d="M16.5 12.6c0-2.6 2.1-3.9 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9s-2-.9-3.4-.9C6.1 6.7 4.6 7.6 3.8 9c-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.7 2.5 3 2.5 1.2-.1 1.6-.8 3.1-.8s1.9.8 3.1.8 2.1-1.2 2.9-2.4c.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.8zM14.3 4.4c.7-.8 1.1-2 1-3.1-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.1-.6 2.8-1.4z" /></svg>);
}
function Facebook() {
    return (<svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z" /></svg>);
}

/* ---- ledger sheet + fixed background (FILL FIX: bg lives in a fixed wrapper) ---- */
function Sheet({ children, bg }: { children: React.ReactNode; bg?: string | null }) {
    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6 sm:py-24" style={{ background: "#0F1A12" }}>
            {bg && (
                <div aria-hidden className="absolute inset-0 z-0">
                    <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover" />
                    <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(15,26,18,.72), rgba(9,15,10,.95))" }} />
                </div>
            )}
            <div
                className="relative z-10 mx-auto max-w-[780px] px-6 py-9 sm:px-14 sm:py-10 sm:pl-[74px]"
                style={{
                    background: PAPER,
                    backgroundImage: "linear-gradient(90deg, rgba(138,91,51,.14) 0 1px, transparent 1px 100%)",
                    backgroundSize: "58px 100%",
                    backgroundRepeat: "no-repeat",
                    borderLeft: "3px solid rgba(138,91,51,.5)",
                    boxShadow: "0 60px 120px -50px rgba(6,12,7,.9), 0 2px 0 rgba(43,35,23,.08)",
                }}
            >
                <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "46%", maxWidth: 400, opacity: 0.15, mixBlendMode: "multiply", filter: "grayscale(1) contrast(1.1)" }}>
                    <Image src="/logo/CS.png" alt="" width={400} height={400} className="h-auto w-full" />
                </div>
                <div className="relative">{children}</div>
            </div>
        </div>
    );
}