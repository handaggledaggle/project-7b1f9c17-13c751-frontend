import HomeNavbar from "@/app/_components/home/home-navbar";
import HeroSection from "@/app/_components/home/hero-section";
import FeaturesSection from "@/app/_components/home/features-section";
import PrimaryStatsSection from "@/app/_components/home/primary-stats-section";
import SecondaryStatsSection from "@/app/_components/home/secondary-stats-section";
import TestimonialsSection from "@/app/_components/home/testimonials-section";
import CtaSection from "@/app/_components/home/cta-section";
import HomeFooter from "@/app/_components/home/home-footer";

export default function HomePage() {
  return (
    <div className="w-full flex justify-center bg-white">
      <div className="w-[1440px] flex flex-col">
        <HomeNavbar />
        <HeroSection />
        <FeaturesSection />
        <PrimaryStatsSection />
        <SecondaryStatsSection />
        <TestimonialsSection />
        <CtaSection />
        <HomeFooter />
      </div>
    </div>
  );
}
