"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  GitCompareArrows,
  ShieldCheck,
  Truck,
  Check,
} from "lucide-react";
import type { Product } from "@/lib/data";
import { ProductImage } from "@/components/ui/ProductImage";
import { Rating } from "@/components/ui/Rating";
import { FavoriteButton } from "./FavoriteButton";
import { useCart } from "@/lib/cart/CartContext";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import { cn, formatCFA, whatsappLink } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  Nouveau: "bg-navy-900 text-white",
  Promo: "bg-brand-red text-white",
  "Top Vente": "bg-amber-400 text-navy-900",
};

export function ProductCard({
  product,
  initialFavorite = false,
}: {
  product: Product;
  initialFavorite?: boolean;
}) {
  const { add } = useCart();
  const { t } = useTranslation();
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      icon: product.icon,
      accent: product.accent,
      brand: product.brand,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const waMessage = whatsappLink(
    `Bonjour Delta Surveys, je souhaite commander : ${product.name} (${product.brand}) au prix de ${formatCFA(
      product.price,
    )}. Merci de me recontacter.`,
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Media */}
      <div className="relative">
        <Link href={`/produits/${product.slug}`}>
          <ProductImage
            image={product.image}
            icon={product.icon}
            accent={product.accent}
            alt={product.name}
            className="aspect-[4/3] w-full"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <span
              key={b}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm",
                badgeStyles[b],
              )}
            >
              {b}
            </span>
          ))}
        </div>

        {/* Actions flottantes */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <FavoriteButton productId={product.id} initialFavorite={initialFavorite} />
          <button
            type="button"
            aria-label="Comparer"
            className="grid h-9 w-9 place-items-center rounded-full border border-navy-100 bg-white/90 text-navy-700 shadow-sm backdrop-blur transition hover:text-navy-900"
          >
            <GitCompareArrows className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">
            {product.brand}
          </span>
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" /> {t("product.inStock")}
            </span>
          ) : (
            <span className="text-xs font-medium text-navy-400">{t("product.onOrder")}</span>
          )}
        </div>

        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-display text-lg font-bold leading-snug text-navy-900 transition group-hover:text-brand-red">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-sm text-navy-500">
          {product.shortDescription}
        </p>

        <div className="mt-3">
          <Rating value={product.rating} reviews={product.reviews} />
        </div>

        {/* Garantie / livraison */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-navy-400" /> {product.warranty}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-navy-400" /> {product.delivery}
          </span>
        </div>

        {/* Prix */}
        <div className="mt-4 flex items-end gap-2">
          <span className="font-display text-xl font-extrabold text-navy-900">
            {formatCFA(product.price)}
          </span>
          {product.oldPrice && (
            <span className="mb-0.5 text-sm text-navy-400 line-through">
              {formatCFA(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Boutons */}
        <div className="mt-4 flex flex-col gap-2">
          <a
            href={waMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="btn h-10 w-full bg-[#25D366] text-sm text-white hover:bg-[#1eb257]"
          >
            <MessageCircle className="h-4 w-4" />
            {t("product.whatsapp")}
          </a>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/devis?produit=${product.slug}`}
              className="btn h-10 border border-navy-200 text-xs text-navy-800 hover:bg-navy-50"
            >
              {t("product.quote")}
            </Link>
            <button
              type="button"
              onClick={addToCart}
              className={cn(
                "btn h-10 text-xs text-white transition",
                added ? "bg-emerald-600" : "bg-navy-900 hover:bg-navy-800",
              )}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" /> {t("product.added")}
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" /> {t("product.cart")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
