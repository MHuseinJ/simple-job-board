"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type RawProfile = {
    id: string;
    email: string;
    company_name?: string | null;
    full_name?: string | null;
};

export type UiUser = RawProfile & {
    displayName: string;
    avatarInitial: string; // single uppercase letter
};

type AuthContextValue = {
    user: UiUser | null;
    loading: boolean;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    refresh: async () => {},
});

function toUiUser(p: RawProfile | null): UiUser | null {
    if (!p) return null;
    const displayName = (p.company_name || p.full_name || p.email || "").trim();
    const first = displayName ? displayName.charAt(0).toUpperCase() : "?";
    return {
        ...p,
        displayName,
        avatarInitial: first,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [raw, setRaw] = useState<RawProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const user = useMemo(() => toUiUser(raw), [raw]);

    async function fetchMe() {
        setLoading(true);
        try {
            const res = await fetch("/auth/me", { cache: "no-store" });
            if (!res.ok) {
                setRaw(null);
                return;
            }
            const data = (await res.json()) as { user: RawProfile | null };
            setRaw(data.user ?? null);
        } catch {
            setRaw(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refresh: fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
