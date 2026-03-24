import React from 'react';
import HlsVideo from './HlsVideo';

export default function NumbersSection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 -z-20">
        <HlsVideo url="https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8" />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(260 87% 3%) 0%, hsl(260 87% 3% / 0.85) 15%, hsl(260 87% 3% / 0.4) 40%, hsl(260 87% 3% / 0.15) 60%, hsl(260 87% 3% / 0.3) 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Metric */}
        <div className="text-center mb-24">
          <div className="text-7xl sm:text-[8rem] lg:text-[10rem] font-semibold tracking-tighter text-primary mb-4">
            5+
          </div>
          <p className="text-foreground/80 text-lg mb-2">Years shipping production code</p>
          <p className="text-foreground/50 text-sm max-w-md mx-auto">
            Building products, learning from failures, and continuously shipping.
          </p>
        </div>

        {/* Bottom Metrics */}
        <div className="liquid-glass rounded-3xl p-12 border border-white/10 grid md:grid-cols-2 gap-12">
          {/* Divider on larger screens */}
          <div className="hidden md:block absolute top-0 left-1/2 bottom-0 w-px bg-border/50 transform -translate-x-1/2" />

          {/* Projects */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-semibold text-primary mb-2">30+</div>
            <p className="text-foreground/70">Projects delivered</p>
          </div>

          {/* Stack Debates */}
          <div className="text-center md:text-right">
            <div className="text-5xl font-semibold text-primary mb-2">∞</div>
            <p className="text-foreground/70">Stack debates survived</p>
          </div>
        </div>
      </div>
    </section>
  );
}
