'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// ─── Terminal Lines ────────────────────────────────────────────
const TERMINAL_LINES = [
  { text: '> BIOMETRIC MATCH CONFIRMED.', color: '#22c55e', delay: 0.3 },
  { text: '> ACCESSING PILOT LOG...', color: '#00f3ff', delay: 0.9 },
];

const BIO_TEXT = `I am an MSc Software Technology student and AI/ML Research Intern dedicated to engineering intelligent, scalable systems. My core directive is bridging the gap between complex machine learning models and highly functional full-stack web applications.

Currently deployed in medical tech research, focusing on non-invasive predictive modeling. Whether architecting databases, building MERN stack apps, or training data pipelines — my mission is to transform raw data into high-impact, user-centric software.`;

const STATS = [
  { label: 'SPECIALIZATION', value: 'AI/ML Engineering' },
  { label: 'STACK', value: 'MERN + Python' },
  { label: 'STATUS', value: 'ACTIVE — Research' },
  { label: 'CLEARANCE', value: 'Full-Stack Ops' },
];

// ─── 3D Tilt Wrapper ───────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Spring-smooth the tilt so it feels weighty
  const springConfig = { stiffness: 140, damping: 20, mass: 0.8 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), springConfig);
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 18 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Normalise to -1…1
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(nx);
    mouseY.set(ny);
    // Glare position (0…100%)
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
    glareOpacity.set(0.12);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    glareOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 900,
      }}
      className="relative cursor-pointer select-none"
    >
      {children}
      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl z-30"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([x, y]: number[]) =>
              `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`
          ),
          opacity: glareOpacity,
        }}
      />
    </motion.div>
  );
}

// ─── Holographic Portrait ─────────────────────────────────────
function HoloPortrait() {
  return (
    <div className="relative" style={{ width: 180, height: 220 }}>
      {/* Outer glow frame */}
      <div className="absolute inset-0 rounded-lg border-2 border-cyan/60 z-10"
        style={{ boxShadow: '0 0 20px rgba(0,243,255,0.4), inset 0 0 20px rgba(0,243,255,0.08)' }} />

      {/* Corner brackets */}
      {[['top-0 left-0 border-t-2 border-l-2', 'rounded-tl-md'], ['top-0 right-0 border-t-2 border-r-2', 'rounded-tr-md'],
      ['bottom-0 left-0 border-b-2 border-l-2', 'rounded-bl-md'], ['bottom-0 right-0 border-b-2 border-r-2', 'rounded-br-md']].map(([pos, rd], i) => (
        <div key={i} className={`absolute ${pos} ${rd} w-5 h-5 border-cyan z-20`} />
      ))}

      {/* 📸 YOUR PHOTO — holographic style */}
      <div className="absolute inset-0 rounded-lg overflow-hidden bg-obsidian">
        <img
          src="/pilot-photo.jpeg"
          alt="Pilot Portrait"
          className="w-full h-full object-cover opacity-80"
          style={{ filter: 'grayscale(80%) sepia(100%) hue-rotate(150deg) saturate(250%) contrast(110%) brightness(1.1)' }}
        />

        {/* Scanline overlay pattern */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,243,255,0.04) 3px, rgba(0,243,255,0.04) 4px)' }} />

        {/* Animated scan laser */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, #00f3ff, transparent)', boxShadow: '0 0 8px 3px rgba(0,243,255,0.6)', zIndex: 15 }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,15,25,0.8) 100%)' }} />
      </div>

      {/* Status badges below portrait */}
      <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center gap-1">
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
          className="font-mono text-xs tracking-widest" style={{ color: '#22c55e', textShadow: '0 0 8px #22c55e' }}>
          ● STATUS: ACTIVE
        </motion.div>
        <div className="font-mono text-xs text-cyan/50 tracking-widest">CLASS: FULL-STACK ENG</div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────
export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-20 relative">
      {/* Header */}
      <motion.div className="mb-12 border-l-4 border-cyan pl-4"
        initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-5xl font-sans font-bold text-cyan tracking-widest uppercase">Pilot Profile</h2>
        <div className="text-foreground/60 font-mono mt-2 text-sm uppercase">Section 02 // Biometric Data Slate</div>
      </motion.div>

      {/* 3D Tilt Card */}
      <TiltCard>
        <div className="relative rounded-xl border border-cyan/30 overflow-visible p-6 md:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(11,20,36,0.95) 0%, rgba(15,25,45,0.95) 100%)',
            boxShadow: '0 0 60px rgba(0,243,255,0.08), inset 0 0 40px rgba(0,243,255,0.04)',
            transformStyle: 'preserve-3d',
          }}>

          {/* Animated border glow */}
          <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ boxShadow: '0 0 0 1px rgba(0,243,255,0.2)' }}
            animate={{ boxShadow: ['0 0 0 1px rgba(0,243,255,0.15)', '0 0 0 2px rgba(0,243,255,0.4)', '0 0 0 1px rgba(0,243,255,0.15)'] }}
            transition={{ duration: 3, repeat: Infinity }} />

          {/* HUD corner brackets */}
          {[['top-3 left-3 border-t border-l', ''], ['top-3 right-3 border-t border-r', ''],
          ['bottom-3 left-3 border-b border-l', ''], ['bottom-3 right-3 border-b border-r', '']].map(([cls], i) => (
            <div key={i} className={`absolute ${cls} w-8 h-8 border-cyan/50 z-10`} />
          ))}

          {/* ID tag top-right */}
          <div className="absolute top-4 right-12 font-mono text-xs text-cyan/30 tracking-widest">
            ID: PL-0042 // CLEARANCE: ALPHA
          </div>

          {/* Layout: portrait | terminal text */}
          <div className="flex flex-col md:flex-row gap-10 items-start">

            {/* Left: Portrait */}
            <motion.div className="flex-shrink-0 flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(24px)' }}>
              <HoloPortrait />

              {/* Stats below portrait */}
              <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-2">
                {STATS.map((s, i) => (
                  <div key={i} className="font-mono">
                    <div className="text-xs text-cyan/40 uppercase tracking-widest">{s.label}</div>
                    <div className="text-xs text-foreground/70">{s.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Terminal text */}
            <motion.div className="flex-1 font-mono space-y-4"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(16px)' }}>
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-cyan/15 pb-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-cyan/50 tracking-widest">PILOT_LOG_v3.7 — SECURE CHANNEL</span>
              </div>

              {/* Typed terminal lines */}
              {TERMINAL_LINES.map((line, i) => (
                <motion.div key={i} className="text-sm"
                  style={{ color: line.color }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: line.delay }}>
                  {line.text}
                </motion.div>
              ))}

              {/* Bio paragraph */}
              <motion.div className="text-foreground/75 text-sm leading-relaxed border-l-2 border-cyan/20 pl-4 whitespace-pre-line"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 1.4 }}>
                {BIO_TEXT}
              </motion.div>

              {/* 📄 RESUME BUTTON */}
              <motion.div className="pt-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 1.6 }}>
                <a 
                   href="/resume.pdf" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-6 py-2 border border-cyan/40 text-cyan bg-cyan/5 hover:bg-cyan/15 hover:border-cyan transition-all font-mono text-xs tracking-widest uppercase outline-none"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <polyline points="9 15 12 18 15 15"/>
                  </svg>
                  <span>[ Access Data Slate ]</span>
                  <div className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
                </a>
              </motion.div>

              {/* Skill tags */}
              <motion.div className="flex flex-wrap gap-2 pt-2"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 1.8 }}>
                {['AI/ML', 'Next.js', 'Python', 'OpenCV', 'MERN', 'Docker', 'TypeScript'].map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-sm border border-cyan/25 text-cyan/60 hover:border-cyan/60 hover:text-cyan transition-colors cursor-default font-mono">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </TiltCard>
    </section>
  );
}
