import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { LegalArticle } from "@/components/LegalArticle";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalPage } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms for using the HighRocks website and joining the early-access waitlist.",
  path: "/terms",
});

export default async function Page() {
  const page = await getLegalPage("terms");
  if (!page) notFound();
  return (
    <>
      <Navbar />
      <main>
        <LegalArticle page={page} />
      </main>
      <Footer />
      <JsonLd data={[breadcrumbLd([{ name: page.title, path: "/terms" }])]} />
    </>
  );
}
