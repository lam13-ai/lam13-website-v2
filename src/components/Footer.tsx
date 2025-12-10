import logo from "@/assets/logo-white.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo/Brand */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <img src={logo} alt="LAM13 Logo" className="h-20 w-auto mb-2" />
              <p className="text-primary-foreground/70 text-sm">
                AI-Native Strategy Consulting
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-8">
              <a
                href="/"
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Contact
              </a>
              <a
                href="/try"
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Try Us
              </a>
            </nav>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-primary-foreground/20" />

          {/* Bottom Bar with Legal Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© {currentYear} Lam13.ai. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
