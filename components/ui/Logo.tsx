import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
  src?: string;
  /** Classe(s) pour dimensionner l'image du logo téléversé (ex. "h-14"). */
  imgClassName?: string;
  /** Hauteur en pixels du logo téléversé (prioritaire, réglable depuis l'admin). */
  heightPx?: number;
};

/**
 * Logo Delta Surveys. Si `src` est fourni (logo téléversé depuis l'admin),
 * l'image est utilisée ; sinon un logo vectoriel de repli aux couleurs de la
 * marque est affiché.
 */
export function Logo({ className, variant = "dark", src, imgClassName, heightPx }: LogoProps) {
  const delta = variant === "light" ? "text-white" : "text-brand-blue";

  if (src) {
    return (
      <Link href="/" className={cn("inline-flex items-center", className)} aria-label="Delta Surveys — Accueil">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Delta Surveys"
          className={cn("h-11 w-auto object-contain", imgClassName)}
          style={heightPx ? { height: `${heightPx}px` } : undefined}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Delta Surveys — Accueil">
      <span className="relative grid h-11 w-11 place-items-center">
        <svg viewBox="0 0 44 44" className="h-11 w-11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          {/* Triangle (delta) rouge */}
          <path d="M22 4 L40 37 H4 Z" className="fill-brand-red" />
          {/* Instrument (station totale) stylisé en blanc */}
          <rect x="18" y="14" width="8" height="10" rx="1.5" className="fill-white" />
          <rect x="19.5" y="24" width="5" height="6" className="fill-white" />
          <circle cx="22" cy="19" r="2.2" className="fill-brand-red" />
          {/* Ondes de mesure */}
          <path d="M9 33 L15 30" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 30 L14 27" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-extrabold tracking-tight">
          <span className={delta}>DELTA</span>
          <span className="text-brand-red">.</span>
        </span>
        <span className="mt-1 inline-block rounded bg-brand-red px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-white">
          Surveys
        </span>
      </span>
    </Link>
  );
}
