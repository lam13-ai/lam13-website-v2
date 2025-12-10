import { Check, Cpu } from "lucide-react";

const highlights = [
  {
    title: "AI-native from the ground up",
    description: "Built on Large Agentic Models designed specifically for strategic decision-making"
  },
  {
    title: "Uses LAMs tailored for public-sector complexity",
    description: "Deep understanding of governmental structures, policy frameworks, and institutional dynamics"
  },
  {
    title: "Precision, speed, and high-level governance insight",
    description: "Accelerate strategy development while maintaining the rigor and depth public institutions demand"
  }
];

const WhyLam13 = () => {
  return (
    <section className="min-h-screen py-24 bg-gradient-to-br from-primary via-primary to-primary/95 relative overflow-hidden">
      {/* Animated geometric accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.07] animate-grid-flow">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent/30 animate-float"
            style={{
              left: `${(i * 15 + 10) % 90}%`,
              top: `${(i * 23 + 15) % 85}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${6 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <Cpu className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Our Advantage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Why Lam13
            </h2>
            <p className="text-lg text-white/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              AI-powered strategic transformation with institutional precision
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-6 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm hover:border-accent/70 hover:bg-white/15 hover:-translate-x-2 transition-all duration-500 animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mt-1 group-hover:bg-accent/30 group-hover:scale-110 transition-all duration-300">
                  <Check className="w-5 h-5 text-accent" strokeWidth={3} />
                  <div className="absolute inset-0 bg-accent/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Context with enhanced styling */}
          <div className="mt-12 p-8 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden group hover:border-accent/40 transition-all duration-500 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/10 to-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-center text-white leading-relaxed relative z-10 text-lg">
              <span className="font-bold text-accent text-xl">Lāmiʿ (لامع)</span> means <em className="text-accent font-semibold">brilliant</em> in Arabic—reflecting our commitment to clarity, insight, and forward-thinking design in modern governance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyLam13;
