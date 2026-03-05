import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Users, Mail, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCustomers() {
  const client = createAuroraClient();
  const { data } = await client.tables("customers").records.list({
    limit: 50,
    sort: "name",
    order: "asc",
  });
  return data ?? [];
}

export default async function CustomersPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/customers`
      : null;

  let customers: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    customers = await getCustomers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load customers";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Customers</h1>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <Users className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No customers yet</p>
          <p className="text-sm text-aurora-muted">
            Customers are created when they submit tickets. Add manually in Aurora Studio.
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
          {customers.map((c) => (
            <div
              key={String(c.id)}
              className="rounded-container bg-aurora-surface border border-aurora-border p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-aurora-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-aurora-accent font-bold">
                    {String(c.name ?? "?")[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{String(c.name ?? "")}</p>
                  {c.company ? (
                    <p className="text-sm text-aurora-muted flex items-center gap-1.5 mt-1">
                      <Building2 className="w-4 h-4" />
                      {String(c.company)}
                    </p>
                  ) : null}
                  {c.email ? (
                    <a
                      href={`mailto:${String(c.email)}`}
                      className="text-sm text-aurora-accent hover:underline flex items-center gap-1.5 mt-1"
                    >
                      <Mail className="w-4 h-4" />
                      {String(c.email)}
                    </a>
                  ) : null}
                </div>
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
