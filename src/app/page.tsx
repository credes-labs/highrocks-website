import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Pacing } from "@/components/sections/Pacing";
import { Waitlist } from "@/components/sections/Waitlist";
import { TrainCircle } from "@/components/sections/TrainCircle";
import { Features } from "@/components/sections/Features";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Pacing />
        <Waitlist />
        <TrainCircle />
        <Features />
        <Ecosystem />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
