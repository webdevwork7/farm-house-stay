import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
      }

      // If successful, check user role and redirect appropriately
      if (data.user) {
        // Get user profile to check role
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();

        // Redirect based on role or email
        if (
          profile?.role === "admin" ||
          data.user.email === "admin@gmail.com"
        ) {
          return NextResponse.redirect(`${requestUrl.origin}/admin`);
        } else if (profile?.role === "owner") {
          return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
        } else {
          return NextResponse.redirect(`${requestUrl.origin}/`);
        }
      }
    } catch (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
    }
  }

  // If no code, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
}
