import config from "@payload-config";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

/** Same-site paths only, so the preview link can't be used to bounce people elsewhere. */
const safePath = (p: string | null) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

/**
 * GET /preview?path=/articles/slug — used by the admin's Preview button.
 * Only signed-in editors can turn on draft mode, which makes the site show unpublished drafts.
 */
export async function GET(request: Request) {
  const path = safePath(new URL(request.url).searchParams.get("path"));
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response("Sign in to the HighRocks admin to preview drafts.", { status: 401 });

  (await draftMode()).enable();
  // Readable by the browser so the site can show the "Preview" bar (the draft-mode cookie is httpOnly).
  (await cookies()).set("hr-preview", "1", { path: "/", sameSite: "lax", httpOnly: false });
  redirect(path);
}
