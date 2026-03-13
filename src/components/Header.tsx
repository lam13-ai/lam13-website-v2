import { useState, useEffect } from "react";
import { NavLink } from "./NavLink";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import logo from "@/assets/lamlogo.png";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-lg" : "bg-background/80 backdrop-blur-md border-b border-border/30"}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button - Left */}
          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Centered on mobile, left on desktop */}
          <NavLink to="/" className="flex items-center space-x-2 md:flex-none absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <img src={logo} alt="LAM13 Logo" className="h-16 w-auto" />
            <span className="text-xl font-semibold text-foreground">Lam13.ai</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/auth">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Sign In
              </Button>
            </NavLink>
            <NavLink to="/try">
              <Button variant="heroOutline" className="group relative overflow-hidden transition-all duration-500">
                <span className="relative z-10">Test Try</span>
              </Button>
            </NavLink>
          </nav>

          {/* Empty spacer for mobile to balance the layout */}
          <div className="w-6 md:hidden"></div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <NavLink to="/auth" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/try" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="heroOutline" className="group relative overflow-hidden transition-all duration-500 w-full">
                  <span className="relative z-10">Test Try</span>
                </Button>
              </NavLink>
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;