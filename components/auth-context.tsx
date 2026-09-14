"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet, apiPost, ApiError } from "@/lib/api";

export type User = { name: string; email: string };
type Result = { ok: true } | { ok: false; error: string };

type AuthCtx = {
    user: User | null;
    ready: boolean;
    register: (name: string, email: string, password: string) => Promise<Result>;
    login: (email: string, password: string) => Promise<Result>;
    logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

type UserPayload = { data: { name: string; email: string } };

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiGet<UserPayload>("/api/auth/me");
                setUser({ name: res.data.name, email: res.data.email });
            } catch {
                setUser(null);
            } finally {
                setReady(true);
            }
        })();
    }, []);

    const register: AuthCtx["register"] = async (name, email, password) => {
        try {
            await apiPost("/api/auth/register", {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                password_confirmation: password,
            });
            return { ok: true };
        } catch (e) {
            return { ok: false, error: e instanceof ApiError ? e.fieldError ?? e.message : "Something went wrong. Please try again." };
        }
    };

    const login: AuthCtx["login"] = async (email, password) => {
        try {
            const res = await apiPost<UserPayload>("/api/auth/login", {
                email: email.trim().toLowerCase(),
                password,
            });
            setUser({ name: res.data.name, email: res.data.email });
            return { ok: true };
        } catch (e) {
            return { ok: false, error: e instanceof ApiError ? e.fieldError ?? e.message : "Something went wrong. Please try again." };
        }
    };

    const logout = async () => {
        try {
            await apiPost("/api/auth/logout");
        } catch {
            /* clear local state regardless */
        }
        setUser(null);
    };

    return <Ctx.Provider value={{ user, ready, register, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const c = useContext(Ctx);
    if (!c) throw new Error("useAuth must be used within AuthProvider");
    return c;
}
