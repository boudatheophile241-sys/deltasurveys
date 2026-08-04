import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-navy-500 shadow-sm">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-navy-500">{description}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="btn mt-5 h-10 bg-navy-900 px-5 text-sm text-white hover:bg-navy-800"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
