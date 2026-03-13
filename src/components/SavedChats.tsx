import { MessageSquare, Building2, Shield, Lightbulb, Network } from "lucide-react";

const savedChats = [
  {
    icon: Building2,
    title: "National AI Strategy",
    preview: "Developing a comprehensive AI roadmap for economic growth...",
    category: "Policy Design",
    messageCount: 24
  },
  {
    icon: Shield,
    title: "Defense Innovation Framework",
    preview: "Strategic intelligence framework for emerging threats...",
    category: "Security",
    messageCount: 18
  },
  {
    icon: Lightbulb,
    title: "R&D Optimization",
    preview: "Building innovation metrics and technology transfer...",
    category: "Innovation",
    messageCount: 31
  },
  {
    icon: Network,
    title: "Digital Transformation",
    preview: "Citizen experience optimization and service delivery...",
    category: "Government",
    messageCount: 42
  }
];

const SavedChats = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/30 animate-float"
            style={{
              left: `${(i * 8 + 5) % 95}%`,
              top: `${(i * 9 + 10) % 90}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <MessageSquare className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Use Cases</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Real Conversations, Real Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore saved AI conversations showcasing LAM13's strategic capabilities
            </p>
          </div>

          {/* Saved Chats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {savedChats.map((chat, index) => {
              const Icon = chat.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-xl bg-card border border-border hover:border-accent/50 shadow-card hover:shadow-elevated transition-all duration-500 cursor-pointer animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-accent/10 text-accent">
                          {chat.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {chat.messageCount} messages
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                        {chat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.preview}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="w-8 h-8 rounded-full bg-border/50 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
                      <svg className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-accent group-hover:w-full transition-all duration-500" />
                </div>
              );
            })}
          </div>

          {/* Coming soon note */}
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <p className="text-muted-foreground">
              <span className="text-accent font-semibold">More conversations coming soon</span> — Real-world strategic dialogues with our AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavedChats;
