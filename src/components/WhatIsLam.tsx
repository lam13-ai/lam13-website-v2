import { Brain, Bot, BrainCircuit, Users, Plus, Minus } from "lucide-react";
const WhatIsLam = () => {
  return <section className="py-10 md:py-20 bg-background relative overflow-hidden">

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{
          animationDelay: "0.1s"
        }}>
            How we do it
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{
          animationDelay: "0.2s"
        }}>
            We follow our patented advanced agentic AI methodology in achieving results
          </p>
        </div>

        {/* Definition Card */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-16 animate-fade-in" style={{
        animationDelay: "0.3s"
      }}>
          
        </div>

        {/* Methodologies Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8 md:mb-16 animate-fade-in" style={{
          animationDelay: "0.4s"
        }}>
            <div className="flex-1 h-px bg-border" />
            <h3 className="text-xl md:text-2xl font-bold text-foreground text-center">
              Typical agentic AI methodologies
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Single Agent */}
            <div className="bg-secondary/30 rounded-2xl p-6 md:p-8 border border-border/50 animate-fade-in" style={{
            animationDelay: "0.5s"
          }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Single agent</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Standalone agent focusing on one task for one goal.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-foreground/80">
                  <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Excels in simple and repetitive tasks</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/80">
                  <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Operates in cost effective manner</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/80">
                  <Minus className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Limited by linear reasoning and cannot handle complex questions</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/80">
                  <Minus className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Limited to one task and cannot readjust for other tasks</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2 mt-14 lg:mt-0 bg-secondary/30 rounded-2xl p-4 md:p-6 border-2 border-border relative animate-fade-in" style={{
            animationDelay: "0.6s"
          }}>
              {/* Top border with centered text */}
              <div className="absolute -top-10 md:-top-7 left-0 right-0 flex items-center justify-center px-2 md:px-6">
                <div className="hidden md:block flex-1 h-0.5 bg-border" />
                <span className="px-2 md:px-6 text-base md:text-lg font-semibold text-accent text-center leading-tight">
                  Patented methodology maximizes the advantages of both
                </span>
                <div className="hidden md:block flex-1 h-0.5 bg-border" />
              </div>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 h-full pt-6 md:pt-4">
                {/* Multi-agent collaboration */}
                <div className="bg-background/50 rounded-xl p-5 md:p-6 border border-border/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Multi-agent collaboration</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Multiple single agents, each with their own specific task geared towards a goal, coordinating towards a bigger goal
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Handles complex workflows requiring multitude of tasks</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Maximizes expertise and performance per task</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <Minus className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Requires handholding in agent coordination and limits big picture reasoning</span>
                    </li>
                  </ul>
                </div>

                {/* Large Agentic Model (LAM) */}
                <div className="bg-background/50 rounded-xl p-5 md:p-6 border border-border/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <BrainCircuit className="w-5 h-5 text-accent" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Large Agentic Model (LAM)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Single model that turns powerful LLMs to goal-oriented agents capable of multi-step reasoning
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Delivers sophisticated big picture reasoning capabilities</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Takes decisions independently and operates at high levels of sophistication</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <Minus className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Limited by its ability to scale and cannot handle multiple tasks in parallel</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Insight */}
        <div className="max-w-3xl mx-auto mt-8 md:mt-16 text-center animate-fade-in" style={{
        animationDelay: "0.8s"
      }}>
          
        </div>
      </div>
    </section>;
};
export default WhatIsLam;