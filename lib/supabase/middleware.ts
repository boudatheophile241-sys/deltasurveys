import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

/**
 * Rafraichit la session Supabase et protege les routes privees.
 * Doit etre appele depuis le middleware racine.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isCompte = path.startsWith("/compte");
  const isAdmin = path.startsWith("/admin");

  // Routes privees : redirige vers connexion si non authentifie.
  if ((isCompte || isAdmin) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Routes admin : verifie le role.
  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/compte";
      return NextResponse.redirect(url);
    }
  }

  // Si deja connecte, evite les pages d'auth.
  if ((path === "/connexion" || path === "/inscription") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/compte";
    return NextResponse.redirect(url);
  }

  return response;
}
