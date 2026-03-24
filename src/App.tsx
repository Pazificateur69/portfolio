import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import ProjectsSection from './components/ProjectsSection';
import NumbersSection from './components/NumbersSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Tech Marquee */}
        <TechMarquee />

        {/* Projects Section */}
        <ProjectsSection />

        {/* Numbers Section */}
        <NumbersSection />

        {/* Testimonials Section */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
