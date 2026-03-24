import React from 'react';

const stack = {
  frontend: [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Vite',
    'shadcn/ui',
  ],
  backend: [
    'Node.js',
    'Express',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'REST API',
  ],
  infrastructure: [
    'Docker',
    'Kubernetes',
    'AWS',
    'Oracle Cloud',
    'Terraform',
    'CI/CD',
  ],
  security: [
    'Wazuh SIEM',
    'OpenLDAP',
    'WireGuard',
    'TLS/SSL',
    'Fail2ban',
    'Zero Trust',
  ],
  devops: [
    'Prometheus',
    'Grafana',
    'ELK Stack',
    'Nginx',
    'Linux',
    'Git',
  ],
};

export default function Stack() {
  return (
    <section id="stack" className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-transparent to-background/30">
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">Tech Stack</h2>
          <p className="text-lg text-foreground/60">Tools and technologies I use to build modern applications</p>
        </div>

        {/* Stack Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Frontend */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 text-primary">Frontend</h3>
            <div className="space-y-3">
              {stack.frontend.map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-foreground/80 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 text-primary">Backend</h3>
            <div className="space-y-3">
              {stack.backend.map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-foreground/80 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 text-primary">Infrastructure</h3>
            <div className="space-y-3">
              {stack.infrastructure.map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-foreground/80 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 text-primary">Security</h3>
            <div className="space-y-3">
              {stack.security.map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-foreground/80 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DevOps */}
          <div className="liquid-glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 text-primary">DevOps</h3>
            <div className="space-y-3">
              {stack.devops.map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-foreground/80 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 liquid-glass rounded-2xl p-12 border border-white/10 text-center">
          <h3 className="text-2xl font-semibold mb-4">Continuous Learning</h3>
          <p className="text-foreground/70 mb-6">
            I'm always exploring new technologies and best practices. Currently diving into advanced Kubernetes patterns, security hardening, and modern AI/ML integration.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Web3', 'GraphQL', 'Rust', 'WebAssembly'].map((tech, i) => (
              <span key={i} className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-sm text-foreground/70">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
