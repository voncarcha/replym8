import { LandingNavbar } from "@/components/shared/landing-navbar";
import { LandingFooter } from "@/components/shared/landing-footer";
import { HeroSection } from "@/components/shared/hero-section";
import { FeaturesSection } from "@/components/shared/features-section";
import { LandingGenerator } from "@/components/shared/landing-generator";
import { PricingSection } from "@/components/shared/pricing-section";
import { TestimonialsSection } from "@/components/shared/testimonials-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LandingNavbar />
      <main className="flex-1 overflow-y-auto">
        <HeroSection />
        <FeaturesSection />
        <LandingGenerator />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
