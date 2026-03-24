import React from 'react';
import { SiReact, SiTypescript, SiNodedotjs, SiPostgresql, SiDocker, SiNextdotjs, SiTailwindcss, SiPrisma } from 'react-icons/si';

const techs = [
  { name: 'React', Icon: SiReact, color: 'text-blue-400' },
  { name: 'TypeScript', Icon: SiTypescript, color: 'text-blue-600' },
  { name: 'Node.js', Icon: SiNodedotjs, color: 'text-green-600' },
  { name: 'PostgreSQL', Icon: SiPostgresql, color: 'text-blue-500' },
  { name: 'Docker', Icon: SiDocker, color: 'text-blue-400' },
  { name: 'Next.js', Icon: SiNextdotjs, color: 'text-white' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: 'text-cyan-400' },
  { name: 'Prisma', Icon: SiPrisma, color: 'text-white' },
];

export default function TechMarquee() {
  // Duplicate for seamless loop
  const doubledTechs = [...techs, ...techs];

  return (
    <div className="relative w-full mt-20 overflow-hidden py-8 border-t border-white/10">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-16">
        <div className="text-foreground/50 text-sm whitespace-nowrap font-medium">
          Technologies I work with
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-6 animate-marquee">
            {doubledTechs.map((tech, index) => (
              <div
                key={index}
                className="liquid-glass rounded-lg w-20 h-20 flex items-center justify-center gap-2 flex-shrink-0 border border-white/10"
              >
                <tech.Icon className={`w-8 h-8 ${tech.color}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
