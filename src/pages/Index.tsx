import HeroSection from "@/components/HeroSection";
import Calculator from "@/components/Calculator";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import SocialProof from "@/components/landing/SocialProof";
import LandingFAQ from "@/components/landing/LandingFAQ";
import Pricing from "@/components/landing/Pricing";
import SiteFooter from "@/components/landing/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HowItWorks />
      <Benefits />
      <Calculator />
      <SocialProof />
      <Pricing />
      <LandingFAQ />
      <SiteFooter />
    </div>
  );
};

export default Index;
