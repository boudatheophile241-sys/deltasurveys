"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

export function WhatsAppFloat() {
  const href = whatsappLink(
    "Bonjour Delta Surveys, je souhaite obtenir des informations sur vos équipements.",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Delta Surveys sur WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-105"
    >
      <span className="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-[#25D366] opacity-30" />
      <MessageCircle className="relative h-6 w-6" />
      <span className="relative hidden text-sm font-semibold sm:block">
        Commander sur WhatsApp
      </span>
    </a>
  );
}
