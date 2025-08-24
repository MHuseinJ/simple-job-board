import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("*, profiles(full_name)")
        .eq("id", params.id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const body = await req.json();

    const { data, error } = await supabase
        .from("jobs")
        .update(body)
        .eq("id", params.id)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { error } = await supabase.from("jobs").delete().eq("id", params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}