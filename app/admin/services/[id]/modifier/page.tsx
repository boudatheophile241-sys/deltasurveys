import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default async function ModifierServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("id,slug,title,description,icon,accent,features,sort_order")
    .eq("id", id)
    .maybeSingle();

  if (!service) notFound();

  return (
    <div className="text-white">
      <Link href="/admin/services" className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Retour aux services
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Modifier : {service.title}</h1>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
