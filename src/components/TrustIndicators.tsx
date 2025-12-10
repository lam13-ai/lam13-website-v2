import { Award } from "lucide-react";
const TrustIndicators = () => {
  return <section className="pt-12 pb-24 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.02] animate-grid-flow">
        <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      </div>

      <div className="container mx-auto relative z-10 px-[20px]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
            <Award className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Trusted Partners
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-16 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            Working with Public-Sector Innovators
          </h2>

          {/* Enhanced logo grid with more logos */}
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <div key={i} className="group aspect-video rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm flex items-center justify-center hover:border-accent/60 hover:bg-card/80 hover:scale-110 hover:shadow-[0_0_40px_rgba(24,209,255,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in relative overflow-hidden" style={{
              animationDelay: `${i * 0.05 + 0.2}s`
            }}>
                  {/* Rotating gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <Award className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                    <span className="text-muted-foreground text-xs font-medium group-hover:text-accent transition-colors">
                      Partner {i}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default TrustIndicators;