"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  products as fallbackProducts,
  categories as fallbackCategories,
  brands as fallbackBrands,
  type Product,
  type Category,
  type Brand,
} from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/i18n/LocaleProvider";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export function ProductsExplorer({
  initialCategory = "",
  initialQuery = "",
  products: productsProp,
  categories: categoriesProp,
  brands: brandsProp,
  favoriteIds = [],
}: {
  initialCategory?: string;
  initialQuery?: string;
  products?: Product[];
  categories?: Category[];
  brands?: Brand[];
  favoriteIds?: string[];
}) {
  const { t } = useTranslation();
  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "featured", label: t("shop.sortFeatured") },
    { key: "price-asc", label: t("shop.sortPriceAsc") },
    { key: "price-desc", label: t("shop.sortPriceDesc") },
    { key: "rating", label: t("shop.sortRating") },
  ];
  const favSet = new Set(favoriteIds);
  const products =
    productsProp && productsProp.length > 0 ? productsProp : fallbackProducts;
  const categories =
    categoriesProp && categoriesProp.length > 0 ? categoriesProp : fallbackCategories;
  const brands = brandsProp && brandsProp.length > 0 ? brandsProp : fallbackBrands;
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = !category || p.category === category;
      const matchBrand = !brand || p.brand === brand;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      return matchCat && matchBrand && matchQuery;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [category, brand, query, sort]);

  const activeFilters = [category, brand, query].filter(Boolean).length;

  const clearAll = () => {
    setCategory("");
    setBrand("");
    setQuery("");
  };

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Barre de recherche + tri */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("header.search")}
            className="h-12 w-full rounded-full border border-navy-100 bg-navy-50/60 pl-11 pr-4 text-sm outline-none focus:border-navy-300 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="btn h-12 border border-navy-200 bg-white px-4 text-sm text-navy-800 hover:bg-navy-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("shop.filters")} {activeFilters > 0 && `(${activeFilters})`}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-12 rounded-full border border-navy-200 bg-white px-4 text-sm font-medium text-navy-800 outline-none focus:border-navy-300"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filtres */}
        <aside
          className={cn(
            "space-y-8 lg:block",
            showFilters ? "block" : "hidden",
          )}
        >
          <FilterGroup title={t("shop.categories")}>
            <FilterChip active={!category} onClick={() => setCategory("")}>
              {t("shop.all")}
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c.slug}
                active={category === c.slug}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup title={t("shop.brands")}>
            <FilterChip active={!brand} onClick={() => setBrand("")}>
              {t("shop.all")}
            </FilterChip>
            {brands.map((b) => (
              <FilterChip
                key={b.name}
                active={brand === b.name}
                onClick={() => setBrand(b.name)}
              >
                {b.name}
              </FilterChip>
            ))}
          </FilterGroup>

          {activeFilters > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red hover:underline"
            >
              <X className="h-4 w-4" />
              {t("shop.reset")}
            </button>
          )}
        </aside>

        {/* Grille produits */}
        <div>
          <p className="mb-5 text-sm text-navy-500">
            <span className="font-semibold text-navy-900">{filtered.length}</span>{" "}
            {filtered.length > 1 ? t("shop.foundMany") : t("shop.foundOne")}
          </p>

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} initialFavorite={favSet.has(p.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 py-20 text-center">
              <p className="font-display text-lg font-bold text-navy-900">
                {t("shop.none")}
              </p>
              <p className="mt-1 text-sm text-navy-500">{t("shop.noneDesc")}</p>
              <button
                onClick={clearAll}
                className="btn mt-4 h-10 bg-navy-900 px-5 text-sm text-white hover:bg-navy-800"
              >
                {t("shop.reset")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy-900">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-brand-red bg-brand-red text-white"
          : "border-navy-200 bg-white text-navy-700 hover:border-navy-300 hover:bg-navy-50",
      )}
    >
      {children}
    </button>
  );
}
