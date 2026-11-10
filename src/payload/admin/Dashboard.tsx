import type { ServerProps } from "payload";

/** Top of the admin dashboard: what is live, the waitlist size and quick links. */
export async function DashboardIntro({ payload }: ServerProps) {
  const [waitlist, articles, drafts, faqs] = await Promise.all([
    payload.count({ collection: "waitlist-signups" }),
    payload.count({ collection: "articles", where: { _status: { equals: "published" } } }),
    payload.count({ collection: "articles", where: { _status: { equals: "draft" } } }),
    payload.count({ collection: "faqs" }),
  ]);
  const stats = [
    { label: "On the waitlist", value: waitlist.totalDocs, href: "/admin/collections/waitlist-signups" },
    { label: "Published articles", value: articles.totalDocs, href: "/admin/collections/articles" },
    { label: "Drafts", value: drafts.totalDocs, href: "/admin/collections/articles?where[_status][equals]=draft" },
    { label: "FAQs", value: faqs.totalDocs, href: "/admin/collections/faqs" },
  ];
  return (
    <div className="hr-dash">
      <div className="hr-dash__head">
        <div>
          <h2>HighRocks content</h2>
          <p>Edit FAQs, Info Centre articles and legal pages. Changes go live on the next page load.</p>
        </div>
        <div className="hr-dash__links">
          <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a file download, not a page */}
          <a href="/api/waitlist-signups/export">Export waitlist CSV</a>
        </div>
      </div>
      <ul className="hr-dash__stats">
        {stats.map((s) => (
          <li key={s.label}>
            <a href={s.href}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
