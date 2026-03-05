import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo Helpdesk";

export function Footer() {
  return (
    <footer className="border-t border-aurora-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-aurora-muted text-sm">{siteName} — Support & knowledge base</p>
          <div className="flex gap-6 text-sm text-aurora-muted">
            <Link href="/tickets" className="hover:text-white">Tickets</Link>
            <Link href="/knowledge-base" className="hover:text-white">Knowledge Base</Link>
            <Link href="/submit" className="hover:text-white">Submit Ticket</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
