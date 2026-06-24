import { LandingHeader } from "@/components/landing/LandingHeader";
import { Hero } from "@/components/landing/Hero";
import { Reassurance } from "@/components/landing/Reassurance";
import { Usages } from "@/components/landing/Usages";
import { Process } from "@/components/landing/Process";
import { Fleet } from "@/components/landing/Fleet";
import { Reviews } from "@/components/landing/Reviews";
import { Faq } from "@/components/landing/Faq";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth bg-white">
      <LandingHeader />
      <Hero />
      <Reassurance />
      <Usages />
      <Process />
      <Fleet />
      <Reviews />
      <Faq />
      <LandingFooter />
    </main>
  );
}
