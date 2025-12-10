import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background pt-32 pb-32">

      <div className="w-full px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge with enhanced glow */}
          

          {/* Main Headline with data stream effect */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1]">
            <span className="inline-block text-foreground animate-fade-in drop-shadow-lg" style={{
            animationDelay: '0.1s'
          }}>
              Strategy Consulting for
            </span>
            <br />
            <span className="inline-block text-gradient-accent animate-fade-in" style={{
            animationDelay: '0.2s'
          }}>
              Governments & Public Sector
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            Powered by <span className="font-bold text-muted-foreground">
              Large Agentic Models (LAMs)
            </span> that turn intent into decisive action.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
            <Link to="/try">
              <Button variant="hero" size="xl" className="group relative overflow-hidden shadow-[0_0_40px_rgba(24,209,255,0.4)] hover:shadow-[0_0_60px_rgba(24,209,255,0.6)] transition-all duration-500">
                <span className="relative z-10 flex items-center gap-2">
                  Try Us
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/20 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="group backdrop-blur-sm">
              Explore Our Approach
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

        </div>
      </div>
    </section>;
};
export default Hero;