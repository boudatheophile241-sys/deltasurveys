"use client";

import { useState } from "react";
import { ProductMedia } from "./ProductMedia";

type Accent = "navy" | "red" | "sky" | "amber";

/**
 * Affiche la photo produit si disponible, sinon le visuel de marque (placeholder).
 * Repli automatique sur le placeholder si l'URL de l'image est invalide/cassee.
 */
export function ProductImage({
  image,
  icon,
  accent = "navy",
  alt,
  className,
  iconClassName,
}: {
  image?: string | null;
  icon: string;
  accent?: Accent;
  alt: string;
  className?: string;
  iconClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <div className={`relative overflow-hidden bg-white ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <ProductMedia
      icon={icon}
      accent={accent}
      className={className}
      iconClassName={iconClassName}
    />
  );
}
