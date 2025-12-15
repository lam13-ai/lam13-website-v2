import { Brain, Target, BarChart3, Zap, Shield } from "lucide-react";

const pillars = [
  {
    icon: Brain,
    title: "National AI Strategy Development",
    description: "Design comprehensive AI-driven national strategies aligned with policy goals and measurable outcomes."
  },
  {
    icon: Target,
    title: "AI-Driven Strategy Review & Stress Testing",
    description: "Evaluate and stress-test existing strategies using LAMs to identify gaps and optimize execution paths."
  },
  {
    icon: BarChart3,
    title: "KPI, Benchmark & Policy Framework Design",
    description: "Build robust frameworks for tracking performance, benchmarking progress, and ensuring strategic clarity."
  },
  {
    icon: Shield,
    title: "AI Governance & Risk Management",
    description: "Establish governance structures and risk frameworks to ensure responsible AI deployment across public institutions."
  }
];

const WhatWeDo = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden z-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <Zap className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Core Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Four pillars of AI-native strategic transformation
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 md:p-8 rounded-lg bg-card border border-border shadow-card hover:shadow-elevated hover:-translate-y-3 hover:scale-105 transition-all duration-500 animate-fade-in overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon with glow effect */}
                  <div className="relative w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300">
                    <Icon className="w-7 h-7 text-accent group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-accent/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors duration-300">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Animated accent border */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-accent group-hover:w-full transition-all duration-500 rounded-b-lg" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
