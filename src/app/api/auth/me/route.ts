import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    // Ambil profile user dari table profiles
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, company_name, username")
        .eq("id", user.id)
        .single();

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ user: profile }, { status: 200 });
}