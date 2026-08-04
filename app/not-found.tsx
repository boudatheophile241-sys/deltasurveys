import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-navy-950 py-20 text-center text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div className="absolute inset-0 bg-grid-navy bg-[size:44px_44px] opacity-[0.12]" />
      <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-brand-red/20 blur-[120px]" />
      <div className="container-page relative">
        <p className="font-display text-7xl font-extrabold text-brand-red sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          Page introuvable
        </h1>
        <p className="mx-auto mt-3 max-w-md text-white/60">
          La page que vous recherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn h-12 bg-brand-red px-6 text-white hover:bg-brand-red-dark">
            <Home className="h-4 w-4" /> Retour a l&apos;accueil
          </Link>
          <Link href="/produits" className="btn h-12 border border-white/20 bg-white/5 px-6 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Voir les produits
          </Link>
        </div>
      </div>
    </section>
  );
}
