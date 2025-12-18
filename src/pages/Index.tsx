import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import WhatIsLam from "@/components/WhatIsLam";
import VideoSection from "@/components/VideoSection";
import SavedChats from "@/components/SavedChats";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhatWeDo />
      <WhatIsLam />
      <VideoSection />
      <SavedChats />
      <Footer />
    </div>
  );
};

export default Index;
