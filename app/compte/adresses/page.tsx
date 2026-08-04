import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function AdressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: addresses } = await supabase
    .from("addresses")
    .select("id,label,line1,city,country,phone,is_default")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!addresses || addresses.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Aucune adresse enregistrée"
        description="Ajoutez une adresse de livraison pour accelerer vos futures commandes. La gestion des adresses arrive très bientôt."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((a) => (
        <div key={a.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-navy-900">{a.label || "Adresse"}</p>
            {a.is_default && (
              <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700">
                Par defaut
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-navy-600">{a.line1}</p>
          <p className="text-sm text-navy-500">
            {a.city}, {a.country}
          </p>
          {a.phone && <p className="mt-1 text-sm text-navy-500">{a.phone}</p>}
        </div>
      ))}
    </div>
  );
}
