"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart/CartContext";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  className,
}: {
  product: Omit<CartItem, "quantity">;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={cn(
        "btn h-12 text-sm text-white transition",
        added ? "bg-emerald-600" : "bg-navy-900 hover:bg-navy-800",
        className,
      )}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Ajoute au panier
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> Ajouter au panier
        </>
      )}
    </button>
  );
}
