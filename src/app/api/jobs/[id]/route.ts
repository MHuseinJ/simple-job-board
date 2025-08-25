import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("job_company")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const body = await req.json();

    const { id } = await context.params; // <-- harus di-await

    const { error } = await supabase
        .from("jobs")
        .update({
            title: body.title,
            location: body.location,
            job_type: body.job_type || null,
            description: body.description,
        })
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await context.params;

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}