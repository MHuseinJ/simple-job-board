"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

function cx(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function LoginRegisterPage() {
    const { user } = useAuth();
    if (user) redirect("/");

    // Register form state
    const [regCompany, setRegCompany] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regMsg, setRegMsg] = useState<string | null>(null);
    const [regLoading, setRegLoading] = useState(false);

    // Login form state
    const [logEmail, setLogEmail] = useState("");
    const [logMsg, setLogMsg] = useState<string | null>(null);
    const [logLoading, setLogLoading] = useState(false);

    async function onRegister(e: React.FormEvent) {
        e.preventDefault();
        setRegLoading(true);
        setRegMsg(null);
        const res = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company: regCompany, email: regEmail }),
        });
        const data = await res.json();
        setRegLoading(false);
        setRegMsg(res.ok ? data.message : data.error || "Failed to register");
    }

    async function onLogin(e: React.FormEvent) {
        e.preventDefault();
        setLogLoading(true);
        setLogMsg(null);
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: logEmail }),
        });
        const data = await res.json();
        setLogLoading(false);
        setLogMsg(res.ok ? data.message : data.error || "Failed to login");
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Welcome</h1>

                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
                        {["Login", "Register"].map((t) => (
                            <Tab
                                key={t}
                                className={({ selected }) =>
                                    cx(
                                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                        selected ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:bg-white/70"
                                    )
                                }
                            >
                                {t}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels>
                        {/* LOGIN */}
                        <Tab.Panel>
                            <form onSubmit={onLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Company Email</label>
                                    <input
                                        value={logEmail}
                                        onChange={(e) => setLogEmail(e.target.value)}
                                        required
                                        placeholder="team@acme.inc"
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={logLoading}
                                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {logLoading ? "Sending link..." : "Send magic link"}
                                </button>
                                {logMsg && <p className="text-sm text-center mt-2">{logMsg}</p>}
                            </form>
                        </Tab.Panel>

                        {/* REGISTER */}
                        <Tab.Panel>
                            <form onSubmit={onRegister} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Company Name</label>
                                    <input
                                        value={regCompany}
                                        onChange={(e) => setRegCompany(e.target.value)}
                                        required
                                        placeholder="Acme Inc"
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Company Email</label>
                                    <input
                                        type="email"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                        placeholder="team@acme.com"
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={regLoading}
                                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {regLoading ? "Sending link..." : "Register via magic link"}
                                </button>
                                {regMsg && <p className="text-sm text-center mt-2">{regMsg}</p>}
                            </form>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </main>
    );
}