import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type Row = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
};

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id,full_name,phone,role,created_at")
    .order("created_at", { ascending: false });

  const clients = (data as Row[] | null) ?? [];

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Clients</h1>
        <p className="mt-1 text-sm text-white/60">{clients.length} compte(s)</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-navy-800">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-400">
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Téléphone</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-navy-50/40">
                  <td className="px-4 py-3 font-medium text-navy-900">
                    {c.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-navy-500">{c.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        c.role === "admin"
                          ? "bg-brand-red/10 text-brand-red"
                          : "bg-navy-50 text-navy-600"
                      }`}
                    >
                      {c.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy-500">
                    {new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 && (
          <div className="py-12 text-center text-navy-500">
            <Users className="mx-auto h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm">Aucun client pour l&apos;instant.</p>
          </div>
        )}
      </div>
    </div>
  );
}
