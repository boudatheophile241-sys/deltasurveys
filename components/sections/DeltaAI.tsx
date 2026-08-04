"use client";

import { Sparkles } from "lucide-react";
import type { Product } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DeltaAIChat } from "./DeltaAIChat";
import { useTranslation } from "@/components/i18n/LocaleProvider";

export function DeltaAI({ items }: { items?: Product[] }) {
  const { t } = useTranslation();
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="grid items-stretch gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Presentation */}
        <div className="flex flex-col justify-center">
          <SectionHeading
            eyebrow={t("ai.eyebrow")}
            title={t("ai.title")}
            description={t("ai.desc")}
          />
          <ul className="mt-6 space-y-3">
            {[t("ai.f1"), t("ai.f2"), t("ai.f3")].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-navy-600">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-50 text-brand-red">
                  <Sparkles className="h-3 w-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Fenetre de chat */}
        <div className="h-[32rem]">
          <DeltaAIChat products={items} />
        </div>
      </div>
    </section>
  );
}
