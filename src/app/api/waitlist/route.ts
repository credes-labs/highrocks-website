import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  dob?: unknown;
  birthYear?: unknown;
};

/**
 * Waitlist sign-up endpoint. It validates the payload and acknowledges it.
 * TODO: persist the entry (database, Resend/Mailchimp, Google Sheet, …) before launch.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const birthYear = typeof body.birthYear === "string" ? body.birthYear.trim() : "";
  if (birthYear && !/^(19|20)\d{2}$/.test(birthYear)) {
    return NextResponse.json({ error: "Please enter a valid birth year." }, { status: 422 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
