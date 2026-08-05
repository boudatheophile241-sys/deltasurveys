"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/components/i18n/LocaleProvider";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.4 0 10.3-2.1 14-5.5l-6.5-5.3C29.6 34.4 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.6 39 16.2 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.5 5.3C41.9 35.9 43.5 30.4 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#1877F2" d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z" />
    </svg>
  );
}

// Boutons sociaux masqués tant que les fournisseurs OAuth ne sont pas activés
// dans Supabase. Mettre NEXT_PUBLIC_SOCIAL_AUTH="1" (env Vercel) pour les afficher.
const SOCIAL_AUTH_ENABLED = process.env.NEXT_PUBLIC_SOCIAL_AUTH === "1";

export function SocialAuth({ redirectTo }: { redirectTo?: string }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<"google" | "facebook" | null>(null);
  const [failed, setFailed] = useState(false);

  if (!SOCIAL_AUTH_ENABLED) return null;

  const signIn = async (provider: "google" | "facebook") => {
    setLoading(provider);
    setFailed(false);
    const supabase = createClient();
    const redirect = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback${redirect}` },
    });
    if (error) {
      setLoading(null);
      setFailed(true);
    }
  };

  return (
    <div className="space-y-3">
      {failed && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {t("auth.socialError")}
        </div>
      )}
      <button
        type="button"
        onClick={() => signIn("google")}
        disabled={loading !== null}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-navy-200 bg-white text-sm font-semibold text-navy-800 transition hover:bg-navy-50 disabled:opacity-60"
      >
        {loading === "google" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
        {t("auth.google")}
      </button>
      <button
        type="button"
        onClick={() => signIn("facebook")}
        disabled={loading !== null}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-navy-200 bg-white text-sm font-semibold text-navy-800 transition hover:bg-navy-50 disabled:opacity-60"
      >
        {loading === "facebook" ? <Loader2 className="h-5 w-5 animate-spin" /> : <FacebookIcon />}
        {t("auth.facebook")}
      </button>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-navy-100" />
        <span className="text-xs uppercase tracking-wide text-navy-400">{t("auth.or")}</span>
        <span className="h-px flex-1 bg-navy-100" />
      </div>
    </div>
  );
}
