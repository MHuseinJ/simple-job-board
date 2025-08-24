import { NextResponse } from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(req: Request) {
    const supabase = await createClient();
    const {searchParams} = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const location = searchParams.get("location");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // fetch jobs with pagination
    const {data, error, count} = await supabase
        .from("jobs")
        .select("id, title, location, job_type, description, profiles(full_name)", {count: "exact"})
        .range(from, to)
        .order("created_at", {ascending: false})
        .match(location ? {location} : {});

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
        jobs: data || [],
        totalPages,
    });
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const body = await req.json();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Fetch profile for companyId
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Insert job
    const { data, error } = await supabase
        .from("jobs")
        .insert([{ ...body, company_id: profile.id }])
        .select();

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json(data);
}