import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { CTASection } from "@/components/sections/CTASection";
import { getBlogPostBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <article className="container-page max-w-3xl py-12 sm:py-16">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 transition hover:text-brand-red"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au blog
        </Link>

        <div className="flex items-center gap-3 text-xs text-navy-400">
          <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-brand-red">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readTime}
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-navy-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-navy-500">{post.excerpt}</p>

        <ProductImage
          image={post.cover}
          icon={post.icon}
          accent="navy"
          alt={post.title}
          className="mt-8 aspect-[16/9] w-full rounded-3xl"
          iconClassName="h-28 w-28"
        />

        {post.content ? (
          <div className="mt-8 space-y-5 text-base leading-relaxed text-navy-700">
            {post.content.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-5 text-base leading-relaxed text-navy-700">
            <p>
              Le choix d&apos;un équipement de topographie est une décision
              stratégique qui influence directement la qualité et la rentabilité de
              vos projets. Dans cet article, l&apos;équipe Delta Surveys partage son
              expertise terrain pour vous aider a faire le bon investissement.
            </p>
            <p>
              Besoin d&apos;un conseil personnalisé ? Notre équipe et notre assistant
              Delta AI sont à votre disposition pour vous orienter vers la solution
              la plus adaptée.
            </p>
          </div>
        )}
      </article>

      <CTASection />
    </>
  );
}
