import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ShieldCheck,
  Truck,
  MessageCircle,
  FileText,
  GitCompareArrows,
  ArrowLeft,
} from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Rating } from "@/components/ui/Rating";
import { formatCFA, whatsappLink } from "@/lib/utils";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategories,
  getFavoriteIds,
} from "@/lib/queries";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

const badgeStyles: Record<string, string> = {
  Nouveau: "bg-navy-900 text-white",
  Promo: "bg-brand-red text-white",
  "Top Vente": "bg-amber-400 text-navy-900",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, similar, favoriteIds, t] = await Promise.all([
    getCategories(),
    getRelatedProducts(product.category, product.slug),
    getFavoriteIds(),
    getT(),
  ]);
  const category = categories.find((c) => c.slug === product.category);
  const favSet = new Set(favoriteIds);

  const waMessage = whatsappLink(
    `Bonjour Delta Surveys, je souhaite commander : ${product.name} (${product.brand}) au prix de ${formatCFA(
      product.price,
    )}. Merci de me recontacter.`,
  );

  return (
    <>
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-page flex items-center gap-1.5 py-4 text-sm text-navy-500">
          <Link href="/" className="hover:text-brand-red">{t("nav.home")}</Link>
          <span>/</span>
          <Link href="/produits" className="hover:text-brand-red">{t("nav.products")}</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/produits?categorie=${category.slug}`} className="hover:text-brand-red">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-navy-900">{product.name}</span>
        </div>
      </div>

      <section className="container-page py-10 sm:py-14">
        <Link
          href="/produits"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 transition hover:text-brand-red"
        >
          <ArrowLeft className="h-4 w-4" /> {t("pd.back")}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Media */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-navy-100 shadow-card">
              <ProductImage
                image={product.image}
                icon={product.icon}
                accent={product.accent}
                alt={product.name}
                className="aspect-square w-full"
                iconClassName="h-40 w-40"
              />
              <div className="absolute left-4 top-4 flex gap-2">
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeStyles[b]}`}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            {(product.images?.length ?? 0) > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images!.slice(0, 4).map((img, i) => (
                  <ProductImage
                    key={i}
                    image={img}
                    icon={product.icon}
                    accent={product.accent}
                    alt={`${product.name} ${i + 1}`}
                    className="aspect-square w-full cursor-pointer rounded-xl border border-navy-100"
                    iconClassName="h-8 w-8"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-red">
                {product.brand}
              </span>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                  <Check className="h-3.5 w-3.5" /> {t("product.inStock")}
                </span>
              ) : (
                <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-500">
                  {t("product.onOrder")}
                </span>
              )}
            </div>

            <h1 className="mt-2 font-display text-3xl font-extrabold text-navy-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3">
              <Rating value={product.rating} reviews={product.reviews} />
            </div>

            <p className="mt-4 text-base leading-relaxed text-navy-600">
              {product.shortDescription}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-3xl font-extrabold text-navy-900">
                {formatCFA(product.price)}
              </span>
              {product.oldPrice && (
                <span className="mb-1 text-lg text-navy-400 line-through">
                  {formatCFA(product.oldPrice)}
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3">
                <ShieldCheck className="h-5 w-5 text-brand-red" />
                <span className="text-sm text-navy-700">{product.warranty}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3">
                <Truck className="h-5 w-5 text-brand-red" />
                <span className="text-sm text-navy-700">{product.delivery}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <a
                href={waMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn h-13 w-full bg-[#25D366] text-base text-white hover:bg-[#1eb257]"
              >
                <MessageCircle className="h-5 w-5" />
                {t("product.whatsapp")}
              </a>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/devis?produit=${product.slug}`}
                  className="btn h-12 border border-navy-200 bg-white text-sm text-navy-800 hover:bg-navy-50"
                >
                  <FileText className="h-4 w-4" /> {t("product.quote")}
                </Link>
                <AddToCartButton
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    icon: product.icon,
                    accent: product.accent,
                    brand: product.brand,
                    image: product.image,
                  }}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <FavoriteButton
                  productId={product.id}
                  initialFavorite={favSet.has(product.id)}
                  variant="full"
                />
                <button className="btn h-11 flex-1 border border-navy-200 bg-white text-sm text-navy-700 hover:bg-navy-50">
                  <GitCompareArrows className="h-4 w-4" /> {t("pd.compare")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-bold text-navy-900">
              {t("pd.specs")}
            </h2>
            <dl className="mt-4 divide-y divide-navy-50">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between py-3">
                  <dt className="text-sm text-navy-500">{s.label}</dt>
                  <dd className="text-sm font-semibold text-navy-900">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-navy-50/50 p-6">
            <h2 className="font-display text-xl font-bold text-navy-900">
              {t("pd.deliveryWarranty")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-navy-600">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {t("pd.dw1")}
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {product.warranty}{t("pd.dw2")}
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {product.delivery}{t("pd.dw3")}
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {t("pd.dw4")}
              </li>
            </ul>
          </div>
        </div>

        {/* Produits similaires */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-navy-900">
              {t("pd.similar")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} initialFavorite={favSet.has(p.id)} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
