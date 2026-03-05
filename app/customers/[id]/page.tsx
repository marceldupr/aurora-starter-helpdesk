import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuroraClient } from "@/lib/aurora";
import { Mail, Phone, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCustomer(id: string) {
  const client = createAuroraClient();
  const record = await client.tables("customers").records.get(id);
  return record as Record<string, unknown> | null;
}

async function getCustomerTickets(customerId: string) {
  const client = createAuroraClient();
  const { data } = await client.tables("tickets").records.list({
    limit: 10,
    sort: "created_at",
    order: "desc",
  });
  return (data ?? []).filter((t) => String(t.customer_id) === String(customerId));
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let customer: Record<string, unknown> | null = null;
  let tickets: Record<string, unknown>[] = [];

  try {
    customer = await getCustomer(id);
    if (customer) {
      tickets = await getCustomerTickets(id);
    }
  } catch {
    notFound();
  }

  if (!customer) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/customers" className="text-aurora-muted hover:text-white text-sm mb-6 inline-block">
        ← Back to customers
      </Link>

      <div className="rounded-container bg-aurora-surface border border-aurora-border overflow-hidden">
        <div className="p-6 border-b border-aurora-border">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-aurora-accent/20 flex items-center justify-center shrink-0">
              <span className="text-2xl text-aurora-accent font-bold">
                {String(customer.name ?? "?")[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{String(customer.name ?? "")}</h1>
              {customer.company ? (
                <p className="text-aurora-muted flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4" />
                  {String(customer.company)}
                </p>
              ) : null}
              {customer.email ? (
                <a
                  href={`mailto:${String(customer.email)}`}
                  className="text-aurora-accent hover:underline flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {String(customer.email)}
                </a>
              ) : null}
              {customer.phone ? (
                <a
                  href={`tel:${String(customer.phone)}`}
                  className="text-aurora-muted hover:text-white flex items-center gap-2 mt-1"
                >
                  <Phone className="w-4 h-4" />
                  {String(customer.phone)}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-semibold mb-4">Tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-aurora-muted text-sm">No tickets yet.</p>
          ) : (
            <ul className="space-y-2">
              {tickets.map((t) => (
                <li key={String(t.id)}>
                  <Link
                    href={`/tickets/${t.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-component bg-aurora-bg/50 border border-aurora-border hover:border-aurora-accent/40 transition-colors"
                  >
                    <span className="font-medium truncate">{String(t.subject ?? "")}</span>
                    <span
                      className={`ml-4 px-2 py-1 rounded-component text-xs shrink-0 ${
                        String(t.status ?? "") === "closed" || String(t.status ?? "") === "resolved"
                          ? "bg-green-500/20 text-green-400"
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
