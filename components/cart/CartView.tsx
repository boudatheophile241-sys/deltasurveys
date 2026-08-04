"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { ProductImage } from "@/components/ui/ProductImage";
import { PaymentIcons } from "@/components/ui/PaymentIcons";
import { createOrder } from "@/lib/actions/orders";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import { formatCFA, whatsappLink } from "@/lib/utils";

export function CartView() {
  const { items, total, setQuantity, remove, clear } = useCart();
  const { t } = useTranslation();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const buildWaMessage = (reference?: string) => {
    const lines = items
      .map((i) => `- ${i.name} x ${i.quantity} = ${formatCFA(i.price * i.quantity)}`)
      .join("\n");
    const ref = reference ? `\nReference : ${reference}` : "";
    return whatsappLink(
      `Bonjour Delta Surveys, je souhaite commander :\n${lines}\n\nTotal : ${formatCFA(total)}${ref}`,
    );
  };

  const placeOrder = (channel: "online" | "whatsapp") => {
    setError(null);
    startTransition(async () => {
      const res = await createOrder(
        items.map((i) => ({ id: i.id, quantity: i.quantity })),
        channel,
      );
      if (res.status === "unauth") {
        if (channel === "whatsapp") {
          // Invite (guest) : ouvre WhatsApp sans enregistrer.
          window.open(buildWaMessage(), "_blank");
          return;
        }
        router.push("/connexion?redirect=/panier");
        return;
      }
      if (res.status === "ok") {
        if (channel === "whatsapp") window.open(buildWaMessage(res.reference), "_blank");
        clear();
        router.push("/compte/commandes");
        return;
      }
      setError("Une erreur est survenue. Reessayez ou commandez via WhatsApp.");
    });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-dashed border-navy-200 bg-navy-50/40 p-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy-100 text-navy-700">
          <ShoppingBag className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold text-navy-900">
          {t("cart.empty")}
        </h2>
        <p className="mt-2 text-sm text-navy-500">{t("cart.emptyDesc")}</p>
        <Link
          href="/produits"
          className="btn mt-6 h-11 bg-brand-red px-6 text-sm text-white hover:bg-brand-red-dark"
        >
          {t("cart.viewProducts")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Articles */}
      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card"
          >
            <ProductImage
              image={i.image}
              icon={i.icon}
              accent={i.accent as "navy" | "red" | "sky" | "amber"}
              alt={i.name}
              className="h-20 w-20 shrink-0 rounded-xl"
              iconClassName="h-9 w-9"
            />
            <div className="min-w-0 flex-1">
              {i.brand && (
                <p className="text-xs font-semibold uppercase text-brand-red">{i.brand}</p>
              )}
              <Link
                href={`/produits/${i.slug}`}
                className="block truncate font-display font-bold text-navy-900 hover:text-brand-red"
              >
                {i.name}
              </Link>
              <p className="text-sm font-semibold text-navy-700">{formatCFA(i.price)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center rounded-full border border-navy-200">
                <button
                  onClick={() => setQuantity(i.id, i.quantity - 1)}
                  className="grid h-8 w-8 place-items-center text-navy-600 hover:text-brand-red"
                  aria-label="Diminuer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{i.quantity}</span>
                <button
                  onClick={() => setQuantity(i.id, i.quantity + 1)}
                  className="grid h-8 w-8 place-items-center text-navy-600 hover:text-brand-red"
                  aria-label="Augmenter"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => remove(i.id)}
                className="inline-flex items-center gap-1 text-xs text-navy-400 hover:text-brand-red"
              >
                <Trash2 className="h-3.5 w-3.5" /> {t("cart.remove")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Récapitulatif */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-navy-900">{t("cart.summary")}</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-navy-600">
              <span>{t("cart.subtotal")}</span>
              <span className="font-semibold text-navy-900">{formatCFA(total)}</span>
            </div>
            <div className="flex justify-between text-navy-600">
              <span>{t("cart.delivery")}</span>
              <span className="text-navy-500">{t("cart.toDefine")}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-navy-100 pt-4">
            <span className="font-display font-bold text-navy-900">{t("cart.total")}</span>
            <span className="font-display text-xl font-extrabold text-navy-900">
              {formatCFA(total)}
            </span>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <div className="mt-5 space-y-2.5">
            <button
              onClick={() => placeOrder("online")}
              disabled={pending}
              className="btn h-12 w-full bg-brand-red text-sm text-white hover:bg-brand-red-dark"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {t("cart.checkout")}
            </button>
            <button
              onClick={() => placeOrder("whatsapp")}
              disabled={pending}
              className="btn h-12 w-full bg-[#25D366] text-sm text-white hover:bg-[#1eb257]"
            >
              <MessageCircle className="h-4 w-4" /> {t("cart.whatsapp")}
            </button>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs text-navy-400">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
            Commande sans paiement immédiat. Paiement à la livraison ou par mobile
            money et carte : bientôt disponibles en ligne.
          </p>
          <div className="mt-4 border-t border-navy-100 pt-4">
            <PaymentIcons />
          </div>
        </div>

        <button
          onClick={clear}
          className="mt-3 w-full text-center text-xs text-navy-400 hover:text-brand-red"
        >
          {t("cart.clear")}
        </button>
      </div>
    </div>
  );
}
