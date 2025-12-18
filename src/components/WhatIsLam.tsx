import { Brain, Bot, BrainCircuit, ArrowRight } from "lucide-react";

const WhatIsLam = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
            <span className="w-12 h-px bg-gradient-accent"></span>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Understanding LAM</span>
            <span className="w-12 h-px bg-gradient-accent"></span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            What is a Large Agentic Model?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Moving beyond simple automation to intelligent strategic partnership
          </p>
        </div>

        {/* Definition Card */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 md:p-10 border border-border/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">LAM: Large Agentic Model</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A <strong className="text-foreground">Large Agentic Model</strong> is an advanced AI system that combines the vast knowledge and reasoning capabilities of large language models with autonomous decision-making and goal-oriented behavior. Unlike traditional AI, LAMs can plan, execute, and adapt strategies across complex, multi-step processes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            LAM vs Traditional AI Agent
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Traditional Agent */}
            <div className="bg-secondary/30 rounded-2xl p-6 md:p-8 border border-border/50 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Traditional AI Agent</h4>
              </div>
              <ul className="space-y-4">
                {[
                  "Follows pre-defined rules and workflows",
                  "Executes specific, narrow tasks",
                  "Limited context understanding",
                  "Requires constant human oversight",
                  "Reactive to direct commands only"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* LAM */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-2xl p-6 md:p-8 border border-accent/30 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-accent" />
              </div>
                <h4 className="text-lg font-semibold text-foreground">Large Agentic Model (LAM)</h4>
              </div>
              <ul className="space-y-4">
                {[
                  "Reasons and adapts strategies dynamically",
                  "Handles complex, multi-domain challenges",
                  "Deep contextual and institutional awareness",
                  "Proactive problem-solving and planning",
                  "Autonomous execution with strategic oversight"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm md:text-base text-foreground/80">
                    <ArrowRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Insight */}
        <div className="max-w-3xl mx-auto mt-12 md:mt-16 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            <strong className="text-foreground">LAM13</strong> leverages this technology to deliver strategic consulting that evolves with your organization—not just answering questions, but actively helping shape policy, anticipate challenges, and drive transformation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatIsLam;
