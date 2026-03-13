import { Building2, Shield, Lightbulb, Network } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const useCases = [
  {
    icon: Building2,
    title: "National AI Strategies",
    description: "Design comprehensive AI roadmaps aligned with economic priorities, ethical frameworks, and regulatory requirements.",
    tags: ["Policy Design", "Regulatory Frameworks", "Implementation Planning"]
  },
  {
    icon: Shield,
    title: "Public Security & Defense",
    description: "Develop strategic intelligence frameworks, threat assessment models, and resilience protocols using advanced AI analysis.",
    tags: ["Threat Assessment", "Strategic Intelligence", "Crisis Management"]
  },
  {
    icon: Lightbulb,
    title: "Innovation Ecosystems",
    description: "Build national innovation strategies, R&D optimization frameworks, and technology transfer mechanisms.",
    tags: ["R&D Strategy", "Tech Transfer", "Innovation Metrics"]
  },
  {
    icon: Network,
    title: "Digital Government Transformation",
    description: "Architect end-to-end digital service delivery strategies, including infrastructure modernization and citizen experience optimization.",
    tags: ["Service Design", "Infrastructure", "Citizen Experience"]
  }
];

const UseCases = () => {
  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: true });
  
  return (
    <section className="relative py-20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/40 animate-float"
            style={{
              left: `${(i * 7 + 5) % 95}%`,
              top: `${(i * 11 + 10) % 90}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${6 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <span className="w-12 h-px bg-gradient-accent"></span>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Applications</span>
              <span className="w-12 h-px bg-gradient-accent"></span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Where We Apply LAMs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              From national security to digital transformation—AI-driven strategy for critical public-sector challenges
            </p>
          </div>

          {/* Use Cases Carousel */}
          <Carousel
            plugins={[autoplay]}
            className="w-full max-w-6xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {useCases.map((useCase, index) => {
                const Icon = useCase.icon;
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div
                      className="group relative p-8 rounded-2xl bg-background/80 backdrop-blur-sm border border-border hover:border-accent/50 transition-all duration-500 animate-fade-in overflow-hidden hover:shadow-elevated h-full"
                      style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-teal/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent/20 to-teal/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-500">
                          <Icon className="w-7 h-7 text-accent" strokeWidth={2} />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                          {useCase.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {useCase.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {useCase.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          {/* Additional info */}
          <div className="mt-12 p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-accent/20 relative overflow-hidden group animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Custom Strategic Solutions
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Every government faces unique challenges. Our LAMs adapt to your institutional context, regulatory environment, and strategic priorities—delivering bespoke frameworks that work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
