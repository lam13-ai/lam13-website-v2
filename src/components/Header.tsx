import { useState, useEffect } from "react";
import { NavLink } from "./NavLink";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";
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
          <NavLink to="/" className="flex items-center space-x-2">
            <img src={logo} alt="LAM13 Logo" className="h-16 w-auto" />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/try">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Get Started 
              </Button>
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <NavLink to="/try" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                  Try Us
                </Button>
              </NavLink>
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;