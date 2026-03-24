import React, { useEffect, useRef } from 'react';
import HlsVideo from './HlsVideo';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'Project Alpha',
    description: 'A SaaS dashboard for real-time analytics with multi-tenant architecture and sub-100ms query performance.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    stat: '12k+',
    statLabel: 'active users',
  },
  {
    title: 'Project Beta',
    description: 'E-commerce platform with headless CMS, stripe integration, and edge-deployed storefront serving 5 countries.',
    tags: ['Next.js', 'Stripe', 'Sanity'],
    stat: '€2M+',
    statLabel: 'GMV processed',
  },
  {
    title: 'Project Gamma',
    description: 'Internal tooling platform replacing 4 legacy apps. Built with full audit trails, RBAC, and real-time sync.',
    tags: ['TypeScript', 'Prisma', 'WebSockets'],
    stat: '80%',
    statLabel: 'ops time saved',
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative py-32 px-4 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 -z-20">
        <HlsVideo url="https://stream.mux.com/Jwr2RhmsNrd6GEspBNgm02vJsRZAGlaoQIh4AucGdASw.m3u8" />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-transparent h-[40%] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 bg-gradient-to-t from-background via-background/80 to-transparent h-[40%] pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-background/40 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          {/* Badge */}
          <div className="liquid-glass rounded-full px-4 py-2 w-fit mb-8 border border-white/10 flex items-center gap-2">
            <span className="text-sm text-foreground/70">Selected Work</span>
            <span className="text-foreground/40">•</span>
            <span className="text-sm text-foreground/70">2024–2025</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>

          {/* Heading */}
          <h2 className="text-hero-heading text-3xl sm:text-5xl font-semibold leading-tight mb-4">
            Projects Built<br />With Purpose
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl">
            A selection of real-world products, platforms, and tools I've shipped.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="liquid-glass rounded-3xl p-8 border border-white/10 hover:bg-white/[0.03] transition-all duration-300 flex flex-col group"
            >
              {/* Description */}
              <p className="text-foreground/80 text-sm mb-6 flex-grow">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-foreground/50 px-2 py-1 rounded bg-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-border/50 pt-6 mb-6" />

              {/* Stat */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-semibold text-primary">{project.stat}</div>
                  <div className="text-xs text-foreground/50">{project.statLabel}</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
