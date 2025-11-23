import { LandingNavbar } from "@/components/shared/landing-navbar";
import { LandingFooter } from "@/components/shared/landing-footer";
import { HeroSection } from "@/components/shared/hero-section";
import { FeaturesSection } from "@/components/shared/features-section";
import { PricingSection } from "@/components/shared/pricing-section";
import { TestimonialsSection } from "@/components/shared/testimonials-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <LandingNavbar />
      <main className="flex-1 overflow-y-auto">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
