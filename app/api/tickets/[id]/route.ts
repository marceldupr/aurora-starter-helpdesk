import { NextResponse } from "next/server";
import { createAuroraClient } from "@/lib/aurora";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { agent_id?: string | null; status?: string };
    const client = createAuroraClient();

    const updates: Record<string, unknown> = {};
    if (body.agent_id !== undefined) updates.agent_id = body.agent_id;
    if (body.status !== undefined) updates.status = body.status;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const record = await client.tables("tickets").records.update(id, updates);
    return NextResponse.json(record);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
