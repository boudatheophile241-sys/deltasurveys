import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateQuoteStatus } from "@/lib/actions/admin";

const options = [
  { value: "new", label: "Nouveau" },
  { value: "processing", label: "En traitement" },
  { value: "sent", label: "Envoyé" },
  { value: "closed", label: "Clôture" },
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
  products: { name: string } | null;
};

export default async function AdminDevisPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select("id,name,email,phone,subject,message,status,created_at,products(name)")
    .order("created_at", { ascending: false });

  const quotes = (data as unknown as Row[] | null) ?? [];

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Devis</h1>
        <p className="mt-1 text-sm text-white/60">{quotes.length} demande(s) de devis</p>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/50">
          <FileText className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-3 text-sm">Aucune demande de devis pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quotes.map((q) => (
            <div key={q.id} className="rounded-2xl bg-white p-5 text-navy-800 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold text-navy-900">
                    {q.subject || "Demande de devis"}
                  </p>
                  <p className="mt-0.5 text-sm text-navy-500">
                    {q.name}
                    {q.products?.name && (
                      <> · Produit : <span className="font-medium text-navy-700">{q.products.name}</span></>
                    )}
                  </p>
                </div>
                <StatusSelect id={q.id} current={q.status} options={options} action={updateQuoteStatus} />
              </div>
              {q.message && <p className="mt-3 text-sm text-navy-600">{q.message}</p>}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-navy-400">
                {q.phone && <span>Tel : {q.phone}</span>}
                {q.email && <span>Email : {q.email}</span>}
                <span>{new Date(q.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
