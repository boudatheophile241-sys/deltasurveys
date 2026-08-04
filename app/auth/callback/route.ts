import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Point de retour OAuth (Google / Facebook). Supabase redirige ici avec un
 * "code" que l'on échange contre une session, puis on renvoie l'utilisateur.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/compte";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/connexion?error=oauth`);
}
