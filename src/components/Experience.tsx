'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BrainCircuit, Rocket, MapPin } from 'lucide-react';

const timelineItems = [
  {
    year: '2021 — 2024',
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'Padua College of Commerce and Management',
    icon: GraduationCap,
    color: 'var(--color-plasma-blue)',
    status: 'COMPLETED',
    description: 'Core CS fundamentals: algorithms, databases, OOP, and web basics. Built the foundation for full-stack engineering.',
  },
  {
    year: '2024 — Present',
    title: 'MSc Software Technology',
    org: "St. Aloysius (Deemed to be University)",
    icon: Rocket,
    color: 'var(--color-cyan)',
    status: 'ACTIVE',
    description: 'Advanced coursework in AI/ML, distributed systems, and scalable architectures. Specializing in ML engineering and intelligent software development.',
  },
  {
    year: '2026 — Present',
    title: 'AI/ML Research Intern',
    org: "St. Aloysius (Deemed to be University)",
    icon: BrainCircuit,
    color: 'var(--color-alert-amber)',
    status: 'DEPLOYED',
    description: 'Developing non-invasive predictive models for Adult Jaundice detection using Machine Learning. Focused on bridging clinical data with real-world AI applications.',
  },
];

export default function Experience() {
  return (
    <section id="current-directive" className="py-24 px-6 md:px-20 relative">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-16 border-l-4 border-alert-amber pl-4">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-alert-amber tracking-widest uppercase">
            Flight Path
          </h2>
          <div className="text-foreground/70 font-mono mt-2 text-sm uppercase">Section 03 // Mission Progression Roadmap</div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Central vertical line */}
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-plasma-blue via-cyan to-alert-amber"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          <div className="space-y-16">
            {timelineItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = item.status !== 'COMPLETED';
              return (
                <motion.div
                  key={item.title}
                  className="relative pl-24"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  {/* Icon Node on timeline */}
                  <div
                    className="absolute left-0 top-0 w-16 h-16 rounded-full flex items-center justify-center border-2"
                    style={{
                      background: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                      borderColor: item.color,
                      boxShadow: `0 0 20px ${item.color}60, 0 0 40px ${item.color}30`,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: item.color }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <Icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>

                  {/* Card */}
                  <div
                    className="bg-obsidian-light/50 border rounded-lg p-6 backdrop-blur-sm relative overflow-hidden"
                    style={{ borderColor: `${item.color}50` }}
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }} />

                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-sans text-xl font-bold text-white">{item.title}</h3>
                        <div className="flex items-center gap-1 mt-1 font-mono text-sm" style={{ color: item.color }}>
                          <MapPin className="w-3 h-3" /> {item.org}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-xs text-foreground/50">{item.year}</span>
                        <span
                          className="font-mono text-xs px-2 py-0.5 rounded-sm border"
                          style={{ color: item.color, borderColor: `${item.color}60`, background: `${item.color}15` }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <p className="font-mono text-sm text-foreground/70 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Final destination indicator */}
          <motion.div
            className="relative pl-24 mt-12 flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <div className="absolute left-0 w-16 h-16 rounded-full border-2 border-dashed border-cyan/30 flex items-center justify-center">
              <span className="text-cyan/50 text-2xl">?</span>
            </div>
            <p className="font-mono text-sm text-foreground/40 italic">{`> NEXT COORDINATES: UNKNOWN. MISSION CONTINUES...`}</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

