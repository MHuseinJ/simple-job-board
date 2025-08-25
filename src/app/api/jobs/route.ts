import { NextResponse } from "next/server";
import {createClient} from "@/lib/supabase/server";
import { ok, fail } from "@/lib/http";

export async function GET(req: Request) {
    const supabase = await createClient();
    const url = new URL(req.url);

    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const search = url.searchParams.get("search")?.trim();
    const jobType = url.searchParams.get("job_type")?.trim();
    const idCompany = url.searchParams.get("id_company")?.trim();// 👈 NEW

    // If you’re using the view:
    let query = supabase
        .from("jobs") // or "jobs" with profiles join if you prefer
        .select("*, profiles(company_name)", {count: "exact"})
        .order("id", {ascending: false})
        .range(from, to);

    if (search) query = query.ilike("location", `%${search}%`);
    if (jobType && jobType !== "All") query = query.eq("job_type", jobType);
    if (idCompany) query = query.eq("company_id", idCompany);

    const {data, error, count} = await query;
    if (data) {
        const mapped = data.map(({profiles, ...rest}) => ({
            ...rest,
            company_name: profiles?.company_name ?? null
        }));
        const totalPages = Math.ceil((count ?? 0) / limit);
        return NextResponse.json({jobs: mapped ?? [], totalPages});
    } else  if (error) return NextResponse.json({error: error.message}, {status: 500});
    else return NextResponse.json({error: "data null"}, {status: 500});


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

    if (!profile) return fail("profile not found", 404, { code: "404", details: "profile not found" });

    // Insert job
    const {company, ...restBody} = body;
    const { data, error } = await supabase
        .from("jobs")
        .insert([{ ...restBody, company_id: profile.id }])
        .select();

    if (error) return fail("Failed to create jobs", 400, { code: error.code, details: error.message });

    return ok(data);
}