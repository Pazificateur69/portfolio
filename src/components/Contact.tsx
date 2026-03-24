import React, { useState } from 'react';
import { Mail, Github, Linkedin, Twitter, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">Get In Touch</h2>
          <p className="text-lg text-foreground/60">Let's build something amazing together</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="liquid-glass rounded-2xl p-12 border border-white/10">
            <h3 className="text-2xl font-semibold mb-8">Send me a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {submitted && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
                  ✓ Message sent! I'll get back to you soon.
                </div>
              )}

              <Button type="submit" variant="hero" className="w-full">
                Send Message
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            {/* Email Card */}
            <div className="liquid-glass rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">Email</h4>
                  <a
                    href="mailto:contact@pazent.fr"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    contact@pazent.fr
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="liquid-glass rounded-2xl p-8 border border-white/10">
              <h4 className="text-lg font-semibold mb-6">Connect</h4>
              <div className="space-y-4">
                <a
                  href="https://github.com/Pazificateur69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors group"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="liquid-glass rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-1">Availability</h4>
                  <p className="text-foreground/70 text-sm">
                    Available for freelance projects and full-time opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
