'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Github, Code2 } from 'lucide-react';

// ─── Project Data ─────────────────────────────────────────────
const PROJECTS = [
  {
    id: 's4holidays',
    title: 'S4 Holidays',
    subtitle: 'Full-Stack Travel Platform',
    tech: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    desc: 'A full-stack travel booking website developed collaboratively using the MERN stack. The platform allows users to explore domestic and international tour packages, view detailed trip information, and make booking inquiries. The system includes dynamic listings, responsive UI, and backend APIs for managing travel packages and customer requests.',
    image: '/s4holidays.png',
    github: 'https://github.com/spideyashith/toursist_S4_Holidays.git',
    color: '#00f3ff',
    glowColor: 'rgba(0, 243, 255, 0.6)',
    orbitRadius: 130,
    orbitDuration: 10,
    size: 48,
    startAngle: 0,
  },
  {
    id: 'stress',
    title: 'AI Stress Management',
    subtitle: 'Hackathon — Law Enforcement',
    tech: ['React.js', 'Node.js', 'AI Analytics'],
    desc: 'Developed during a hackathon to support mental health monitoring for law enforcement personnel. The system analyzes user responses and behavioral inputs to generate structured stress analysis reports. It includes a user-friendly interface for data input and an automated report generation module for actionable insights.',
    image: '/project_stress.png',
    github: 'https://github.com/AssassinMaeve/Project-Sentinel.git',
    color: '#ffb000',
    glowColor: 'rgba(255, 176, 0, 0.6)',
    orbitRadius: 210,
    orbitDuration: 18,
    size: 40,
    startAngle: 120,
  },
  {
    id: 'sclera',
    title: 'Sclera Detection',
    subtitle: 'Computer Vision — Jaundice Detection',
    tech: ['Python', 'OpenCV', 'NumPy'],
    desc: 'A computer vision pipeline designed to detect and extract the sclera (white region of the eye) from eye images. The project uses image preprocessing, segmentation techniques, and feature extraction to isolate the sclera region, which can be further analyzed for signs of jaundice based on color variations.',
    image: '/project_sclera.png',
    github: 'https://github.com/spideyashith/sclera_detiction',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    orbitRadius: 295,
    orbitDuration: 28,
    size: 36,
    startAngle: 240,
  },
];

type Project = typeof PROJECTS[0];

// ─── Sun Component ─────────────────────────────────────────────
function Sun() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      {/* Pulsing corona */}
      {[2.2, 1.7, 1.35].map((scale, i) => (
        <motion.div key={i}
          className="absolute rounded-full border border-amber-300/20"
          style={{ width: 80 * scale, height: 80 * scale }}
          animate={{ scale: [scale, scale * 1.06, scale], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}
      {/* Glow disc */}
      <div className="absolute rounded-full opacity-30 blur-lg"
           style={{ width: 130, height: 130, background: '#fbbf24' }} />
      {/* Main sphere */}
      <div className="rounded-full w-full h-full"
           style={{
             background: 'radial-gradient(circle at 35% 30%, #fffde7 0%, #fbbf24 30%, #f97316 65%, #b45309 100%)',
             boxShadow: '0 0 25px #fbbf24, 0 0 55px #f9731660, 0 0 90px #f9731630',
           }} />
      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-amber-300 whitespace-nowrap tracking-widest"
           style={{ textShadow: '0 0 8px #fbbf24' }}>
        ★ MY UNIVERSE
      </div>
    </div>
  );
}

// ─── Single Orbiting Planet ───────────────────────────────────
// The correct approach: a 0×0 div at the sun center rotates 360°.
// Inside it, the planet is offset upward by orbitRadius.
// A counter-rotation is applied to the planet so it stays upright.
function OrbitingPlanet({ project, onClick, isActive }: {
  project: Project;
  onClick: () => void;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Static orbit ring — drawn with a real circle centered at sun */}
      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: project.orbitRadius * 2,
          height: project.orbitRadius * 2,
          top: '50%',
          left: '50%',
          marginTop: -project.orbitRadius,
          marginLeft: -project.orbitRadius,
          borderColor: `${project.color}22`,
          boxShadow: isActive ? `0 0 10px ${project.color}20` : undefined,
        }}
      />

      {/* Rotating arm (0×0 positioned at sun center) */}
      <motion.div
        className="absolute"
        style={{ top: '50%', left: '50%', width: 0, height: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: project.orbitDuration,
          repeat: Infinity,
          ease: 'linear',
          // stagger start angle
          delay: -(project.startAngle / 360) * project.orbitDuration,
        }}
      >
        {/* Planet — offset upward by orbitRadius, counter-rotated to stay upright */}
        <motion.div
          className="absolute cursor-pointer"
          style={{
            width: project.size,
            height: project.size,
            top: -project.orbitRadius - project.size / 2,
            left: -project.size / 2,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: project.orbitDuration, repeat: Infinity, ease: 'linear', delay: -(project.startAngle / 360) * project.orbitDuration }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={onClick}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Glow pulse ring when active */}
          {(isActive || hovered) && (
            <motion.div className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: project.color, margin: -4 }}
                        animate={{ scale: [1, 1.7], opacity: [0.8, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }} />
          )}
          {/* Planet sphere */}
          <div className="w-full h-full rounded-full relative overflow-hidden border-2"
               style={{
                 borderColor: project.color,
                 background: `radial-gradient(circle at 35% 35%, ${project.color}90, ${project.color}30 50%, #0a0e1a)`,
                 boxShadow: (isActive || hovered)
                   ? `0 0 20px ${project.glowColor}, 0 0 40px ${project.glowColor}80`
                   : `0 0 10px ${project.glowColor}50`,
               }}>
            {/* Surface ring stripe */}
            <div className="absolute inset-0 opacity-20"
                 style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 3px, ${project.color}15 3px, ${project.color}15 6px)` }} />
          </div>
          {/* Label — spaced below planet */}
          <div className="absolute font-mono text-xs font-bold whitespace-nowrap text-center"
               style={{ top: project.size + 5, left: '50%', transform: 'translateX(-50%)', color: project.color, textShadow: `0 0 8px ${project.color}`, opacity: hovered || isActive ? 1 : 0.7 }}>
            {project.title}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function GalaxyMap() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const toggle = (p: Project) => setActiveProject(prev => prev?.id === p.id ? null : p);

  return (
    <section id="mission-archives" className="py-24 px-6 md:px-20 relative">
      {/* Header */}
      <motion.div className="mb-12 border-l-4 border-plasma-blue pl-4"
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-5xl font-sans font-bold text-plasma-blue tracking-widest uppercase">Mission Archives</h2>
        <div className="text-foreground/60 font-mono mt-2 text-sm uppercase">
          Section 04 // Solar System — Click a planet to retrieve mission data
        </div>
      </motion.div>

      {/* Solar System Canvas */}
      <div className="relative w-full rounded-xl border border-cyan/10 overflow-hidden"
           style={{ height: 600, background: 'radial-gradient(ellipse at 50% 50%, #0d1a2e 0%, #0b0f19 75%)' }}>

        {/* Nebula blobs */}
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#fbbf24' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-6 blur-3xl pointer-events-none" style={{ background: '#00f3ff' }} />

        {/* Static stars */}
        {Array.from({ length: 70 }, (_, i) => {
          const s1 = (i * 7919 + 1) % 100 / 100;
          const s2 = (i * 6271 + 3) % 100 / 100;
          return <div key={i} className="absolute rounded-full bg-white pointer-events-none"
                      style={{ left: `${s1 * 100}%`, top: `${s2 * 100}%`, width: 1, height: 1, opacity: 0.2 + s1 * 0.4 }} />;
        })}

        {/* Solar system — centred */}
        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 0, height: 0 }}>
          {/* Sun (visually centred via own positioning) */}
          <div style={{ position: 'absolute', top: -40, left: -40 }}>
            <Sun />
          </div>
          {/* Planets */}
          {PROJECTS.map(p => (
            <OrbitingPlanet key={p.id} project={p} onClick={() => toggle(p)} isActive={activeProject?.id === p.id} />
          ))}
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-xs text-cyan/25 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-amber-400/50 animate-ping" />
          {PROJECTS.length} MISSIONS IN ORBIT
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {activeProject && (
          <motion.div key={activeProject.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
            className="mt-6 rounded-lg border overflow-hidden backdrop-blur-md relative"
            style={{ borderColor: activeProject.color, background: 'linear-gradient(135deg,rgba(11,15,25,.96),rgba(22,30,48,.96))', boxShadow: `0 0 40px ${activeProject.glowColor}25` }}>
            <div className="h-1 w-full" style={{ background: `linear-gradient(to right,${activeProject.color},transparent)` }} />
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Screenshot */}
              <div className="w-full md:w-2/5 h-44 rounded-md overflow-hidden border relative flex-shrink-0"
                   style={{ borderColor: `${activeProject.color}40` }}>
                <Image src={activeProject.image} alt={activeProject.title} fill className="object-cover" />
              </div>
              {/* Info */}
              <div className="flex-1 space-y-4 font-mono">
                <div>
                  <h3 className="font-sans text-2xl font-bold" style={{ color: activeProject.color }}>{activeProject.title}</h3>
                  <p className="text-foreground/50 text-sm">{activeProject.subtitle}</p>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">{activeProject.desc}</p>
                <div>
                  <div className="text-xs text-cyan/60 mb-2 flex items-center gap-1"><Code2 className="w-3 h-3" /> TECH_STACK:</div>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tech.map(t => (
                      <span key={t} className="text-xs px-2 py-1 rounded-sm border"
                            style={{ color: activeProject.color, borderColor: `${activeProject.color}40`, background: `${activeProject.color}10` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <a href={activeProject.github} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-sm border transition-all hover:opacity-80"
                   style={{ color: activeProject.color, borderColor: `${activeProject.color}60`, background: `${activeProject.color}15` }}>
                  <Github className="w-4 h-4" /> VIEW SOURCE CODE ON GITHUB
                </a>
              </div>
              <button onClick={() => setActiveProject(null)} className="absolute top-4 right-4 text-foreground/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick-select legend */}
      <div className="mt-5 font-mono text-xs flex gap-6 flex-wrap justify-center">
        {PROJECTS.map(p => (
          <button key={p.id} onClick={() => toggle(p)} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
            <span style={{ color: p.color }}>{p.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
