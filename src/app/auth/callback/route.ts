import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const supabase = await createClient();
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        // will set the session cookie
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(`${origin}${next}`);
}