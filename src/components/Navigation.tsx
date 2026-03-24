import React from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Navigation({ isMenuOpen, setIsMenuOpen }: NavigationProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - handled in Hero */}
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden">
          <div className="flex flex-col items-center justify-center h-screen gap-8">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('work');
              }}
              className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              Work
            </a>
            <a
              href="#stack"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('stack');
              }}
              className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              Stack
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
              className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </>
  );
}
