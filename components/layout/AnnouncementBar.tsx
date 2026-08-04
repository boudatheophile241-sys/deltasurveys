"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export function AnnouncementBar({
  text,
  link,
  linkLabel,
}: {
  text: string;
  link?: string;
  linkLabel?: string;
}) {
  const [open, setOpen] = useState(true);
  if (!open || !text) return null;

  return (
    <div className="relative bg-brand-red text-white">
      <div className="container-page flex items-center justify-center gap-3 py-2 text-center text-xs font-medium sm:text-sm">
        <p className="flex flex-wrap items-center justify-center gap-x-2">
          <span>{text}</span>
          {link && linkLabel && (
            <Link
              href={link}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-90"
            >
              {linkLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </p>
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="absolute right-4 grid h-6 w-6 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
