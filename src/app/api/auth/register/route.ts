import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { company, email } = await req.json();

    if (!company || !email) {
        return NextResponse.json({ error: "company and email are required" }, { status: 400 });
    }

    const supabase =  await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        options: {
            data: {company_name: company},
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?next=/`,
        },
        password: ""
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, message: "Check your email for the magic link." });
}