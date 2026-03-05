#!/usr/bin/env node
/**
 * Seed script for aurora-starter-helpdesk.
 * Run after schema provisioning.
 *
 * Usage: AURORA_API_URL=... AURORA_API_KEY=... node scripts/seed.mjs
 */

const apiUrl = process.env.AURORA_API_URL || process.env.NEXT_PUBLIC_AURORA_API_URL;
const apiKey = process.env.AURORA_API_KEY;

if (!apiUrl || !apiKey) {
  console.error("Set AURORA_API_URL and AURORA_API_KEY");
  process.exit(1);
}

const base = apiUrl.replace(/\/$/, "");

async function createRecord(table, data) {
  const res = await fetch(`${base}/v1/tables/${table}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`${table} create failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function seed() {
  console.log("Seeding aurora-starter-helpdesk...");

  // 1. Ticket categories
  const categories = [
    { name: "Billing", slug: "billing" },
    { name: "Technical", slug: "technical" },
    { name: "General", slug: "general" },
  ];
  const createdCats = [];
  for (const c of categories) {
    const rec = await createRecord("ticket_categories", c);
    createdCats.push(rec);
    console.log("  Created category:", c.name);
  }

  // 2. Agents
  const agents = [
    { name: "Sarah Support", email: "sarah@support.example.com", status: "active" },
    { name: "Mike Helpdesk", email: "mike@support.example.com", status: "active" },
  ];
  const createdAgents = [];
  for (const a of agents) {
    const rec = await createRecord("agents", a);
    createdAgents.push(rec);
    console.log("  Created agent:", a.name);
  }

  // 3. Customers
  const customers = [
    { name: "Acme Corp", email: "support@acme.com", company: "Acme Corp" },
    { name: "Jane Doe", email: "jane@example.com", phone: "+44 20 7123 4567" },
  ];
  const createdCustomers = [];
  for (const c of customers) {
    const rec = await createRecord("customers", c);
    createdCustomers.push(rec);
    console.log("  Created customer:", c.name);
  }

  // 4. Tickets
  const tickets = [
    { subject: "Billing inquiry for invoice #1234", description: "I have a question about my last invoice.", customer_id: createdCustomers[0].id, category_id: createdCats[0].id, agent_id: createdAgents[0].id, status: "open", priority: "medium" },
    { subject: "Login not working", description: "Getting 500 error when trying to log in.", customer_id: createdCustomers[1].id, category_id: createdCats[1].id, status: "new", priority: "high" },
  ];
  for (const t of tickets) {
    await createRecord("tickets", t);
    console.log("  Created ticket:", t.subject);
  }

  // 5. Knowledge base articles
  const articles = [
    { title: "Getting Started", content: "<p>Welcome to our support centre. Here you can find answers to common questions and submit tickets for assistance.</p><p>To get started, browse our articles or submit a ticket if you can't find what you need.</p>", category_id: createdCats[2].id, status: "published" },
    { title: "Billing FAQs", content: "<p><strong>How do I update my payment method?</strong></p><p>Go to Settings → Billing to update your card details.</p><p><strong>When are invoices issued?</strong></p><p>Invoices are generated at the start of each billing cycle.</p>", category_id: createdCats[0].id, status: "published" },
  ];
  for (const a of articles) {
    await createRecord("knowledge_base", a);
    console.log("  Created article:", a.title);
  }

  console.log("Seed complete.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
