import React from 'react';
import { Code2, Zap, Target } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">About Me</h2>
          <p className="text-lg text-foreground/60">Full-stack developer passionate about infrastructure & security</p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <Code2 className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Full-Stack Development</h3>
            <p className="text-foreground/70 text-sm">
              Building scalable web applications with modern technologies. From React frontends to Node.js backends, I create complete solutions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Infrastructure & DevOps</h3>
            <p className="text-foreground/70 text-sm">
              Designing secure, scalable infrastructure with Kubernetes, Docker, and cloud platforms. RNCP AIS certified.
            </p>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <Target className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Security First</h3>
            <p className="text-foreground/70 text-sm">
              Implementing Zero Trust architecture, hardening systems, and monitoring with Wazuh SIEM. Lynis 74% score.
            </p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-20 liquid-glass rounded-2xl p-12 border border-white/10">
          <h3 className="text-2xl font-semibold mb-6">The Journey</h3>
          <div className="space-y-4 text-foreground/80">
            <p>
              I'm Alessandro Gagliardi, a full-stack developer based in Europe with expertise in building modern web applications and securing infrastructure. With a background in both frontend and backend development, I specialize in creating seamless user experiences backed by robust, scalable systems.
            </p>
            <p>
              Currently pursuing RNCP AIS Niveau 6 certification, I've designed and deployed a complete enterprise infrastructure with 5 VMs, Kubernetes-ready architecture, and comprehensive security monitoring. My focus is on writing clean, maintainable code and architecting systems that scale.
            </p>
            <p>
              When I'm not coding, I'm exploring new technologies, contributing to open-source projects, or optimizing infrastructure performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
