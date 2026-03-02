# Aurora Starter — Help Desk

Support tickets, customers, agents & knowledge base. Powered by [Aurora Studio](https://github.com/marceldupr/aurora-studio).

## Setup

1. Clone and install: `pnpm install`
2. Set env vars: `AURORA_API_URL`, `AURORA_API_KEY`, `NEXT_PUBLIC_TENANT_SLUG`
3. Run: `pnpm dev` (port 3004)
4. Schema provisions on first run via instrumentation

## Tables

- **customers** — name, email, phone, company
- **ticket_categories** — name, slug
- **agents** — name, email, status
- **tickets** — subject, status, priority, assigned agent
- **knowledge_base** — title, content, category, status

## Workflows

- `ticket.created` → notify agents
- `ticket.escalated` → alert
