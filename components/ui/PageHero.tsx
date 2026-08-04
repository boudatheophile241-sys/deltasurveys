import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
};

export function PageHero({ eyebrow, title, description, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-14 text-white sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div className="absolute inset-0 bg-grid-navy bg-[size:44px_44px] opacity-[0.12]" />
      <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-brand-red/20 blur-[120px]" />

      <div className="container-page relative">
        {breadcrumbs && (
          <nav className="mb-5 flex items-center gap-1.5 text-sm text-white/50">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {c.href ? (
                  <Link href={c.href} className="transition hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <span className="eyebrow mb-3 text-brand-red">
            <span className="h-px w-6 bg-brand-red" />
            {eyebrow}
          </span>
        )}
        <h1 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
