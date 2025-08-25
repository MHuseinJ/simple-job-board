"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Profile {
    id: string;
    full_name?: string;
    company_name?: string;
    email: string;
}

interface AuthContextValue {
    user: Profile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}