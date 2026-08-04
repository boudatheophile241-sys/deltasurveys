import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { getT } from "@/lib/i18n/server";

export default async function CompteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?redirect=/compte");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name || user.email?.split("@")[0] || "";
  const t = await getT();

  return (
    <div className="bg-navy-50/40">
      <div className="container-page py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-sm text-navy-500">{t("dash.space")}</p>
          <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            {t("dash.hello")}, {name} 👋
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-navy-100 bg-white p-3 shadow-card">
              <DashboardNav />
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
