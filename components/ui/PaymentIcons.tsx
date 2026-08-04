import { cn } from "@/lib/utils";

/**
 * Badges visuels des moyens de paiement (représentations stylisées, sans
 * reproduction de logos protégés). Purement décoratifs pour le moment ;
 * l'intégration réelle des API viendra plus tard.
 */

type Method = {
  name: string;
  label: string;
  bg: string;
  fg: string;
  soon?: boolean;
};

const methods: Method[] = [
  { name: "Orange Money", label: "Orange Money", bg: "#FF7900", fg: "#ffffff" },
  { name: "Moov Money", label: "Moov Money", bg: "#0a4ea2", fg: "#ffffff" },
  { name: "Coris Money", label: "Coris Money", bg: "#e2001a", fg: "#ffffff" },
  { name: "Wave", label: "Wave", bg: "#1a96f0", fg: "#ffffff" },
  { name: "Visa", label: "VISA", bg: "#1a1f71", fg: "#ffffff", soon: true },
  { name: "Mastercard", label: "Mastercard", bg: "#111827", fg: "#ffffff", soon: true },
  { name: "PayPal", label: "PayPal", bg: "#003087", fg: "#ffffff", soon: true },
  { name: "Stripe", label: "Stripe", bg: "#635bff", fg: "#ffffff", soon: true },
];

function MastercardMark() {
  return (
    <span className="relative inline-flex h-4 w-6 items-center">
      <span className="absolute left-0 h-4 w-4 rounded-full" style={{ background: "#eb001b" }} />
      <span className="absolute right-0 h-4 w-4 rounded-full" style={{ background: "#f79e1b", mixBlendMode: "multiply" }} />
    </span>
  );
}

export function PaymentIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {methods.map((m) => (
        <span
          key={m.name}
          title={m.soon ? `${m.name} — bientôt disponible` : m.name}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold tracking-wide shadow-sm"
          style={{ background: m.bg, color: m.fg }}
        >
          {m.name === "Mastercard" ? <MastercardMark /> : null}
          <span className={m.name === "Visa" ? "italic" : ""}>{m.label}</span>
        </span>
      ))}
    </div>
  );
}
