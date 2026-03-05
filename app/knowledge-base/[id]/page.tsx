import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuroraClient } from "@/lib/aurora";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

async function getArticle(id: string) {
  const client = createAuroraClient();
  try {
    const record = await client.tables("knowledge_base").records.get(id);
    return record as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article || String(article.status ?? "") !== "published") notFound();

  const title = String(article.title ?? "");
  const content = String(article.content ?? "");

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/knowledge-base" className="text-aurora-muted hover:text-white text-sm mb-8 inline-flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Back to Knowledge Base
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
      </header>

      <div
        className="prose prose-invert prose-lg max-w-none
          prose-p:text-aurora-muted prose-p:leading-relaxed
          prose-headings:text-white prose-a:text-aurora-accent"
        dangerouslySetInnerHTML={{ __html: content || "<p>No content.</p>" }}
      />
    </article>
  );
}
