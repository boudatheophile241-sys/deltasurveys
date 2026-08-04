"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { saveProduct, type AdminState } from "@/lib/actions/admin";
import { ImageUploader } from "./ImageUploader";

type Option = { id: string; name: string };

export type ProductFormData = {
  id: string;
  name: string;
  slug: string;
  brand_id: string | null;
  category_id: string | null;
  price: number;
  old_price: number | null;
  stock_qty: number | null;
  in_stock: boolean | null;
  warranty: string | null;
  delivery: string | null;
  icon: string | null;
  accent: string | null;
  short_description: string | null;
  description: string | null;
  specs: { label: string; value: string }[];
  badges: string[];
  images: string[] | null;
  is_featured: boolean | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn h-11 bg-brand-red px-6 text-sm text-white hover:bg-brand-red-dark"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Enregistrer
    </button>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-400";
const labelCls = "mb-1.5 block text-sm font-medium text-navy-700";

export function ProductForm({
  categories,
  brands,
  product,
}: {
  categories: Option[];
  brands: Option[];
  product?: ProductFormData;
}) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveProduct, null);
  const specsText = (product?.specs ?? [])
    .map((s) => `${s.label}: ${s.value}`)
    .join("\n");
  const [imagesText, setImagesText] = useState((product?.images ?? []).join("\n"));

  const appendImage = (url: string) =>
    setImagesText((prev) => (prev.trim() ? `${prev.trim()}\n${url}` : url));

  return (
    <form action={formAction} className="space-y-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className={labelCls}>Nom du produit *</label>
          <input name="name" required defaultValue={product?.name} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug (laisser vide = auto)</label>
          <input name="slug" defaultValue={product?.slug} className={inputCls} placeholder="ex: leica-ts07" />
        </div>
        <div>
          <label className={labelCls}>Marque *</label>
          <select name="brand_id" required defaultValue={product?.brand_id ?? ""} className={inputCls}>
            <option value="" disabled>Choisir une marque</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Categorie *</label>
          <select name="category_id" required defaultValue={product?.category_id ?? ""} className={inputCls}>
            <option value="" disabled>Choisir une categorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Prix (FCFA) *</label>
          <input name="price" type="number" min="0" required defaultValue={product?.price} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Ancien prix (promo, optionnel)</label>
          <input name="old_price" type="number" min="0" defaultValue={product?.old_price ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Quantite en stock</label>
          <input name="stock_qty" type="number" min="0" defaultValue={product?.stock_qty ?? 0} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Icone (nom Lucide)</label>
          <input name="icon" defaultValue={product?.icon ?? "Package"} className={inputCls} placeholder="ex: Crosshair, Satellite, Send" />
        </div>
        <div>
          <label className={labelCls}>Couleur d&apos;accent</label>
          <select name="accent" defaultValue={product?.accent ?? "navy"} className={inputCls}>
            <option value="navy">Bleu (navy)</option>
            <option value="red">Rouge</option>
            <option value="sky">Ciel</option>
            <option value="amber">Ambre</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Garantie</label>
          <input name="warranty" defaultValue={product?.warranty ?? ""} className={inputCls} placeholder="ex: 2 ans constructeur" />
        </div>
        <div className="lg:col-span-2">
          <label className={labelCls}>Livraison</label>
          <input name="delivery" defaultValue={product?.delivery ?? ""} className={inputCls} placeholder="ex: Livraison 48h — Ouaga" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description courte</label>
        <textarea name="short_description" rows={2} defaultValue={product?.short_description ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls}>Description complète</label>
        <textarea name="description" rows={4} defaultValue={product?.description ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls}>Photos du produit</label>
        <div className="mb-2">
          <ImageUploader folder="products" onUploaded={appendImage} />
        </div>
        <textarea
          name="images"
          rows={3}
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          className={`${inputCls} h-auto py-2 font-mono text-xs`}
          placeholder={"https://exemple.com/photo1.jpg\nhttps://exemple.com/photo2.jpg"}
        />
        <p className="mt-1 text-xs text-navy-400">
          Téléversez vos photos ou collez des URLs (une par ligne). La 1re image est la
          principale. Sans photo, un visuel de marque est affiche automatiquement.
        </p>
      </div>
      <div>
        <label className={labelCls}>Caractéristiques (une par ligne, format &quot;Label: Valeur&quot;)</label>
        <textarea
          name="specs"
          rows={5}
          defaultValue={specsText}
          className={`${inputCls} h-auto py-2 font-mono text-xs`}
          placeholder={"Précision: 1\"\nPortee: 6 000 m"}
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-xl border border-navy-100 bg-navy-50/50 p-4">
        <label className="flex items-center gap-2 text-sm text-navy-700">
          <input type="checkbox" name="badge_nouveau" defaultChecked={product?.badges.includes("Nouveau")} className="h-4 w-4 rounded border-navy-300" />
          Badge &quot;Nouveau&quot;
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-700">
          <input type="checkbox" name="badge_promo" defaultChecked={product?.badges.includes("Promo")} className="h-4 w-4 rounded border-navy-300" />
          Badge &quot;Promo&quot;
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-700">
          <input type="checkbox" name="badge_top" defaultChecked={product?.badges.includes("Top Vente")} className="h-4 w-4 rounded border-navy-300" />
          Badge &quot;Top Vente&quot;
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-700">
          <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} className="h-4 w-4 rounded border-navy-300" />
          Produit vedette (accueil)
        </label>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/admin/produits" className="btn h-11 border border-navy-200 bg-white px-6 text-sm text-navy-700 hover:bg-navy-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
