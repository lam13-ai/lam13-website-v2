import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const Hero = () => {
  return <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 pb-6 md:pt-16 md:pb-8">

      <div className="w-full px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          {/* Badge with enhanced glow */}
          

          {/* Main Headline with data stream effect */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 leading-[1.1]">
            <span className="inline-block text-foreground animate-fade-in drop-shadow-lg" style={{
            animationDelay: '0.1s'
          }}>AI Native Strategy Consulting</span>
            <br />
            
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed animate-fade-in px-2" style={{
          animationDelay: '0.3s'
        }}>Disrupting strategy consulting through advanced agentic AI
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group relative overflow-hidden shadow-[0_0_40px_rgba(24,209,255,0.4)] hover:shadow-[0_0_60px_rgba(24,209,255,0.6)] transition-all duration-500">
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/20 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </Link>
            <Link to="/try">
              <Button variant="heroOutline" size="xl" className="group relative overflow-hidden transition-all duration-500">
                <span className="relative z-10">Test Try</span>
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>;
};
export default Hero;