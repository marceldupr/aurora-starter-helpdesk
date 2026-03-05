import { createAuroraClient } from "@/lib/aurora";
import { UserCheck, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAgents() {
  const client = createAuroraClient();
  const { data } = await client.tables("agents").records.list({
    limit: 50,
    sort: "name",
  });
  return data ?? [];
}

export default async function AgentsPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/agents`
      : null;

  let agents: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    agents = await getAgents();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load agents";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Agents</h1>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <UserCheck className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No agents yet</p>
          <p className="text-sm text-aurora-muted">
            Add support agents in Aurora Studio.
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => (
            <div
              key={String(a.id)}
              className="rounded-container bg-aurora-surface border border-aurora-border p-5 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-aurora-accent/20 flex items-center justify-center shrink-0">
                <UserCheck className="w-7 h-7 text-aurora-accent" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{String(a.name ?? "")}</p>
                {a.email ? (
                  <a
                    href={`mailto:${String(a.email)}`}
                    className="text-sm text-aurora-accent hover:underline flex items-center gap-2 mt-1"
                  >
                    <Mail className="w-4 h-4" />
                    {String(a.email)}
                  </a>
                ) : null}
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                    String(a.status ?? "") === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-aurora-muted/20 text-aurora-muted"
                  }`}
                >
                  {String(a.status ?? "—")}
                </span>
              </div>
            </div>
          ))}
        </div>
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
