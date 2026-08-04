import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function NouvelArticlePage() {
  return (
    <div className="text-white">
      <Link href="/admin/blog" className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Nouvel article</h1>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <BlogPostForm />
      </div>
    </div>
  );
}
