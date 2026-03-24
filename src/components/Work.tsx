import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'DataForge Infrastructure',
    description: 'Enterprise-grade infrastructure with 5 VMs, Kubernetes-ready, complete security hardening (Lynis 74%), Wazuh SIEM with 4 agents, and Prometheus monitoring.',
    tags: ['Infrastructure', 'Kubernetes', 'Security', 'DevOps'],
    image: '🏗️',
    link: 'https://pazent.fr/infra-dashboard',
    github: 'https://github.com/Pazificateur69/pazent-brain-notes',
  },
  {
    title: 'pazent-brain Knowledge Base',
    description: 'PWA knowledge base with searchable documentation, nested folders, command palette, and drag-drop functionality. 4194 lines of RNCP documentation.',
    tags: ['React', 'PWA', 'Vercel', 'Documentation'],
    image: '🧠',
    link: 'https://pazent-brain.vercel.app',
    github: 'https://github.com/Pazificateur69/pazent-brain-notes',
  },
  {
    title: 'Professional Portfolio',
    description: 'Premium developer portfolio with liquid glass design, animated backgrounds, and responsive UI. Built with React, Vite, TypeScript, and Tailwind CSS.',
    tags: ['React', 'Vite', 'Tailwind', 'Design'],
    image: '💼',
    link: 'https://pazent.fr',
    github: 'https://github.com/Pazificateur69/portfolio',
  },
  {
    title: 'Wazuh SIEM Deployment',
    description: 'Complete SIEM setup with Wazuh Manager, Indexer, Dashboard, and 4 enrolled agents. Real-time security event monitoring and compliance reporting.',
    tags: ['Wazuh', 'SIEM', 'Security', 'Elasticsearch'],
    image: '🔴',
    link: 'https://pazent.fr/infra-dashboard',
    github: 'https://github.com/Pazificateur69/pazent-brain-notes',
  },
  {
    title: 'LDAP IAM System',
    description: 'Centralized identity management with OpenLDAP, 5 users, 3 groups, and 7 OUs. Complete authentication infrastructure with password policies and MFA support.',
    tags: ['LDAP', 'IAM', 'Docker', 'Security'],
    image: '🔑',
    link: 'https://pazent.fr/infra-dashboard',
    github: 'https://github.com/Pazificateur69/pazent-brain-notes',
  },
  {
    title: 'Prometheus + Grafana Monitoring',
    description: '15+ scrape targets, 8 custom dashboards, 12 alert rules, and real-time metrics visualization. 15-day retention with Alertmanager integration.',
    tags: ['Prometheus', 'Grafana', 'Monitoring', 'DevOps'],
    image: '📊',
    link: 'https://pazent.fr/infra-dashboard',
    github: 'https://github.com/Pazificateur69/pazent-brain-notes',
  },
];

export default function Work() {
  return (
    <section id="work" className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">Featured Work</h2>
          <p className="text-lg text-foreground/60">Projects that showcase my expertise in infrastructure, security, and development</p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="liquid-glass rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col group"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                {project.image}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-foreground/70 text-sm mb-6 flex-grow">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  View <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm"
                >
                  Code <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-foreground/60 mb-6">Want to see more?</p>
          <a
            href="https://github.com/Pazificateur69"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Visit My GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
