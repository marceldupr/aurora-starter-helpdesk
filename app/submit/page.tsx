"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubmitTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Subject is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          description: description.trim() || undefined,
          customer_name: name.trim() || undefined,
          customer_email: email.trim() || undefined,
          priority: "medium",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Failed to submit");
      }
      const data = (await res.json()) as { id?: string };
      router.push(`/tickets/${data.id ?? ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="text-aurora-muted hover:text-white text-sm mb-6 inline-block">
        ← Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-2">Submit a ticket</h1>
      <p className="text-aurora-muted mb-8">
        Describe your issue and we will get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="rounded-container bg-aurora-surface border border-aurora-border p-6 space-y-5">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject *</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-component bg-aurora-bg border border-aurora-border text-white placeholder-aurora-muted outline-none focus:border-aurora-accent"
            placeholder="Brief summary of your issue"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-component bg-aurora-bg border border-aurora-border text-white placeholder-aurora-muted outline-none focus:border-aurora-accent"
            placeholder="Detailed description of your issue..."
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Your name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-component bg-aurora-bg border border-aurora-border text-white placeholder-aurora-muted outline-none focus:border-aurora-accent"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-component bg-aurora-bg border border-aurora-border text-white placeholder-aurora-muted outline-none focus:border-aurora-accent"
              placeholder="jane@example.com"
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit ticket"}
        </button>
      </form>
    </div>
  );
}
