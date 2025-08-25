import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    const { origin } = new URL(request.url);
    console.log(origin)
    return NextResponse.redirect(`${origin}/`);
}