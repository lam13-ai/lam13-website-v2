import { Brain, Target, Zap, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "Ingest Policy Intent",
    description: "LAMs analyze strategic objectives, stakeholder priorities, and institutional constraints to understand the full context.",
    color: "accent"
  },
  {
    icon: Target,
    title: "Generate Strategic Pathways",
    description: "AI models map multiple execution routes, identifying trade-offs, dependencies, and optimal resource allocation.",
    color: "teal"
  },
  {
    icon: Zap,
    title: "Stress Test & Refine",
    description: "Simulate scenarios, benchmark against global standards, and iterate strategies for resilience and impact.",
    color: "accent"
  },
  {
    icon: BarChart3,
    title: "Deploy & Monitor",
    description: "Implement KPI frameworks with real-time tracking, enabling adaptive governance and continuous improvement.",
    color: "teal"
  }
];

const HowItWorks = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-background via-secondary/10 to-background overflow-hidden z-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-24 bg-gradient-to-b from-transparent via-accent to-transparent animate-float"
            style={{
              left: `${(i * 18 + 10) % 90}%`,
              top: `${(i * 25 + 5) % 80}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <div className="w-8 h-0.5 bg-gradient-accent"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">The Process</span>
              <div className="w-8 h-0.5 bg-gradient-accent"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              How LAMs Transform Strategy
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              From policy intent to measurable outcomes—powered by AI that understands governance complexity
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-secondary/30 via-secondary/10 to-background border border-border/50 hover:border-accent/40 transition-all duration-500 animate-fade-in overflow-hidden backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  {/* Background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-6xl font-bold text-accent/10 group-hover:text-accent/20 transition-colors duration-500">
                    {index + 1}
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-accent/30">
                      <Icon className="w-8 h-8 text-accent" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting line (except for last items) */}
                  {index < steps.length - 2 && index % 2 === 0 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <p className="text-lg text-muted-foreground">
              Ready to transform your strategic planning?{" "}
              <span className="text-accent font-semibold hover:underline cursor-pointer transition-all">
                Let's talk →
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
