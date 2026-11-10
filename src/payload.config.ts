import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import { resendAdapter } from "@payloadcms/email-resend";
import sharp from "sharp";
import { Articles, FaqCategories, Faqs, InfoCentre, LegalPages, Media, Users } from "./payload/collections";
import { WaitlistSignups } from "./payload/waitlist";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    theme: "dark",
    meta: {
      titleSuffix: " | HighRocks CMS",
      description: "HighRocks content and waitlist admin",
      icons: [{ rel: "icon", type: "image/svg+xml", url: "/icon.svg" }],
    },
    components: {
      graphics: { Logo: "/payload/admin/Brand#Logo", Icon: "/payload/admin/Brand#Icon" },
      beforeDashboard: ["/payload/admin/Dashboard#DashboardIntro"],
    },
  },
  collections: [WaitlistSignups, Articles, Media, Faqs, FaqCategories, LegalPages, Users],
  globals: [InfoCentre],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // SQLite file locally; set DATABASE_URL to a libSQL/Turso URL (+ DATABASE_AUTH_TOKEN) in production.
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./highrocks.db",
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    // Schema changes always go through migrations (npm run migrate:create after editing a collection),
    // so local and production databases stay identical. npm run setup applies them.
    push: false,
    prodMigrations: migrations,
  }),
  sharp,
  // Real email (waitlist confirmations, admin password resets) once Resend is configured;
  // otherwise Payload prints emails to the server console.
  email:
    process.env.RESEND_API_KEY && process.env.EMAIL_FROM_ADDRESS
      ? resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: process.env.EMAIL_FROM_ADDRESS,
          defaultFromName: process.env.EMAIL_FROM_NAME || "HighRocks",
        })
      : undefined,
  graphQL: { disable: true },
});
