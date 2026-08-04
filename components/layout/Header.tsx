"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  UserPlus,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { mainNav } from "@/lib/data";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { useCart } from "@/lib/cart/CartContext";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { DictKey } from "@/lib/i18n/dictionaries";

const NAV_KEYS: Record<string, DictKey> = {
  "/": "nav.home",
  "/produits": "nav.products",
  "/services": "nav.services",
  "/solutions": "nav.solutions",
  "/a-propos": "nav.about",
  "/blog": "nav.blog",
  "/carrieres": "nav.careers",
  "/contact": "nav.contact",
};

type AuthUser = { name: string; role: string } | null;

export function Header({ user, logoSrc }: { user?: AuthUser; logoSrc?: string }) {
  const { count } = useCart();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-navy-100 bg-white/90 shadow-soft backdrop-blur-xl"
          : "bg-white",
      )}
    >
      <div className="container-page">
        <div className="flex h-20 items-center gap-4">
          <Logo src={logoSrc} />

          {/* Barre de recherche centrale */}
          <form
            action="/produits"
            className="relative ml-2 hidden flex-1 items-center lg:flex"
            role="search"
          >
            <Search className="pointer-events-none absolute left-4 h-4.5 w-4.5 text-navy-400" />
            <input
              type="search"
              name="q"
              placeholder={t("header.search")}
              className="h-11 w-full rounded-full border border-navy-100 bg-navy-50/60 pl-11 pr-4 text-sm text-navy-800 outline-none transition focus:border-navy-300 focus:bg-white focus:ring-4 focus:ring-navy-100"
            />
          </form>

          {/* Actions droite */}
          <div className="ml-auto flex items-center gap-1">
            {user ? (
              <div
                className="relative hidden xl:block"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button className="flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-3 py-2 text-sm font-medium text-navy-800 transition hover:bg-navy-100">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[8rem] truncate">{user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full z-50 w-56 pt-2">
                    <div className="animate-fade-up overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-card">
                      <Link href="/compte" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-navy-800 transition hover:bg-navy-50">
                        <LayoutDashboard className="h-4 w-4 text-navy-500" /> {t("header.dashboard")}
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-navy-800 transition hover:bg-navy-50">
                          <ShieldCheck className="h-4 w-4 text-brand-red" /> {t("header.admin")}
                        </Link>
                      )}
                      <form action={logout}>
                        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-navy-800 transition hover:bg-navy-50">
                          <LogOut className="h-4 w-4 text-navy-500" /> {t("header.logout")}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 xl:flex"
                >
                  <User className="h-4.5 w-4.5" />
                  {t("header.login")}
                </Link>
                <Link
                  href="/inscription"
                  className="hidden items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800 xl:flex"
                >
                  <UserPlus className="h-4 w-4" />
                  {t("header.register")}
                </Link>
              </>
            )}

            <div className="mx-1 hidden h-6 w-px bg-navy-100 xl:block" />

            <IconAction href="/favoris" label="Favoris">
              <Heart className="h-5 w-5" />
            </IconAction>
            <IconAction href="/panier" label="Panier" badge={count}>
              <ShoppingBag className="h-5 w-5" />
            </IconAction>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-navy-800 transition hover:bg-navy-50 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Navigation principale (desktop) */}
        <nav className="hidden h-12 items-center gap-1 border-t border-navy-100/70 lg:flex">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition",
                    active
                      ? "text-brand-red"
                      : "text-navy-700 hover:text-navy-900",
                  )}
                >
                  {NAV_KEYS[item.href] ? t(NAV_KEYS[item.href]) : item.label}
                  {item.children && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  )}
                </Link>

                {item.children && openDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 w-72 pt-2">
                    <div className="animate-fade-up overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-card">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block rounded-xl px-3 py-2.5 transition hover:bg-navy-50"
                        >
                          <span className="block text-sm font-semibold text-navy-800">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs text-navy-400">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="border-t border-navy-100 bg-white lg:hidden">
          <div className="container-page space-y-4 py-5">
            <form action="/produits" className="relative flex items-center" role="search">
              <Search className="pointer-events-none absolute left-4 h-4.5 w-4.5 text-navy-400" />
              <input
                type="search"
                name="q"
                placeholder="Rechercher..."
                className="h-11 w-full rounded-full border border-navy-100 bg-navy-50/60 pl-11 pr-4 text-sm outline-none focus:border-navy-300 focus:bg-white"
              />
            </form>

            <nav className="flex flex-col">
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="border-b border-navy-50 py-3 text-[15px] font-medium text-navy-800"
                >
                  {NAV_KEYS[item.href] ? t(NAV_KEYS[item.href]) : item.label}
                </Link>
              ))}
            </nav>

            <LanguageSwitcher className="w-fit" />

            {user ? (
              <div className="space-y-2 pt-1">
                <Link
                  href="/compte"
                  className="flex items-center justify-center gap-2 rounded-full bg-navy-900 py-2.5 text-sm font-semibold text-white"
                >
                  <LayoutDashboard className="h-4 w-4" /> {t("header.dashboard")}
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 rounded-full border border-navy-200 py-2.5 text-sm font-semibold text-navy-800"
                  >
                    <ShieldCheck className="h-4 w-4 text-brand-red" /> {t("header.admin")}
                  </Link>
                )}
                <form action={logout}>
                  <button className="flex w-full items-center justify-center gap-2 rounded-full border border-navy-200 py-2.5 text-sm font-semibold text-navy-800">
                    <LogOut className="h-4 w-4" /> {t("header.logout")}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-3 pt-1">
                <Link
                  href="/connexion"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-navy-200 py-2.5 text-sm font-semibold text-navy-800"
                >
                  <User className="h-4 w-4" /> {t("header.login")}
                </Link>
                <Link
                  href="/inscription"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-navy-900 py-2.5 text-sm font-semibold text-white"
                >
                  <UserPlus className="h-4 w-4" /> {t("header.register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function IconAction({
  href,
  label,
  badge,
  children,
}: {
  href: string;
  label: string;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-full text-navy-800 transition hover:bg-navy-50"
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
