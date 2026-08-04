"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  initialFavorite?: boolean;
  variant?: "icon" | "full";
  className?: string;
};

export function FavoriteButton({
  productId,
  initialFavorite = false,
  variant = "icon",
  className,
}: Props) {
  const [fav, setFav] = useState(initialFavorite);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    startTransition(async () => {
      const res = await toggleFavorite(productId);
      if (res.status === "unauth") {
        router.push(`/connexion?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      if (res.status === "ok") setFav(res.favorite);
    });
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={cn(
          "btn h-11 flex-1 border text-sm transition",
          fav
            ? "border-brand-red bg-rose-50 text-brand-red"
            : "border-navy-200 bg-white text-navy-700 hover:bg-navy-50",
          className,
        )}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={cn("h-4 w-4", fav && "fill-current")} />
        )}
        {fav ? "Dans vos favoris" : "Favoris"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={fav}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border shadow-sm backdrop-blur transition",
        fav
          ? "border-brand-red bg-brand-red text-white"
          : "border-navy-100 bg-white/90 text-navy-700 hover:text-brand-red",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-4 w-4", fav && "fill-current")} />
      )}
    </button>
  );
}
