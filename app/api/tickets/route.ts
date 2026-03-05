import { NextResponse } from "next/server";
import { createAuroraClient } from "@/lib/aurora";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      subject?: string;
      description?: string;
      customer_name?: string;
      customer_email?: string;
      category_id?: string;
      priority?: string;
    };
    const { subject, description, customer_name, customer_email, category_id, priority } = body;

    if (!subject?.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    const client = createAuroraClient();

    let customerId: string | null = null;
    if (customer_email?.trim()) {
      const { data: customers } = await client.tables("customers").records.list({
        limit: 10,
      });
      const existing = (customers ?? []).find(
        (c) => String(c.email ?? "").toLowerCase() === customer_email.trim().toLowerCase()
      );
      if (existing) {
        customerId = String(existing.id);
      } else {
        const newCustomer = await client.tables("customers").records.create({
          name: customer_name?.trim() || customer_email.trim(),
          email: customer_email.trim(),
        });
        customerId = String(newCustomer.id);
      }
    }

    const record = await client.tables("tickets").records.create({
      subject: subject.trim(),
      description: description?.trim() || null,
      customer_id: customerId,
      category_id: category_id || null,
      priority: priority || "medium",
      status: "new",
    });

    return NextResponse.json(record);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create ticket";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
