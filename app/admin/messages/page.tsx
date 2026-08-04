import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateMessageStatus } from "@/lib/actions/admin";

const options = [
  { value: "new", label: "Nouveau" },
  { value: "read", label: "Lu" },
  { value: "replied", label: "Répondu" },
];

type Row = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("id,name,email,phone,subject,message,status,created_at")
    .order("created_at", { ascending: false });

  const messages = (data as Row[] | null) ?? [];

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-white/60">{messages.length} message(s) de contact</p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/50">
          <MessageSquare className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-3 text-sm">Aucun message pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white p-5 text-navy-800 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold text-navy-900">{m.subject || "Message"}</p>
                  <p className="mt-0.5 text-sm text-navy-500">De : {m.name}</p>
                </div>
                <StatusSelect id={m.id} current={m.status} options={options} action={updateMessageStatus} />
              </div>
              {m.message && <p className="mt-3 text-sm text-navy-600">{m.message}</p>}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-navy-400">
                {m.phone && <span>Tel : {m.phone}</span>}
                {m.email && <span>Email : {m.email}</span>}
                <span>{new Date(m.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
