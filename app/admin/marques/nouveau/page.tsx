import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandForm } from "@/components/admin/BrandForm";

export default function NouvelleMarquePage() {
  return (
    <div className="text-white">
      <Link href="/admin/marques" className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Retour aux marques
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Nouvelle marque</h1>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <BrandForm />
      </div>
    </div>
  );
}
