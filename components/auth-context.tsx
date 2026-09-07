"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/*
  FRONT-END ONLY auth for the prototype: accounts + session live in localStorage.
  This is NOT secure and NOT a real backend — when the Laravel API is ready,
  replace register()/login()/logout() bodies with fetch() calls; the UI/flow stays.
*/

export type User = { name: string; email: string };
type Account = { name: string; email: string; pw: string };
type Result = { ok: true } | { ok: false; error: string };

type AuthCtx = {
    user: User | null;
    ready: boolean;
    register: (name: string, email: string, password: string) => Result;
    login: (email: string, password: string) => Result;
    logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

const ACCTS = "cs_accounts";
const SESSION = "cs_session";

/* Trivial obfuscation only — a real hash lives on the server (Argon2id). */
const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return String(h) + ":" + s.length;
};

const readAccts = (): Account[] => {
    try {
        return JSON.parse(localStorage.getItem(ACCTS) || "[]");
    } catch {
        return [];
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const email = localStorage.getItem(SESSION);
            if (email) {
                const acct = readAccts().find((a) => a.email === email);
                if (acct) setUser({ name: acct.name, email: acct.email });
            }
        } catch {
            /* ignore */
        }
        setReady(true);
    }, []);

    const register: AuthCtx["register"] = (name, email, password) => {
        const em = email.trim().toLowerCase();
        const accts = readAccts();
        if (accts.some((a) => a.email === em))
            return { ok: false, error: "An account with this address already exists." };
        accts.push({ name: name.trim(), email: em, pw: hash(password) });
        try {
            localStorage.setItem(ACCTS, JSON.stringify(accts));
        } catch {}
        return { ok: true };
    };

    const login: AuthCtx["login"] = (email, password) => {
        const em = email.trim().toLowerCase();
        const acct = readAccts().find((a) => a.email === em);
        if (!acct || acct.pw !== hash(password))
            return { ok: false, error: "Those credentials were not recognised." };
        try {
            localStorage.setItem(SESSION, em);
        } catch {}
        setUser({ name: acct.name, email: acct.email });
        return { ok: true };
    };

    const logout = () => {
        try {
            localStorage.removeItem(SESSION);
        } catch {}
        setUser(null);
    };

    return <Ctx.Provider value={{ user, ready, register, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const c = useContext(Ctx);
    if (!c) throw new Error("useAuth must be used within AuthProvider");
    return c;
}