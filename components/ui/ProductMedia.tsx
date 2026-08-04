import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

type Accent = "navy" | "red" | "sky" | "amber";

const accents: Record<Accent, string> = {
  navy: "from-navy-50 to-navy-100 text-navy-700",
  red: "from-rose-50 to-red-100 text-brand-red",
  sky: "from-sky-50 to-blue-100 text-navy-600",
  amber: "from-amber-50 to-orange-100 text-amber-600",
};

type ProductMediaProps = {
  icon: string;
  accent?: Accent;
  className?: string;
  iconClassName?: string;
};

/**
 * Media produit stylise (placeholder de marque, sans dependance reseau).
 * Sera remplace par les photos Cloudinary a l'intégration back-end.
 */
export function ProductMedia({
  icon,
  accent = "navy",
  className,
  iconClassName,
}: ProductMediaProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        accents[accent],
        className,
      )}
    >
      {/* Grille technique discrete */}
      <div className="absolute inset-0 bg-grid-navy bg-[size:20px_20px] opacity-40" />
      {/* Halo */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/50 blur-2xl" />
      <Icon
        name={icon}
        strokeWidth={1.25}
        className={cn("relative h-20 w-20 drop-shadow-sm", iconClassName)}
      />
    </div>
  );
}
