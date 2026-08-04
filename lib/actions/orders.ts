"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type OrderResult =
  | { status: "ok"; reference: string }
  | { status: "unauth" }
  | { status: "empty" }
  | { status: "error" };

type IncomingItem = { id: string; quantity: number };

/**
 * Cree une commande a partir du panier.
 * Les prix sont re-lus en base (jamais depuis le client) pour eviter toute falsification.
 */
export async function createOrder(
  items: IncomingItem[],
  channel: "whatsapp" | "online",
): Promise<OrderResult> {
  if (!items || items.length === 0) return { status: "empty" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "unauth" };

  // Prix officiels depuis la base.
  const ids = items.map((i) => i.id);
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id,name,price")
    .in("id", ids);
  if (prodErr || !products) return { status: "error" };

  const priceMap = new Map(products.map((p) => [p.id, p]));
  const lines = items
    .map((i) => {
      const p = priceMap.get(i.id);
      if (!p) return null;
      const qty = Math.max(1, Math.floor(i.quantity));
      return {
        product_id: p.id,
        product_name: p.name,
        unit_price: Number(p.price),
        quantity: qty,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  if (lines.length === 0) return { status: "error" };

  const total = lines.reduce((n, l) => n + l.unit_price * l.quantity, 0);

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total, channel, status: "pending" })
    .select("id,reference")
    .single();
  if (orderErr || !order) return { status: "error" };

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(lines.map((l) => ({ ...l, order_id: order.id })));
  if (itemsErr) return { status: "error" };

  // Notification client.
  await supabase.from("notifications").insert({
    user_id: user.id,
    title: "Commande enregistree",
    body: `Votre commande ${order.reference} a bien ete enregistree. Notre equipe vous recontacte pour la suite.`,
  });

  revalidatePath("/compte/commandes");
  revalidatePath("/compte");
  return { status: "ok", reference: order.reference };
}
