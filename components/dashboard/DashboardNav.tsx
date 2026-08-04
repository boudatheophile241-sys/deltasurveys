"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Heart,
  Download,
  User,
  MapPin,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import type { DictKey } from "@/lib/i18n/dictionaries";

const links: { href: string; key: DictKey; icon: typeof Package; exact?: boolean }[] = [
  { href: "/compte", key: "dash.dashboard", icon: LayoutDashboard, exact: true },
  { href: "/compte/commandes", key: "dash.orders", icon: Package },
  { href: "/compte/devis", key: "dash.quotes", icon: FileText },
  { href: "/compte/favoris", key: "dash.favorites", icon: Heart },
  { href: "/compte/telechargements", key: "dash.downloads", icon: Download },
  { href: "/compte/profil", key: "dash.profile", icon: User },
  { href: "/compte/adresses", key: "dash.addresses", icon: MapPin },
  { href: "/compte/notifications", key: "dash.notifications", icon: Bell },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
              active
                ? "bg-navy-900 text-white shadow-sm"
                : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
            )}
          >
            <l.icon className="h-4.5 w-4.5" />
            <span className="whitespace-nowrap">{t(l.key)}</span>
          </Link>
        );
      })}
      <form action={logout} className="mt-1 lg:mt-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-brand-red transition hover:bg-rose-50">
          <LogOut className="h-4.5 w-4.5" />
          <span className="whitespace-nowrap">{t("dash.logout")}</span>
        </button>
      </form>
    </nav>
  );
}
