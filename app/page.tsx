import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Ticket, Users, UserCheck, BookOpen, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const client = createAuroraClient();
  const [ticketsRes, customersRes, agentsRes, kbRes] = await Promise.all([
    client.tables("tickets").records.list({ limit: 100 }),
    client.tables("customers").records.list({ limit: 1 }),
    client.tables("agents").records.list({ limit: 1 }),
    client.tables("knowledge_base").records.list({ limit: 1 }),
  ]);

  const tickets = (ticketsRes as { data?: Record<string, unknown>[] }).data ?? [];
  const ticketsByStatus: Record<string, number> = {};
  for (const t of tickets) {
    const s = String(t.status ?? "new");
    ticketsByStatus[s] = (ticketsByStatus[s] ?? 0) + 1;
  }
  const openCount = ["new", "open", "pending"].reduce((sum, s) => sum + (ticketsByStatus[s] ?? 0), 0);

  return {
    ticketsCount: (ticketsRes as { total?: number }).total ?? tickets.length,
    openCount,
    customersCount: (customersRes as { total?: number }).total ?? 0,
    agentsCount: (agentsRes as { total?: number }).total ?? 0,
    kbCount: (kbRes as { total?: number }).total ?? 0,
    recentTickets: tickets.slice(0, 5),
  };
}

export default async function HomePage() {
  let data: Awaited<ReturnType<typeof getDashboardData>>;
  let error: string | null = null;

  try {
    data = await getDashboardData();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load dashboard";
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
          <p className="text-sm text-aurora-muted mt-2">
            Configure AURORA_API_URL and AURORA_API_KEY, then run pnpm schema:provision
          </p>
        </div>
      </div>
    );
  }

  const { ticketsCount, openCount, customersCount, agentsCount, kbCount, recentTickets } = data!;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 overflow-hidden min-h-[280px]">
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-surface/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(https://picsum.photos/seed/aurora-helpdesk-hero/1920/1080)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-2xl">
            Support Hub
          </h1>
          <p className="text-lg text-white/90 mb-6 drop-shadow max-w-2xl">
            Manage tickets, customers, and your knowledge base in one place.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Submit Ticket
          </Link>
        </div>
      </section>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Submit Ticket
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link
          href="/tickets"
          className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-aurora-muted text-sm">Open tickets</p>
              <p className="text-2xl font-bold">{openCount}</p>
              <p className="text-xs text-aurora-muted">{ticketsCount} total</p>
            </div>
            <Ticket className="w-10 h-10 text-aurora-accent/60" />
          </div>
        </Link>
        <Link
          href="/customers"
          className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-aurora-muted text-sm">Customers</p>
              <p className="text-2xl font-bold">{customersCount}</p>
            </div>
            <Users className="w-10 h-10 text-aurora-accent/60" />
          </div>
        </Link>
        <Link
          href="/agents"
          className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-aurora-muted text-sm">Agents</p>
              <p className="text-2xl font-bold">{agentsCount}</p>
            </div>
            <UserCheck className="w-10 h-10 text-aurora-accent/60" />
          </div>
        </Link>
        <Link
          href="/knowledge-base"
          className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-aurora-muted text-sm">KB articles</p>
              <p className="text-2xl font-bold">{kbCount}</p>
            </div>
            <BookOpen className="w-10 h-10 text-aurora-accent/60" />
          </div>
        </Link>
      </div>

      <div className="rounded-container bg-aurora-surface border border-aurora-border p-6">
        <h2 className="font-semibold mb-4">Recent tickets</h2>
        {recentTickets.length === 0 ? (
          <p className="text-aurora-muted text-sm">No tickets yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentTickets.map((t) => (
              <li key={String(t.id)}>
                <Link
                  href={`/tickets/${t.id}`}
                  className="flex items-center justify-between py-3 px-4 rounded-component bg-aurora-bg/50 border border-aurora-border hover:border-aurora-accent/40 transition-colors"
                >
                  <span className="font-medium truncate flex-1">{String(t.subject ?? "")}</span>
                  <span
                    className={`ml-4 px-2 py-1 rounded-component text-xs shrink-0 ${
                      String(t.priority ?? "") === "urgent"
                        ? "bg-red-500/20 text-red-400"
                        : String(t.priority ?? "") === "high"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-aurora-accent/20 text-aurora-accent"
                    }`}
                  >
                    {String(t.status ?? "new")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
}
