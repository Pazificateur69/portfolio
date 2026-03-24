import React from 'react';
import { Github, Linkedin, Twitter, Coffee } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand - 2 col span */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="text-lg font-semibold">Pazent</span>
            </div>
            <p className="text-foreground/60 text-sm mb-6">
              Full-Stack Developer · <a href="https://pazent.fr" className="text-primary hover:text-primary/80">pazent.fr</a>
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/Pazificateur69"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/40 hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/pazent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/40 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/pazent69"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/40 hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Work */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Work</h4>
            <ul className="space-y-3">
              <li>
                <a href="#projects" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Open Source
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Playground
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Info</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#stack" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Stack
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  CV
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground/50 text-xs flex items-center gap-1">
            © 2026 Pazent. Built with React, TypeScript &{' '}
            <Coffee className="w-3 h-3" />
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-foreground/50 hover:text-foreground text-xs transition-colors">
              Privacy
            </a>
            <a href="#" className="text-foreground/50 hover:text-foreground text-xs transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
