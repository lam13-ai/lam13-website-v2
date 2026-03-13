import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });

  useEffect(() => {
    document.title = "Contact Us - Let's Transform Together | Lam13.ai";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Get in touch with Lam13.ai. Ready to bring Large Agentic Models to your organization? Contact us to explore how LAM13 can drive your strategic transformation.");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours."
    });
    setFormData({
      name: "",
      email: "",
      organization: "",
      message: ""
    });
  };
  const contactInfo = [{
    icon: Mail,
    title: "Email",
    detail: "hello@lam13.ai",
    link: "mailto:hello@lam13.ai"
  }, {
    icon: Phone,
    title: "Phone",
    detail: "+1 (555) 123-4567",
    link: "tel:+15551234567"
  }, {
    icon: MapPin,
    title: "Location",
    detail: "Global Operations",
    link: null
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-fade-in">
              Let's <span className="text-primary-foreground">Transform</span> Together
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-2">
              Ready to bring Language Action Models to your organization? 
              Get in touch and let's explore how LAM13 can drive your strategic transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-32 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gradient-accent">Send us a message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and our team will respond within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <Input id="name" required value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} className="h-12 bg-background/50 border-border/50 focus:border-accent transition-colors" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address *
                  </label>
                  <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} className="h-12 bg-background/50 border-border/50 focus:border-accent transition-colors" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium text-foreground">
                    Organization
                  </label>
                  <Input id="organization" value={formData.organization} onChange={e => setFormData({
                  ...formData,
                  organization: e.target.value
                })} className="h-12 bg-background/50 border-border/50 focus:border-accent transition-colors" placeholder="Your agency or institution" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <Textarea id="message" required value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} className="min-h-[150px] bg-background/50 border-border/50 focus:border-accent transition-colors resize-none" placeholder="Tell us about your strategic challenges..." />
                </div>

                <Button type="submit" className="w-full h-12 bg-accent hover:bg-accent/90 text-background font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gradient-accent">Get in touch</h2>
                <p className="text-muted-foreground mb-8">
                  Reach out through any of these channels, or use the form to send us a detailed message.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const content = <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">{info.title}</h3>
                        <p className="text-muted-foreground group-hover:text-accent transition-colors">
                          {info.detail}
                        </p>
                      </div>
                    </div>;
                return info.link ? <a key={index} href={info.link} className="block">
                      {content}
                    </a> : <div key={index}>{content}</div>;
              })}
              </div>

              {/* Additional Info */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-accent/20 space-y-4">
                <h3 className="text-xl font-semibold text-accent">Response Time</h3>
                <p className="text-foreground/80 leading-relaxed">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please mention "URGENT" in your message subject.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border border-border/30 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Working With Us</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Initial consultations are complimentary. We'll discuss your challenges, 
                  explore potential LAM applications, and outline a tailored approach for your organization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>;
};
export default Contact;