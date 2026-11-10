import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** GET /preview/exit?path=/… — leaves draft mode and returns to the published page. */
export async function GET(request: Request) {
  const p = new URL(request.url).searchParams.get("path");
  (await draftMode()).disable();
  (await cookies()).delete("hr-preview");
  redirect(p && p.startsWith("/") && !p.startsWith("//") ? p : "/");
}
