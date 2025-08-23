"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    async function onSendLink(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        setError(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard` },
        });

        if (error) {
            setError(error.message);
            setStatus("error");
        } else {
            setStatus("sent");
        }
    }

    async function oauth(provider: "github" | "google") {
        await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
        });
    }

    return (
        <main className="space-y-6">
            <h1 className="text-2xl font-semibold">Sign in</h1>

            <form onSubmit={onSendLink} className="space-y-3">
                <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                />
                <button
                    disabled={status === "sending"}
                    className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
                >
                    {status === "sending" ? "Sending..." : "Send magic link"}
                </button>

                {status === "sent" && <p>Check your email for the login link.</p>}
                {status === "error" && <p className="text-red-600">{error}</p>}
            </form>

            <div className="space-x-3">
                <button onClick={() => oauth("github")} className="rounded-md border px-3 py-2">
                    Continue with GitHub
                </button>
                <button onClick={() => oauth("google")} className="rounded-md border px-3 py-2">
                    Continue with Google
                </button>
            </div>
        </main>
    );
}