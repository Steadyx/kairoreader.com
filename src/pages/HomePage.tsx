import { CoverageSection } from "../components/home/CoverageSection";
import { FaqSection } from "../components/home/FaqSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { FinalCtaSection } from "../components/home/FinalCtaSection";
import { FormatsSection } from "../components/home/FormatsSection";
import { GallerySection } from "../components/home/GallerySection";
import { HeroSection } from "../components/home/HeroSection";
import { OpenSourceSection } from "../components/home/OpenSourceSection";
import { PrivacySection } from "../components/home/PrivacySection";
import { ReadingExperienceSection } from "../components/home/ReadingExperienceSection";
import { TuningSection } from "../components/home/TuningSection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <ReadingExperienceSection />
      <FormatsSection />
      <TuningSection />
      <FeaturesSection />
      <GallerySection />
      <PrivacySection />
      <OpenSourceSection />
      <FaqSection />
      <CoverageSection />
      <FinalCtaSection />
    </main>
  );
}
