/**
 * One-off setup run before `next dev` and `next build` (npm run setup):
 * applies pending database migrations, then seeds the starting content into an empty database.
 * Running it once up front avoids every build worker migrating the same database at the same time.
 */
import { getPayload, type Migration } from "payload";
import config from "../payload.config";
import { migrations } from "../migrations";
import { seed } from "./seed";

const payload = await getPayload({ config });
// Generated migrations are typed against the SQLite adapter; the generic signature takes them as is.
await payload.db.migrate({ migrations: migrations as unknown as Migration[] });
if (process.env.PAYLOAD_SEED !== "false") await seed(payload);
process.exit(0);
