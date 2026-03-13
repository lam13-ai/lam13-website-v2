import { ArrowRight, Mail, MessageCircle } from "lucide-react";
const Footer = () => {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        {/* Why LAM13 and Contact Us Section */}
        <div className="py-16 border-b border-primary-foreground/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Origin Story - Left Side */}
              <div>
                
                
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary-foreground">
                  Did you Know?
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent to-accent opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity duration-500" />
                      <div className="relative p-6 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 text-center h-full lg:h-[184px] flex flex-col justify-center">
                        <div className="text-5xl font-bold text-primary-foreground mb-2 pb-2">
                          لامع
                        </div>
                        <div className="text-lg font-semibold text-primary-foreground mb-1">Lāmiʿ</div>
                        <div className="text-sm text-primary-foreground/70">Arabic</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary-foreground flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-primary-foreground mb-1">Brilliant</h3>
                        <p className="text-sm text-primary-foreground/70">
                          From <span className="text-primary-foreground font-semibold">Lāmiʿ (لامع)</span>, meaning "brilliant" in Arabic, representing clarity and exceptional intelligence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-primary-foreground/60 mt-3 italic text-center md:text-left">
                  *Patent pending for agentic AI methodology
                </p>
              </div>

              {/* Contact Us - Right Side */}
              <div>
                
                
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary-foreground">
                  Contact Us
                </h2>
                
                <div className="space-y-4">
                  {/* Email */}
                  <a href="mailto:Joseph.boutros@lam13.ai" className="group flex items-center gap-4 p-5 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-foreground group-hover:text-primary-foreground/80 transition-colors">Email Us</h3>
                      <p className="text-sm text-primary-foreground/70">Joseph.boutros@lam13.ai</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a href="https://wa.me/971549988326" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-5 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-foreground group-hover:text-primary-foreground/80 transition-colors">WhatsApp</h3>
                      <p className="text-sm text-primary-foreground/70">+971 54 998 8326</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2026 Lam13.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;