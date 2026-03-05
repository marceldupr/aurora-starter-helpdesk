import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Ticket } from "lucide-react";

export const dynamic = "force-dynamic";

async function getTickets() {
  const client = createAuroraClient();
  const { data } = await client.tables("tickets").records.list({
    limit: 50,
    sort: "created_at",
    order: "desc",
  });
  return data ?? [];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TicketsPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/tickets`
      : null;

  let tickets: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    tickets = await getTickets();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load tickets";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <Link
          href="/submit"
          className="px-4 py-2 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
        >
          Submit ticket
        </Link>
      </div>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <Ticket className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No tickets yet</p>
          <p className="text-sm text-aurora-muted mb-6">
            Submit a ticket or add tickets in Aurora Studio.
          </p>
          <Link
            href="/submit"
            className="inline-block px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
          >
            Submit ticket
          </Link>
        </div>
      ) : (
        <div className="rounded-container bg-aurora-surface border border-aurora-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-aurora-border">
                <th className="text-left py-4 px-4 font-semibold">Subject</th>
                <th className="text-left py-4 px-4 font-semibold">Status</th>
                <th className="text-left py-4 px-4 font-semibold">Priority</th>
                <th className="text-left py-4 px-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={String(t.id)} className="border-b border-aurora-border last:border-0 hover:bg-aurora-surface-hover">
                  <td className="py-4 px-4">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="font-medium hover:text-aurora-accent truncate block max-w-md"
                    >
                      {String(t.subject ?? "")}
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-component text-xs font-medium ${
                        String(t.status ?? "") === "closed" || String(t.status ?? "") === "resolved"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-aurora-accent/20 text-aurora-accent"
                      }`}
                    >
                      {String(t.status ?? "new")}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-component text-xs ${
                        String(t.priority ?? "") === "urgent"
                          ? "bg-red-500/20 text-red-400"
                          : String(t.priority ?? "") === "high"
                          ? "bg-amber-500/20 text-amber-400"
                          : "text-aurora-muted"
                      }`}
                    >
                      {String(t.priority ?? "—")}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-aurora-muted text-sm">
                    {t.created_at ? formatDate(String(t.created_at)) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {studioUrl && (
        <div className="mt-6">
          <a href={studioUrl} target="_blank" rel="noopener noreferrer" className="text-aurora-accent hover:underline text-sm">
            Manage in Aurora Studio →
          </a>
        </div>
      )}
    </div>
  );
}
