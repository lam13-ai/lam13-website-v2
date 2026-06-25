import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, ShieldCheck, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: BrainCircuit,
    title: "Patented Agentic AI",
    description: "A Large Agentic Model built for multi-step strategic reasoning",
  },
  {
    icon: Building2,
    title: "Public-Sector Focus",
    description: "Purpose-built for national strategies and government priorities",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description: "Strong focus on data security and data residency",
  },
];

const Hero = () => {
  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 pb-12 md:pt-16 md:pb-20">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.04] animate-grid-flow pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Soft gradient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-secondary/40 rounded-full blur-3xl opacity-60 animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-accent/10 rounded-full blur-3xl opacity-50 animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="w-full px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 leading-[1.1]">
            <span
              className="inline-block text-foreground animate-fade-in drop-shadow-lg"
              style={{ animationDelay: "0.1s" }}
            >
              AI Native Strategy Consulting
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed animate-fade-in px-2"
            style={{ animationDelay: "0.3s" }}
          >
            Disrupting strategy consulting through advanced agentic AI
          </p>

          {/* CTA Button */}
          <div
            className="flex flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in mb-16 md:mb-24"
            style={{ animationDelay: "0.4s" }}
          >
            <Link to="/auth">
              <Button
                variant="hero"
                size="xl"
                className="group relative overflow-hidden shadow-[0_0_40px_rgba(24,209,255,0.4)] hover:shadow-[0_0_60px_rgba(24,209,255,0.6)] transition-all duration-500"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/20 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group text-left p-5 md:p-6 rounded-xl bg-card/60 border border-border backdrop-blur-sm shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <div className="w-11 h-11 rounded-lg bg-secondary/60 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                    <Icon className="w-5 h-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
