import React from 'react';

const testimonials = [
  {
    quote: 'One of the most reliable and sharp engineers I\'ve worked with. Delivered a complex multi-tenant platform in 6 weeks, clean code and zero handholding required.',
    name: 'Marc Lefebvre',
    role: 'CTO, Startupify',
    initials: 'ML',
  },
  {
    quote: 'Pazent has a rare ability to bridge product thinking and engineering. He doesn\'t just build what you ask — he questions it, improves it, and ships it faster than expected.',
    name: 'Aiko Tanaka',
    role: 'Product Lead, Buildforge',
    initials: 'AT',
  },
  {
    quote: 'Our new platform is night and day vs the old one. Fast, beautiful, and maintainable. I\'ve already recommended Pazent to three other founders.',
    name: 'Sophie Bernard',
    role: 'Founder, Helio Studio',
    initials: 'SB',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-hero-heading text-3xl sm:text-5xl font-semibold leading-tight mb-4">
            Kind Words From<br />People I've Worked With
          </h2>
          <p className="text-foreground/60 text-lg">
            What colleagues, clients, and collaborators have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`liquid-glass rounded-3xl p-8 border border-white/10 flex flex-col ${
                index === 1 ? 'md:-translate-y-6' : ''
              }`}
            >
              {/* Quote */}
              <p className="text-foreground/80 text-sm mb-6 flex-grow italic">
                "{testimonial.quote}"
              </p>

              {/* Divider */}
              <div className="border-t border-border/50 pt-6" />

              {/* Author */}
              <div className="flex items-center gap-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-foreground/70">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-foreground/50 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
