import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { getBlogPosts } from "@/lib/queries";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides d'achat, techniques de terrain et actualites de la topographie, de la geomatique et du génie civil.",
};

export default async function BlogPage() {
  const [blogPosts, t] = await Promise.all([getBlogPosts(), getT()]);
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHero
        eyebrow={t("blog.eyebrow")}
        title={t("blogPage.title")}
        description={t("blogPage.desc")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.blog") }]}
      />

      <section className="container-page py-16 sm:py-20">
        {/* Article a la une */}
        {featured && (
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-10 grid overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:shadow-card-hover lg:grid-cols-2"
            >
              <ProductImage
                image={featured.cover}
                icon={featured.icon}
                accent="navy"
                alt={featured.title}
                className="aspect-video w-full lg:aspect-auto lg:h-full"
                iconClassName="h-28 w-28"
              />
              <div className="flex flex-col justify-center p-8 lg:p-10">
                <div className="flex items-center gap-3 text-xs text-navy-400">
                  <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-brand-red">
                    {featured.category}
                  </span>
                  <span>{featured.date}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featured.readTime}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-navy-900 transition group-hover:text-brand-red sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-base text-navy-500">{featured.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1 font-semibold text-brand-red">
                  Lire l&apos;article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Autres articles */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <ProductImage
                  image={post.cover}
                  icon={post.icon}
                  accent={i % 2 === 0 ? "red" : "navy"}
                  alt={post.title}
                  className="aspect-[16/9] w-full"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs text-navy-400">
                    <span>{post.date}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy-900 transition group-hover:text-brand-red">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-500">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red">
                    Lire l&apos;article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
