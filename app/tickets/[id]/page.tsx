import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuroraClient } from "@/lib/aurora";
import { AssignAgentForm } from "./AssignAgentForm";

export const dynamic = "force-dynamic";

async function getTicketAndRelated(id: string) {
  const client = createAuroraClient();
  const [ticketRes, customersRes, agentsRes, categoriesRes] = await Promise.all([
    client.tables("tickets").records.get(id),
    client.tables("customers").records.list({ limit: 200 }),
    client.tables("agents").records.list({ limit: 50 }),
    client.tables("ticket_categories").records.list({ limit: 50 }),
  ]);

  const ticket = ticketRes as Record<string, unknown> | null;
  const customers = (customersRes as { data?: Record<string, unknown>[] }).data ?? [];
  const agents = (agentsRes as { data?: Record<string, unknown>[] }).data ?? [];
  const categories = (categoriesRes as { data?: Record<string, unknown>[] }).data ?? [];

  const customer = ticket?.customer_id
    ? customers.find((c) => String(c.id) === String(ticket.customer_id))
    : null;
  const agent = ticket?.agent_id
    ? agents.find((a) => String(a.id) === String(ticket.agent_id))
    : null;
  const category = ticket?.category_id
    ? categories.find((c) => String(c.id) === String(ticket.category_id))
    : null;

  return { ticket, customer, agent, agents, category };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB");
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let ticket: Record<string, unknown> | null = null;
  let customer: Record<string, unknown> | null | undefined;
  let agent: Record<string, unknown> | null | undefined;
  let agents: Record<string, unknown>[] = [];
  let category: Record<string, unknown> | null | undefined;

  try {
    const data = await getTicketAndRelated(id);
    ticket = data.ticket;
    customer = data.customer;
    agent = data.agent;
    agents = data.agents;
    category = data.category;
  } catch {
    notFound();
  }

  if (!ticket) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tickets" className="text-aurora-muted hover:text-white text-sm mb-6 inline-block">
        ← Back to tickets
      </Link>

      <div className="rounded-container bg-aurora-surface border border-aurora-border overflow-hidden">
        <div className="p-6 border-b border-aurora-border">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{String(ticket.subject ?? "")}</h1>
              {ticket.created_at ? (
                <p className="text-sm text-aurora-muted">
                  Created {formatDate(String(ticket.created_at))}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-component text-sm font-medium ${
                  String(ticket.status ?? "") === "closed" || String(ticket.status ?? "") === "resolved"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-aurora-accent/20 text-aurora-accent"
                }`}
              >
                {String(ticket.status ?? "new")}
              </span>
              <span
                className={`px-3 py-1 rounded-component text-sm ${
                  String(ticket.priority ?? "") === "urgent"
                    ? "bg-red-500/20 text-red-400"
                    : String(ticket.priority ?? "") === "high"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-aurora-surface-hover text-aurora-muted"
                }`}
              >
                {String(ticket.priority ?? "—")}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <h2 className="font-semibold mb-3">Description</h2>
            <div className="text-aurora-muted whitespace-pre-wrap">
              {String(ticket.description ?? "No description.")}
            </div>
          </div>
          <div className="space-y-4">
            {customer ? (
              <div>
                <h3 className="text-sm font-medium text-aurora-muted mb-1">Customer</h3>
                <p className="font-medium">{String(customer.name ?? "")}</p>
{customer.email ? (
                  <a href={`mailto:${String(customer.email)}`} className="text-aurora-accent text-sm hover:underline">
                    {String(customer.email)}
                  </a>
                ) : null}
            </div>
            ) : null}
            {category ? (
              <div>
                <h3 className="text-sm font-medium text-aurora-muted mb-1">Category</h3>
                <p>{String(category.name ?? "")}</p>
              </div>
            ) : null}
            <div>
              <h3 className="text-sm font-medium text-aurora-muted mb-2">Assigned agent</h3>
              <AssignAgentForm
                ticketId={id}
                currentAgentId={ticket.agent_id ? String(ticket.agent_id) : null}
                agents={agents}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
