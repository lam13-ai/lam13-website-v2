import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <span className="w-12 h-px bg-gradient-accent"></span>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Learn More</span>
              <span className="w-12 h-px bg-gradient-accent"></span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              See LAM13 in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Watch how our Large Agentic Models transform strategic planning
            </p>
          </div>

          {/* Video Placeholder */}
          <div 
            className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border overflow-hidden group cursor-pointer hover:border-accent/50 transition-all duration-500 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Placeholder background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/30 transition-all duration-500">
                <Play className="w-10 h-10 text-accent ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Coming soon badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <span className="px-4 py-2 text-sm font-semibold rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground border border-border whitespace-nowrap">
                Video Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
