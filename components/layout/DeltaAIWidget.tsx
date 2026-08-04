"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";
import { DeltaAIChat } from "@/components/sections/DeltaAIChat";

export function DeltaAIWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Panneau */}
      {open && (
        <div className="fixed bottom-24 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm animate-fade-up sm:left-6">
          <div className="relative h-[32rem] max-h-[70vh]">
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="absolute -top-3 -right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-navy-900 text-white shadow-lg transition hover:bg-navy-800"
            >
              <X className="h-4 w-4" />
            </button>
            <DeltaAIChat />
          </div>
        </div>
      )}

      {/* Lanceur */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir l'assistant Delta AI"
        className="group fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-full bg-gradient-to-r from-navy-900 to-navy-700 py-3 pl-3 pr-4 text-white shadow-[0_10px_30px_-8px_rgba(15,31,69,0.6)] transition-transform hover:scale-105"
    >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/15">
          {!open && (
            <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-white/20" />
          )}
          <Bot className="relative h-5 w-5" />
        </span>
        <span className="relative hidden text-sm font-semibold sm:block">Delta AI</span>
      </button>
    </>
  );
}
