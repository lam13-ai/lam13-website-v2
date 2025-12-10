import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Target, Lightbulb, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const About = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  
  useEffect(() => {
    const cards = cardRefs.current;
    if (cards.length === 0) return;

    const animateCards = () => {
      cards.forEach((card, index) => {
        if (!card) return;
        
        setTimeout(() => {
          card.classList.add('hover-active');
          setTimeout(() => {
            card.classList.remove('hover-active');
          }, 1000);
        }, index * 1500);
      });
    };

    // Start animation
    animateCards();
    // Repeat animation
    const interval = setInterval(animateCards, cards.length * 1500 + 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isQuoteVisible) {
            setIsQuoteVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (quoteRef.current) {
      observer.observe(quoteRef.current);
    }

    return () => observer.disconnect();
  }, [isQuoteVisible]);

  const approachSteps = [
    {
      number: "01",
      title: "Understand",
      description: "Deep immersion into your institutional context, challenges, and strategic imperatives.",
      icon: Brain
    },
    {
      number: "02",
      title: "Model",
      description: "LAM-powered analysis that simulates scenarios, tests strategies, and generates insights.",
      icon: Target
    },
    {
      number: "03",
      title: "Deliver",
      description: "Actionable strategies with clear implementation pathways and measurable outcomes.",
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        
        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center gap-6">

              {/* Main headline with gradient text */}
              <div className="animate-fade-in">
                <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                    About{" "}
                  </span>
                  <span className="bg-gradient-to-r from-accent via-teal to-primary bg-clip-text text-transparent">
                    LAM13
                  </span>
                </h1>
              </div>

              {/* Subheadline with gradient */}
              <p className="text-xl md:text-2xl font-light max-w-3xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                  Where artificial intelligence meets governmental excellence
                </span>
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-sm font-bold tracking-wider uppercase text-accent">Who We Are</span>
              <div className="h-px bg-gradient-to-r from-accent/60 via-accent/30 to-transparent mt-3 max-w-[120px]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent pb-2">
              AI-Native Strategy for the Public Sector
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              LAM13 is an AI-native strategy consultancy specializing in the public sector. 
              We harness the power of Large Agentic Models to transform how governments think, 
              plan, and execute. Where traditional consulting ends with reports, we begin with 
              intelligent action—turning complex policy challenges into clear strategic pathways.
            </p>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-teal/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-sm font-bold tracking-wider uppercase text-teal">Our Philosophy</span>
              <div className="h-px bg-gradient-to-r from-teal/60 via-teal/30 to-transparent mt-3 max-w-[120px]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-accent via-teal to-primary bg-clip-text text-transparent pb-2">
              Large Agentic Models
            </h2>
            
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-card via-card/80 to-teal/5 border border-teal/20 shadow-2xl">
              <div className="absolute top-0 left-0 w-32 h-32 bg-teal/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
              
              <blockquote 
                ref={quoteRef}
                className="relative z-10 text-2xl md:text-3xl font-semibold text-foreground leading-relaxed"
              >
                <span className={isQuoteVisible ? "animate-typewriter" : "opacity-0"}>
                  "LAMs understand human policy intentions and translate them into strategic actions."
                </span>
              </blockquote>
              
              <p className="mt-8 text-lg text-muted-foreground relative z-10">
                Unlike traditional AI that merely processes information, Large Agentic Models 
                comprehend context, anticipate consequences, and recommend decisive action. 
                They don't just analyze—they strategize.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Origin of the Name */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-sm font-bold tracking-wider uppercase text-teal">Origin Story</span>
              <div className="h-px bg-gradient-to-r from-teal/60 via-teal/30 to-transparent mt-3 max-w-[120px]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-teal/80 via-primary to-teal/80 bg-clip-text text-transparent pb-2">
              Why LAM13?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal via-accent to-teal opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative p-12 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-teal/20 text-center">
                  <div className="text-8xl font-bold bg-gradient-to-br from-teal via-accent to-teal bg-clip-text text-transparent mb-4">
                    لامع
                  </div>
                  <div className="text-2xl font-semibold text-teal mb-2">Lāmiʿ</div>
                  <div className="text-lg text-muted-foreground">Arabic</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <ArrowRight className="w-6 h-6 text-teal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Brilliant</h3>
                    <p className="text-muted-foreground">
                      The name LAM13 derives from <span className="text-teal font-semibold">Lāmiʿ (لامع)</span>,
                      meaning "brilliant" in Arabic. It represents our commitment to clarity, 
                      insight, and exceptional intelligence in governance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <ArrowRight className="w-6 h-6 text-teal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">13 Signals</h3>
                    <p className="text-muted-foreground">
                      The number 13 symbolizes the diverse signals and data streams that LAMs 
                      process to generate strategic brilliance—from policy documents to citizen 
                      feedback, economic indicators to global trends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-teal/5" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex flex-col items-center mb-8">
                <span className="text-sm font-bold tracking-wider uppercase text-teal">Our Approach</span>
                <div className="h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent mt-3 w-[120px]" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal via-accent to-primary bg-clip-text text-transparent pb-2">
                How We Work
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {approachSteps.map((step, index) => {
                return (
                  <div 
                    key={index}
                    ref={(el) => cardRefs.current[index] = el}
                    className="relative group transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 group-[.hover-active]:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 group-hover:border-teal/50 group-[.hover-active]:border-teal/50 transition-all duration-500 h-full">
                      <div className="text-6xl font-bold text-teal/20 mb-6">
                        {step.number}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-teal group-[.hover-active]:text-teal transition-colors duration-500">
                        {step.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    {index < approachSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                        <ArrowRight className="w-8 h-8 text-teal/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex flex-col items-center mb-8">
                <span className="text-sm font-bold tracking-wider uppercase text-accent">Our People</span>
                <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent mt-3 w-[120px]" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent via-teal to-primary bg-clip-text text-transparent pb-2">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
                A diverse group of strategists, technologists, and policy experts united by a vision of smarter governance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Dr. Sarah Chen",
                  role: "Chief Strategy Officer",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
                  description: "Leading our strategic vision with 15+ years of experience in public sector transformation and AI implementation.",
                  previousWork: ["McKinsey & Company", "World Bank", "MIT"],
                  strengths: ["Strategic Planning", "AI Policy", "Digital Transformation"]
                },
                {
                  name: "Marcus Thompson",
                  role: "Head of AI Research",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
                  description: "Pioneering our Large Agentic Models with expertise in machine learning and governmental applications.",
                  previousWork: ["Google DeepMind", "Stanford AI Lab", "DARPA"],
                  strengths: ["Machine Learning", "NLP", "Agent Architecture"]
                },
                {
                  name: "Amira Hassan",
                  role: "Director of Public Sector",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
                  description: "Bridging technology and governance with deep expertise in Middle Eastern and African public institutions.",
                  previousWork: ["UAE Government", "African Development Bank", "Deloitte"],
                  strengths: ["Government Relations", "Policy Design", "Regional Expertise"]
                },
                {
                  name: "James O'Connor",
                  role: "Chief Technology Officer",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
                  description: "Architecting our AI infrastructure with a focus on security, scalability, and governmental compliance.",
                  previousWork: ["Amazon Web Services", "Pentagon", "Palantir"],
                  strengths: ["Cloud Architecture", "Security", "Scalable Systems"]
                }
              ].map((member, index) => (
                <div 
                  key={index}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-teal/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 group-hover:border-accent/30 transition-all duration-500 h-full overflow-hidden">
                    {/* Photo */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-6">
                      {/* Name & Role */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                          {member.name}
                        </h3>
                        <span className="text-sm font-medium text-accent">{member.role}</span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {member.description}
                      </p>
                      
                      {/* Previous Work */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">Previously at</p>
                        <div className="flex flex-wrap gap-2">
                          {member.previousWork.map((work, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 text-xs rounded-md bg-secondary/50 text-foreground/70"
                            >
                              {work}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Strengths */}
                      <div>
                        <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">Strengths</p>
                        <div className="flex flex-wrap gap-2">
                          {member.strengths.map((strength, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 text-xs rounded-md bg-accent/10 text-accent border border-accent/20"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
