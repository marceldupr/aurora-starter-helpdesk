import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo Helpdesk";

export function Footer() {
  return (
    <footer className="border-t border-aurora-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="text-lg font-semibold mb-2">{siteName}</p>
            <p className="text-aurora-muted text-sm">
              Support tickets, knowledge base, and customer help.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-aurora-muted">
              <li><Link href="/tickets" className="hover:text-white">Tickets</Link></li>
              <li><Link href="/submit" className="hover:text-white">Submit Ticket</Link></li>
              <li><Link href="/knowledge-base" className="hover:text-white">Knowledge Base</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-aurora-muted">
              <li><Link href="/" className="hover:text-white">About</Link></li>
              <li><Link href="/" className="hover:text-white">Privacy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
