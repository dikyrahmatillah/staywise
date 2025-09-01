import HeroSection from "@/components/home/hero-section";
import PopularDestinations from "@/components/home/popular-destinations";
import FeaturedProperties from "@/components/home/featured-properties";
import WhyChooseUs from "@/components/home/why-choose-us";
import PropertyTypes from "@/components/home/property-types";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturedProperties />
      <WhyChooseUs />
      <PropertyTypes />
      <PopularDestinations />
    </main>
  );
}
