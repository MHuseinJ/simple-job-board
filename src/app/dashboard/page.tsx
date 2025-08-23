import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <main className="space-y-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p>Welcome, {user.email}</p>
            <pre className="rounded-md bg-white p-4 shadow">
        {JSON.stringify({ user, profile }, null, 2)}
      </pre>
            <form action="/auth/signout" method="post">
                <button className="rounded-md border px-3 py-1">Sign out</button>
            </form>
        </main>
    );
}