import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import WhatIsLam from "@/components/WhatIsLam";
import VideoSection from "@/components/VideoSection";
import SavedChats from "@/components/SavedChats";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "AI Native Strategy Consulting | Lam13.ai";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Disrupting strategy consulting through advanced agentic AI. AI native strategy consulting services across the public sector.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <WhatWeDo />
        <WhatIsLam />
        <TeamSection />
        {/* Hidden sections - uncomment to show */}
        {/* <VideoSection /> */}
        {/* <SavedChats /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
