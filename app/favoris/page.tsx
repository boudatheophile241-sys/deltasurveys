import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez les équipements que vous avez ajoutes a vos favoris.",
};

export default function FavorisPage() {
  return (
    <>
      <PageHero
        eyebrow="Espace client"
        title="Mes favoris"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Favoris" }]}
      />
      <section className="container-page py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-dashed border-navy-200 bg-navy-50/40 p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-brand-red">
            <Heart className="h-8 w-8" />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold text-navy-900">
            Votre liste de favoris est vide
          </h2>
          <p className="mt-2 text-sm text-navy-500">
            Parcourez notre catalogue et ajoutez vos équipements préférés pour les
            retrouver ici. La creation d&apos;un compte est requise pour sauvegarder
            vos favoris.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/produits" className="btn h-11 bg-brand-red px-6 text-sm text-white hover:bg-brand-red-dark">
              Voir les produits
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/connexion" className="btn h-11 border border-navy-200 bg-white px-6 text-sm text-navy-800 hover:bg-navy-50">
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
