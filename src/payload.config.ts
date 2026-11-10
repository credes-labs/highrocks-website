import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Articles, FaqCategories, Faqs, InfoCentre, Media, Users } from "./payload/collections";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " | HighRocks CMS" },
  },
  collections: [Articles, Media, Faqs, FaqCategories, Users],
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
  graphQL: { disable: true },
});
