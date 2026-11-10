import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = Partial<Record<"name" | "email" | "phone" | "birthYear" | "source" | "website" | "cf-turnstile-response", unknown>>;

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (error: string, status = 422) => NextResponse.json({ error }, { status });

/*
 * Simple per-IP rate limit: 5 sign-ups per 10 minutes. It lives in memory, so on serverless
 * hosts it only limits bursts hitting the same instance; Turnstile (below) is the real guard.
 */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
  return recent.length > LIMIT;
}

/** Cloudflare Turnstile check; skipped when TURNSTILE_SECRET_KEY is not set. */
async function humanCheck(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  }).catch(() => null);
  const json = (await res?.json().catch(() => null)) as { success?: boolean } | null;
  return Boolean(json?.success);
}

/** Waitlist sign-up: validates, filters bots, and stores the entry in the CMS (Waitlist collection). */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return fail("Invalid request.", 400);
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return fail("Too many attempts. Please try again in a few minutes.", 429);

  // Honeypot: a hidden field people never see. Bots that fill it get a fake success.
  if (str(body.website)) return NextResponse.json({ ok: true }, { status: 201 });

  const name = str(body.name, 120);
  const email = str(body.email, 254).toLowerCase();
  const phone = str(body.phone, 40);
  const birthYear = str(body.birthYear, 4);

  if (name.length < 2) return fail("Please enter your name.");
  if (!EMAIL.test(email)) return fail("Please enter a valid email address.");
  if (phone && !/^[+\d][\d\s().-]{5,}$/.test(phone)) return fail("Please enter a valid phone number.");
  if (birthYear && !/^(19|20)\d{2}$/.test(birthYear)) return fail("Please enter a valid birth year.");
  if (!(await humanCheck(str(body["cf-turnstile-response"], 4096), ip))) {
    return fail("We couldn't confirm you're human. Please try again.", 400);
  }

  try {
    const payload = await getPayload({ config });
    const existing = await payload.count({ collection: "waitlist-signups", where: { email: { equals: email } } });
    // Already signed up: answer the same way, so the form never reveals who is on the list.
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: "waitlist-signups",
        overrideAccess: true,
        data: {
          name,
          email,
          phone: phone || undefined,
          birthYear: birthYear ? Number(birthYear) : undefined,
          source: body.source === "join" ? "join" : "home",
          consentAt: new Date().toISOString(),
          status: "waiting",
        },
        context: { sendConfirmation: true },
      });
    }
  } catch (err) {
    console.error("Waitlist sign-up failed", err);
    return fail("Something went wrong on our side. Please try again.", 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
