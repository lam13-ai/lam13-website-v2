import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import VideoSection from "@/components/VideoSection";
import SavedChats from "@/components/SavedChats";
import TrustIndicators from "@/components/TrustIndicators";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhatWeDo />
      <VideoSection />
      <SavedChats />
      <TrustIndicators />
      <Footer />
    </div>
  );
};

export default Index;
