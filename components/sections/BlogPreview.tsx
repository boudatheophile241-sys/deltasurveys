"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts as fallback, type BlogPost } from "@/lib/data";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/components/i18n/LocaleProvider";

export function BlogPreview({ items }: { items?: BlogPost[] }) {
  const { t } = useTranslation();
  const blogPosts = items && items.length > 0 ? items : fallback;
  return (
    <section className="bg-navy-50/50 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t("blog.eyebrow")}
            title={t("blog.title")}
            description={t("blog.desc")}
          />
          <Link
            href="/blog"
            className="btn h-11 shrink-0 border border-navy-200 bg-white px-5 text-sm text-navy-800 hover:bg-navy-50"
          >
            {t("blog.all")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative">
                  <ProductImage
                    image={post.cover}
                    icon={post.icon}
                    accent={i % 2 === 0 ? "navy" : "red"}
                    alt={post.title}
                    className="aspect-[16/9] w-full"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-800 backdrop-blur">
                    {post.category}
                  </span>
                </div>
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
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-navy-500">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red">
                    {t("blog.read")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
