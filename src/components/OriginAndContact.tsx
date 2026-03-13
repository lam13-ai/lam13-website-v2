import { ArrowRight, Mail, MessageCircle } from "lucide-react";

const OriginAndContact = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Origin Story - Left Side */}
            <div>
              <div className="mb-8">
                <span className="text-sm font-bold tracking-wider uppercase text-teal">Origin Story</span>
                <div className="h-px bg-gradient-to-r from-teal/60 via-teal/30 to-transparent mt-3 max-w-[120px]" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-teal/80 via-primary to-teal/80 bg-clip-text text-transparent pb-2">
                Why LAM13?
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="relative group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal via-accent to-teal opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-teal/20 text-center">
                    <div className="text-5xl font-bold bg-gradient-to-br from-teal via-accent to-teal bg-clip-text text-transparent mb-2 pb-2">
                      لامع
                    </div>
                    <div className="text-lg font-semibold text-teal mb-1">Lāmiʿ</div>
                    <div className="text-sm text-muted-foreground">Arabic</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-teal flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">Brilliant</h3>
                      <p className="text-sm text-muted-foreground">
                        From <span className="text-teal font-semibold">Lāmiʿ (لامع)</span>, meaning "brilliant" in Arabic—representing clarity and exceptional intelligence.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-teal flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">13 Signals</h3>
                      <p className="text-sm text-muted-foreground">
                        The diverse data streams that LAMs process to generate strategic brilliance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Us - Right Side */}
            <div>
              <div className="mb-8">
                <span className="text-sm font-bold tracking-wider uppercase text-accent">Get In Touch</span>
                <div className="h-px bg-gradient-to-r from-accent/60 via-accent/30 to-transparent mt-3 max-w-[120px]" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent pb-2">
                Contact Us
              </h2>
              
              <div className="space-y-4">
                {/* Email */}
                <a 
                  href="mailto:Joseph.boutros@lam13.ai"
                  className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-accent/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">Email Us</h3>
                    <p className="text-sm text-muted-foreground">Joseph.boutros@lam13.ai</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/971549988326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-teal/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 text-teal" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-teal transition-colors">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">+971 54 998 8326</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginAndContact;
