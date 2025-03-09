import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Use optional chaining to safely access user property
  // This will gracefully handle the case when AuthProvider is not available
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user;
  } catch (error) {
    // If useAuth fails, we'll just render without user data
    console.log("Auth not available yet");
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <Link href="/">
            <a className="text-xl font-accent font-bold text-primary">
              Dev<span className="text-secondary">Portfolio</span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#hero" className={`font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`}>Home</a>
            <a href="#projects" className={`font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`}>Projects</a>
            <a href="#skills" className={`font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`}>Skills</a>
            <a href="#about" className={`font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`}>About</a>
            <a href="#contact" className={`font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`}>Contact</a>
            
            {user ? (
              <Link href="/dashboard">
                <a className="font-medium text-primary border border-primary rounded-md px-4 py-1 hover:bg-primary hover:text-white transition-colors">
                  Dashboard
                </a>
              </Link>
            ) : (
              <Link href="/auth">
                <a className="font-medium text-primary border border-primary rounded-md px-4 py-1 hover:bg-primary hover:text-white transition-colors">
                  CMS Login
                </a>
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden text-gray-600 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </nav>
        
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
          <div className="py-4 space-y-4">
            <a href="#hero" className={`block font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`} onClick={handleLinkClick}>Home</a>
            <a href="#projects" className={`block font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`} onClick={handleLinkClick}>Projects</a>
            <a href="#skills" className={`block font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`} onClick={handleLinkClick}>Skills</a>
            <a href="#about" className={`block font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`} onClick={handleLinkClick}>About</a>
            <a href="#contact" className={`block font-medium hover:text-primary transition-colors ${location === '/' ? '' : 'hidden'}`} onClick={handleLinkClick}>Contact</a>
            
            {user ? (
              <Link href="/dashboard">
                <a className="block font-medium text-primary mt-6" onClick={handleLinkClick}>
                  Dashboard
                </a>
              </Link>
            ) : (
              <Link href="/auth">
                <a className="block font-medium text-primary mt-6" onClick={handleLinkClick}>
                  CMS Login
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
