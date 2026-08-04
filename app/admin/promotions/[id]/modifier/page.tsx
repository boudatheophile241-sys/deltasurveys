import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PromotionForm } from "@/components/admin/PromotionForm";

export default async function ModifierPromotionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: promotion } = await supabase
    .from("promotions")
    .select("id,title,description,code,discount_percent,active,starts_at,ends_at")
    .eq("id", id)
    .maybeSingle();

  if (!promotion) notFound();

  return (
    <div className="text-white">
      <Link href="/admin/promotions" className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Retour aux promotions
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Modifier : {promotion.title}</h1>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <PromotionForm promotion={promotion} />
      </div>
    </div>
  );
}
