import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowDown } from 'lucide-react';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Stack from './components/Stack';
import Contact from './components/Contact';
import Navigation from './components/Navigation';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 -z-10 h-screen w-screen">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated green blob */}
          <div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(121, 184, 0, 0.15) 0%, transparent 70%)',
              top: '20%',
              left: '10%',
              animation: 'blob 7s ease-in-out infinite',
              animationDelay: '0s',
            }}
          />
          {/* Animated purple blob */}
          <div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
              top: '40%',
              right: '10%',
              animation: 'blob 7s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-30% to-background/50" />
        </div>
      </div>

      {/* Navigation */}
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Work / Projects Section */}
        <Work />

        {/* Stack / Tech Section */}
        <Stack />

        {/* Contact Section */}
        <Contact />
      </main>

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
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
