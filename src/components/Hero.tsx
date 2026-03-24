import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="liquid-glass rounded-3xl px-8 py-4 backdrop-blur-md border border-white/10 max-w-[850px] w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-secondary to-muted flex items-center justify-center">
                <span className="text-primary font-bold text-sm">&lt;/&gt;</span>
              </div>
              <span className="text-xl font-semibold">PAZENT</span>
            </div>

            {/* Nav Items */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('work');
                }}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Work
              </a>
              <a
                href="#stack"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('stack');
                }}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Stack
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>

            {/* CTA Button */}
            <Button variant="hero" size="sm" className="ml-4">
              Hire Me
            </Button>
          </div>
        </div>
      </nav>

      {/* Availability Badge */}
      <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 mb-8 border border-white/10 backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
        <span className="text-sm text-foreground/80">Available for freelance</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-hero-heading text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-5xl text-center mb-6">
        Full-Stack Developer
        <br />
        Crafting Digital
        <br />
        Experiences
      </h1>

      {/* Subheading */}
      <p className="text-hero-sub text-lg max-w-md text-center opacity-80 mb-8">
        I build fast, scalable, and beautiful web products — from API to pixel. Open to full-time roles and freelance missions.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="hero"
          className="px-8 py-3 text-base"
          onClick={() => scrollToSection('work')}
        >
          See My Work
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          className="liquid-glass px-8 py-3 text-base border border-white/10 backdrop-blur-md hover:bg-white/5 rounded-full"
          onClick={() => {
            // Download CV
            const link = document.createElement('a');
            link.href = '/cv.pdf';
            link.download = 'Alessandro-Gagliardi-CV.pdf';
            link.click();
          }}
        >
          Download CV
          <Download className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-5 h-5 text-primary/60" />
      </div>
    </section>
  );
}
