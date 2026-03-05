import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { BookOpen, Search } from "lucide-react";

export const dynamic = "force-dynamic";

async function getArticles() {
  const client = createAuroraClient();
  const { data } = await client.tables("knowledge_base").records.list({
    limit: 50,
    sort: "title",
  });
  return (data ?? []).filter((a) => String(a.status ?? "") === "published");
}

export default async function KnowledgeBasePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let articles: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    articles = await getArticles();
    if (q?.trim()) {
      const lower = q.toLowerCase();
      articles = articles.filter(
        (a) =>
          String(a.title ?? "").toLowerCase().includes(lower) ||
          String(a.content ?? "").toLowerCase().includes(lower)
      );
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load articles";
  }

  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/knowledge_base`
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Knowledge Base</h1>

      <form action="/knowledge-base" method="get" className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aurora-muted" />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search articles..."
            className="w-full pl-12 pr-4 py-3 rounded-component bg-aurora-surface border border-aurora-border text-white placeholder-aurora-muted outline-none focus:border-aurora-accent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-component bg-aurora-accent text-aurora-bg text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <BookOpen className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">
            {q ? "No articles match your search" : "No articles yet"}
          </p>
          <p className="text-sm text-aurora-muted">
            Add published articles in Aurora Studio.
          </p>
          {studioUrl && (
            <a
              href={studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
            >
              Add in Aurora Studio →
            </a>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={String(a.id)}>
              <Link
                href={`/knowledge-base/${a.id}`}
                className="flex items-center gap-3 py-4 px-5 rounded-container bg-aurora-surface border border-aurora-border hover:border-aurora-accent/40 transition-colors"
              >
                <BookOpen className="w-6 h-6 text-aurora-accent shrink-0" />
                <span className="font-medium">{String(a.title ?? "")}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {studioUrl && (
        <div className="mt-8">
          <a href={studioUrl} target="_blank" rel="noopener noreferrer" className="text-aurora-accent hover:underline text-sm">
            Manage in Aurora Studio →
          </a>
        </div>
      )}
    </div>
  );
}
