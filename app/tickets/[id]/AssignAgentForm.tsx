"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AssignAgentForm({
  ticketId,
  currentAgentId,
  agents,
}: {
  ticketId: string;
  currentAgentId: string | null;
  agents: Record<string, unknown>[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentAgent = currentAgentId
    ? agents.find((a) => String(a.id) === currentAgentId)
    : null;

  const handleAssign = async (agentId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId || null }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (agents.length === 0) {
    return <p className="text-aurora-muted text-sm">No agents yet.</p>;
  }

  return (
    <div className="space-y-2">
      {currentAgent ? (
        <p className="font-medium">{String(currentAgent.name ?? "")}</p>
      ) : (
        <p className="text-aurora-muted text-sm">Unassigned</p>
      )}
      <select
        className="w-full px-3 py-2 rounded-component bg-aurora-bg border border-aurora-border text-sm"
        value={currentAgentId ?? ""}
        onChange={(e) => handleAssign(e.target.value)}
        disabled={loading}
      >
        <option value="">Unassigned</option>
        {agents.map((a) => (
          <option key={String(a.id)} value={String(a.id)}>
            {String(a.name ?? "")}
          </option>
        ))}
      </select>
    </div>
  );
}
