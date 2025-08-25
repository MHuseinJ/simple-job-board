import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // write auth cookies to the response
                        res.cookies.set(name, value, options as CookieOptions);
                    });
                },
            },
        }
    );

    // Touch the session so auth cookies stay fresh
    await supabase.auth.getUser();

    // Example gate: protect /job/create (redirect to /login if not logged in)
    if (req.nextUrl.pathname.startsWith("/job/create")) {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
            const url = new URL("/login", req.url);
            return NextResponse.redirect(url);
        }
    }

    return res;
}

export const config = {
    matcher: ["/job/:path*", "/jobs/:path*"], // run only on these routes
};