# Aurora Starter — Help Desk

Support tickets, customers, agents & knowledge base. Powered by [Aurora Studio](https://github.com/marceldupr/aurora-studio).

## Features

- **Dashboard** — Open ticket count, recent tickets, quick links
- **Tickets** — List with status/priority, ticket detail with agent assignment
- **Submit ticket** — Public form (creates customer if new email)
- **Customers** — Contact cards
- **Agents** — Support team list
- **Knowledge Base** — Searchable articles
- **Holmes** — AI-ready (script included when configured)

## Setup

1. Clone and install: `pnpm install`
2. Copy `.env.example` to `.env.local`
3. Set `AURORA_API_URL`, `AURORA_API_KEY`, `NEXT_PUBLIC_TENANT_SLUG`
4. Provision schema: `pnpm schema:provision`
5. (Optional) Seed: `pnpm seed`
6. Run: `pnpm dev`

## Tables

- **customers** — name, email, phone, company
- **ticket_categories** — name, slug
- **agents** — name, email, status (active/away)
- **tickets** — subject, description, customer, category, agent, status, priority
- **knowledge_base** — title, content, category, status

## Workflows

- `ticket.created` → notify agents
- `ticket.escalated` → alert admins
