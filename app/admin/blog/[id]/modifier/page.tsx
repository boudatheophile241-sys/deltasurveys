import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function ModifierArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,content,category,icon,cover_url,read_time,author,published")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <div className="text-white">
      <Link href="/admin/blog" className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Modifier : {post.title}</h1>
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <BlogPostForm post={post} />
      </div>
    </div>
  );
}
