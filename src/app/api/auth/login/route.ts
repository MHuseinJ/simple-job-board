import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { email } = await req.json();
    if (!email) {
        return NextResponse.json({ error: "email company is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Find the email for the company
    const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", email)
        .single();

    if (profileErr || !profile) {
        console.log(profileErr);
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const { error } = await supabase.auth.signInWithOtp({
        email: profile.username,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?next=/job`,
        },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, message: "Magic link sent to company email." });
}