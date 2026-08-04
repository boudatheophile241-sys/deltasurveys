"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, Send } from "lucide-react";
import {
  products as fallbackProducts,
  aiSuggestions,
  type Product,
} from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import { formatCFA } from "@/lib/utils";

type Message = {
  role: "user" | "ai";
  text: string;
  recommendations?: Product[];
};

/**
 * Assistant conversationnel local (style conseiller commercial).
 * Comprend salutations, remerciements, budget, livraison/garantie et besoins
 * produits. À remplacer par un vrai LLM (API Claude) pour des réponses encore
 * plus riches — la structure est déjà prête pour ça.
 */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type Intent = {
  category: string;
  keywords: string[];
  intro: string[];
};

const INTENTS: Intent[] = [
  {
    category: "gps-gnss",
    keywords: ["gps", "gnss", "rtk", "recepteur", "centimetr", "geodesie", "base", "rover"],
    intro: [
      "Pour du GPS GNSS, tout dépend de la précision et de l'autonomie recherchées.",
      "Excellent choix : un récepteur GNSS RTK vous donnera une précision centimétrique sur le terrain.",
    ],
  },
  {
    category: "drones",
    keywords: ["drone", "cartographie", "aerien", "photogramm", "orthophoto", "volume", "carriere"],
    intro: [
      "Pour la cartographie aérienne, un drone RTK change vraiment la donne sur les grandes surfaces.",
      "Très bon usage : la photogrammétrie par drone est idéale pour les levés rapides et le calcul de volumes.",
    ],
  },
  {
    category: "stations-totales",
    keywords: ["station", "totale", "implantation", "angulaire", "topographe", "borne", "polygonation"],
    intro: [
      "Pour l'implantation et les levés de précision, la station totale reste l'outil de référence.",
      "Selon vos chantiers, je vous oriente vers une station manuelle ou robotisée (levé en une personne).",
    ],
  },
  {
    category: "niveaux-automatiques",
    keywords: ["niveau", "nivellement", "altimetr", "denivele", "chantier"],
    intro: [
      "Pour du nivellement fiable et économique, un niveau automatique est parfait.",
      "Robuste et simple à prendre en main : le niveau automatique est un incontournable de chantier.",
    ],
  },
  {
    category: "laser",
    keywords: ["laser", "rotatif", "ligne", "aplomb"],
    intro: [
      "Pour le chantier, un laser rotatif auto-nivelant vous fera gagner un temps précieux.",
    ],
  },
];

export type AiReply = { text: string; recommendations: Product[]; note?: string };

function recommend(query: string, products: Product[]): AiReply {
  const q = norm(query);
  const has = (...ws: string[]) => ws.some((w) => q.includes(w));

  // Salutations
  if (has("bonjour", "bonsoir", "salut", "hello", "coucou", "hey") && q.length < 25) {
    return {
      text: pick([
        "Bonjour et bienvenue chez Delta Surveys ! Je suis là pour vous aider à choisir le bon équipement. Vous cherchez plutôt du matériel de topographie, un drone, ou autre chose ?",
        "Bonjour ! Ravi de vous accueillir. Dites-moi votre besoin (levé, implantation, cartographie, nivellement...) et je vous conseille l'équipement idéal.",
      ]),
      recommendations: [],
    };
  }

  // Remerciements
  if (has("merci", "thanks", "parfait", "super", "genial", "top")) {
    return {
      text: "Avec plaisir ! Si vous le souhaitez, je peux vous préparer un devis personnalisé ou vous mettre en relation avec un conseiller sur WhatsApp. 😊",
      recommendations: [],
    };
  }

  // Livraison / garantie / SAV
  if (has("livraison", "livrer", "delai", "expedition")) {
    return {
      text: "Nous livrons Ouagadougou en 48h et partout en Afrique de l'Ouest sous ~10 jours. Chaque équipement est garanti (jusqu'à 2 ans constructeur) avec service après-vente. Un produit en particulier vous intéresse ?",
      recommendations: [],
    };
  }
  if (has("garantie", "sav", "reparation", "panne", "maintenance")) {
    return {
      text: "Tous nos équipements sont couverts par la garantie constructeur (jusqu'à 2 ans), et notre atelier assure calibration, réparation et maintenance. Souhaitez-vous que je vous montre nos produits phares ?",
      recommendations: products.slice(0, 2),
    };
  }

  // Budget / prix
  const budgetMatch = q.match(/(\d[\d\s.]{4,})/);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/[\s.]/g, "")) : null;
  if (budget && budget > 10000) {
    const affordable = products
      .filter((p) => p.price <= budget)
      .sort((a, b) => b.price - a.price)
      .slice(0, 2);
    if (affordable.length) {
      return {
        text: `Avec un budget d'environ ${formatCFA(budget)}, voici ce que je vous recommande — le meilleur rapport qualité/prix dans cette gamme. Je peux affiner selon votre usage exact.`,
        recommendations: affordable,
      };
    }
    return {
      text: `Pour ce budget, nos modèles d'entrée de gamme restent au-dessus. Je vous montre nos options les plus accessibles, et on peut envisager un devis adapté ou un financement.`,
      recommendations: [...products].sort((a, b) => a.price - b.price).slice(0, 2),
    };
  }
  if (has("prix", "cout", "combien", "tarif", "budget", "pas cher", "moins cher", "abordable")) {
    const cheapest = [...products].sort((a, b) => a.price - b.price).slice(0, 2);
    return {
      text: "Nos prix varient selon la précision et la marque. Dites-moi votre budget approximatif et votre usage, et je vous propose le meilleur choix. Voici déjà nos options les plus accessibles :",
      recommendations: cheapest,
    };
  }

  // Meilleur / conseil / recommandation
  if (has("meilleur", "conseil", "recommand", "populaire", "top vente", "fiable")) {
    const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 2);
    return {
      text: "Voici nos instruments les plus plébiscités par les professionnels — fiables et parfaitement adaptés au terrain africain. Pour un conseil sur-mesure, précisez votre métier (géomètre, BTP, mines...).",
      recommendations: topRated,
    };
  }

  // Intentions produit
  const intent = INTENTS.find((i) => has(...i.keywords));
  if (intent) {
    const recs = products.filter((p) => p.category === intent.category).slice(0, 2);
    return {
      text: `${pick(intent.intro)} Voici ce que je vous recommande dans notre catalogue. Souhaitez-vous un devis ou en discuter avec un conseiller ?`,
      recommendations: recs.length ? recs : products.slice(0, 2),
    };
  }

  // Repli conversationnel
  return {
    text: pick([
      "Je note votre besoin. Pour vous orienter précisément, dites-moi l'usage prévu (levé, implantation, cartographie, nivellement) ou votre secteur. En attendant, voici deux équipements très demandés :",
      "Bonne question ! Précisez votre application ou votre budget et je vous propose la solution idéale. Voici déjà nos best-sellers :",
    ]),
    recommendations: products.slice(0, 2),
  };
}

export function DeltaAIChat({
  products: productsProp,
  className = "",
}: {
  products?: Product[];
  className?: string;
}) {
  const [products, setProducts] = useState<Product[]>(
    productsProp && productsProp.length ? productsProp : fallbackProducts,
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Bonjour ! Je suis Delta AI, votre assistant intelligent. Quel équipement recherchez-vous ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Charge le catalogue depuis Supabase si non fourni (widget flottant).
  useEffect(() => {
    if (productsProp && productsProp.length) return;
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("id,slug,name,price,icon,short_description,categories(slug)");
        if (!active || !data) return;
        const rows = data as unknown as Array<{
          id: string;
          slug: string;
          name: string;
          price: number;
          icon: string | null;
          short_description: string | null;
          categories: { slug: string } | null;
        }>;
        const mapped = rows.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          brand: "",
          category: p.categories?.slug ?? "",
          price: Number(p.price),
          rating: 0,
          reviews: 0,
          inStock: true,
          warranty: "",
          delivery: "",
          badges: [],
          icon: p.icon ?? "Package",
          accent: "navy" as const,
          shortDescription: p.short_description ?? "",
          specs: [],
        }));
        if (mapped.length) setProducts(mapped);
      } catch {
        /* garde le fallback */
      }
    })();
    return () => {
      active = false;
    };
  }, [productsProp]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const { text: reply, recommendations } = recommend(text, products);
      setMessages((m) => [...m, { role: "ai", text: reply, recommendations }]);
      setTyping(false);
    }, 650);
  };

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card ${className}`}>
      {/* En-tete */}
      <div className="flex items-center gap-3 border-b border-navy-100 bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-white">Delta AI</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Assistant en ligne
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-navy-50/40 p-5">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className="max-w-[85%] space-y-2">
              <div
                className={
                  m.role === "user"
                    ? "rounded-2xl rounded-br-sm bg-navy-900 px-4 py-2.5 text-sm text-white"
                    : "rounded-2xl rounded-bl-sm border border-navy-100 bg-white px-4 py-2.5 text-sm text-navy-700 shadow-sm"
                }
              >
                {m.text}
              </div>
              {m.recommendations && (
                <div className="space-y-2">
                  {m.recommendations.map((p) => (
                    <Link
                      key={p.id}
                      href={`/produits/${p.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-2.5 transition hover:border-brand-red/40 hover:shadow-sm"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                        <Icon name={p.icon} className="h-6 w-6" strokeWidth={1.5} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-navy-900">{p.name}</span>
                        <span className="block text-xs text-brand-red">{formatCFA(p.price)}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-navy-100 bg-white px-4 py-3 shadow-sm">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 border-t border-navy-100 bg-white px-5 pt-4">
        {aiSuggestions.slice(0, 2).map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1.5 text-left text-xs text-navy-600 transition hover:border-brand-red/40 hover:text-brand-red"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Saisie */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 bg-white p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez-moi une question..."
          className="h-11 flex-1 rounded-full border border-navy-100 bg-navy-50/60 px-4 text-sm outline-none focus:border-navy-300 focus:bg-white"
        />
        <button
          type="submit"
          aria-label="Envoyer"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-red text-white transition hover:bg-brand-red-dark"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}
