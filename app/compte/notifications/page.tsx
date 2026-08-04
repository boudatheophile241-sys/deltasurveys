import { Bell, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { markAllNotificationsRead } from "@/lib/actions/account";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id,title,body,read,created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!notifications || notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Aucune notification"
        description="Vous serez notifie ici du suivi de vos commandes, devis et nouveautes."
      />
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="space-y-4">
      {hasUnread && (
        <form action={markAllNotificationsRead} className="flex justify-end">
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline">
            <CheckCheck className="h-4 w-4" /> Tout marquer comme lu
          </button>
        </form>
      )}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border p-5 shadow-card ${
              n.read ? "border-navy-100 bg-white" : "border-brand-red/20 bg-rose-50/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${n.read ? "bg-navy-50 text-navy-500" : "bg-brand-red/10 text-brand-red"}`}>
                <Bell className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{n.title}</p>
                {n.body && <p className="mt-0.5 text-sm text-navy-500">{n.body}</p>}
                <p className="mt-1 text-xs text-navy-400">
                  {new Date(n.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
