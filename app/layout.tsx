import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { DeltaAIWidget } from "@/components/layout/DeltaAIWidget";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartProvider } from "@/lib/cart/CartContext";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { company } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/queries";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, defaultLocale, type Locale } from "@/lib/i18n/dictionaries";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deltasurveys.com"),
  title: {
    default: `${company.name} — Équipements de topographie & génie civil`,
    template: `%s | ${company.name}`,
  },
  description:
    "Delta Surveys : vente d'équipements de topographie, geomatique et génie civil (Leica, Trimble, DJI, Topcon...). Solutions certifiées et accompagnement technique au Burkina Faso et en Afrique.",
  keywords: [
    "topographie",
    "station totale",
    "GPS GNSS",
    "drone cartographie",
    "geomatique",
    "génie civil",
    "Burkina Faso",
    "Leica",
    "Trimble",
    "DJI",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: company.name,
    title: `${company.name} — Équipements de topographie & génie civil`,
    description:
      "Solutions premium de topographie et de génie civil au Burkina Faso et partout en Afrique.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = localeCookie === "en" ? "en" : defaultLocale;

  const settings = await getSiteSettings();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let authUser: { name: string; role: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    authUser = {
      name: profile?.full_name || user.email?.split("@")[0] || "Mon compte",
      role: profile?.role ?? "client",
    };
  }

  return (
    <html lang={locale} className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-white font-sans">
        <LocaleProvider initialLocale={locale}>
          <CartProvider>
            {settings.banner_enabled === "true" && (
              <AnnouncementBar
                text={settings.banner_text}
                link={settings.banner_link || undefined}
                linkLabel={settings.banner_link_label || undefined}
              />
            )}
            <Header user={authUser} logoSrc={settings.site_logo || undefined} />
            <main>{children}</main>
            <Footer logoSrc={settings.site_logo || undefined} />
            <WhatsAppFloat />
            <DeltaAIWidget />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
