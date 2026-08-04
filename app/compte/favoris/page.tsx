import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductImage } from "@/components/ui/ProductImage";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { removeFavorite } from "@/lib/actions/account";
import { formatCFA } from "@/lib/utils";

type FavRow = {
  product_id: string;
  products: {
    slug: string;
    name: string;
    price: number;
    icon: string | null;
    accent: string | null;
    images: string[] | null;
    brands: { name: string } | null;
  } | null;
};

export default async function FavorisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("favorites")
    .select("product_id, products(slug,name,price,icon,accent,images,brands(name))")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const favorites = (data as unknown as FavRow[] | null)?.filter((f) => f.products) ?? [];

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Aucun favori pour l'instant"
        description="Ajoutez des équipements a vos favoris pour les retrouver ici et les commander plus vite."
        ctaLabel="Parcourir le catalogue"
        ctaHref="/produits"
      />
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((f) => {
        const p = f.products!;
        return (
          <div
            key={f.product_id}
            className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card"
          >
            <ProductImage
              image={p.images?.[0]}
              icon={p.icon ?? "Package"}
              accent={(p.accent ?? "navy") as "navy" | "red" | "sky" | "amber"}
              alt={p.name}
              className="h-20 w-20 shrink-0 rounded-xl"
              iconClassName="h-9 w-9"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase text-brand-red">
                {p.brands?.name}
              </p>
              <Link
                href={`/produits/${p.slug}`}
                className="block truncate font-display font-bold text-navy-900 hover:text-brand-red"
              >
                {p.name}
              </Link>
              <p className="text-sm font-semibold text-navy-700">
                {formatCFA(Number(p.price))}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/produits/${p.slug}`}
                className="btn h-9 border border-navy-200 bg-white px-3 text-xs text-navy-800 hover:bg-navy-50"
              >
                Voir <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <form action={removeFavorite}>
                <input type="hidden" name="product_id" value={f.product_id} />
                <button
                  className="grid h-9 w-9 place-items-center rounded-lg border border-navy-200 text-navy-500 transition hover:border-brand-red hover:text-brand-red"
                  aria-label="Retirer des favoris"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
