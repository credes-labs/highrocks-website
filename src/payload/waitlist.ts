import type { CollectionAfterChangeHook, CollectionConfig, PayloadHandler } from "payload";

const isEditor = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends the “you're on the list” email after a new sign-up. Never blocks or fails the sign-up. */
const sendConfirmation: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  if (operation !== "create" || !req.context.sendConfirmation) return doc;
  const first = escapeHtml(String(doc.name ?? "").split(/\s+/)[0] || "there");
  void req.payload
    .sendEmail({
      to: doc.email,
      subject: "You're on the HighRocks waitlist",
      text: `Hi ${first},\n\nThanks for joining the HighRocks waitlist. We'll email you as soon as your early-access spot opens.\n\nUntil then, our Hyrox guides are at ${SITE}/info-centre.\n\nThe HighRocks team\n\nDon't want these emails? Reply "unsubscribe" and we'll remove you.`,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1b1b1d;max-width:520px">
  <p>Hi ${first},</p>
  <p>Thanks for joining the <strong>HighRocks</strong> waitlist. We'll email you as soon as your early-access spot opens.</p>
  <p>Until then, our Hyrox pacing and station guides are in the <a href="${SITE}/info-centre">Info Centre</a>.</p>
  <p>The HighRocks team</p>
  <p style="font-size:12px;color:#6b7280">You're receiving this because you signed up at ${SITE.replace(/^https?:\/\//, "")}. Don't want these emails? Reply “unsubscribe” and we'll remove you. <a href="${SITE}/privacy">Privacy policy</a>.</p>
</div>`,
    })
    .catch((err: unknown) => req.payload.logger.error({ err }, "Waitlist confirmation email failed"));
  return doc;
};

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // Quote everything; neutralise leading characters spreadsheets treat as formulas
  // (but leave phone numbers like "+44 7700 900123" alone).
  const risky = /^[=+\-@\t\r]/.test(s) && !/^\+[\d\s().-]+$/.test(s);
  return `"${(risky ? `'${s}` : s).replace(/"/g, '""')}"`;
};

/** GET /api/waitlist-signups/export → CSV download of every sign-up (editors only). */
const exportCsv: PayloadHandler = async (req) => {
  if (!req.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { docs } = await req.payload.find({ collection: "waitlist-signups", limit: 0, sort: "-createdAt", depth: 0 });
  const cols = ["name", "email", "phone", "birthYear", "source", "status", "createdAt"] as const;
  const rows = [cols.join(","), ...docs.map((d) => cols.map((c) => csvCell(d[c])).join(","))];
  const date = new Date().toISOString().slice(0, 10);
  return new Response(rows.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="highrocks-waitlist-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
};

export const WaitlistSignups: CollectionConfig = {
  slug: "waitlist-signups",
  labels: { singular: "Waitlist sign-up", plural: "Waitlist" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "source", "status", "createdAt"],
    listSearchableFields: ["name", "email", "phone"],
    group: "Waitlist",
    description: "Everyone who joined the early-access waitlist. Use “Export CSV” to download the list.",
    components: { beforeListTable: ["/payload/admin/ExportWaitlistButton#ExportWaitlistButton"] },
  },
  defaultSort: "-createdAt",
  access: {
    // Sign-ups are created only by /api/waitlist (server side), never directly through the API.
    create: () => false,
    read: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  endpoints: [{ path: "/export", method: "get", handler: exportCsv }],
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "email", type: "email", required: true, unique: true, index: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text" },
        { name: "birthYear", label: "Birth year", type: "number", min: 1900, max: 2100 },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "waiting",
      options: [
        { label: "Waiting", value: "waiting" },
        { label: "Invited", value: "invited" },
        { label: "Joined", value: "joined" },
        { label: "Unsubscribed", value: "unsubscribed" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "source",
      type: "select",
      options: [
        { label: "Home page form", value: "home" },
        { label: "Join section (inner pages)", value: "join" },
      ],
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "consentAt",
      label: "Agreed to terms and privacy policy",
      type: "date",
      admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } },
    },
    { name: "notes", type: "textarea", admin: { description: "Internal notes; never shown to the person." } },
  ],
  hooks: { afterChange: [sendConfirmation] },
  timestamps: true,
};
