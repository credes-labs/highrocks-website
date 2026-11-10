import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { LegalArticle } from "@/components/LegalArticle";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalPage } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How HighRocks collects, uses and protects your personal data on the website and the early-access waitlist.",
  path: "/privacy",
});

export default async function Page() {
  const page = await getLegalPage("privacy");
  if (!page) notFound();
  return (
    <>
      <Navbar />
      <main>
        <LegalArticle page={page} />
      </main>
      <Footer />
      <JsonLd data={[breadcrumbLd([{ name: page.title, path: "/privacy" }])]} />
    </>
  );
}
