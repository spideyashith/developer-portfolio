'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Skill Data ───────────────────────────────────────────────
type SkillItem = { name: string; level: number; color: string };

const SKILLS: SkillItem[] = [
  // Navigation Systems
  { name: 'Python',        level: 95, color: '#ffb000' },
  { name: 'NLP (T5/BART)', level: 85, color: '#ffb000' },
  { name: 'Hugging Face',  level: 90, color: '#ffb000' },
  { name: 'OpenCV',        level: 80, color: '#ffb000' },
  { name: 'YOLO',          level: 78, color: '#ffb000' },
  { name: 'XGBoost',       level: 82, color: '#ffb000' },
  { name: 'Hadoop / Hive', level: 75, color: '#ffb000' },
  // Engine Core
  { name: 'Next.js',       level: 90, color: '#00f3ff' },
  { name: 'MERN Stack',    level: 88, color: '#00f3ff' },
  { name: 'TypeScript',    level: 88, color: '#00f3ff' },
  { name: 'REST API',      level: 92, color: '#00f3ff' },
  { name: 'Node.js',       level: 85, color: '#00f3ff' },
  { name: 'R3F / Three',   level: 72, color: '#00f3ff' },
  // Armament
  { name: 'Java',   level: 82, color: '#0066ff' },
  { name: 'C#',     level: 80, color: '#0066ff' },
  { name: 'C/C++',  level: 75, color: '#0066ff' },
  { name: '.NET',   level: 76, color: '#0066ff' },
  { name: 'NoSQL',  level: 85, color: '#0066ff' },
  { name: 'Redis',  level: 78, color: '#0066ff' },
  { name: 'Docker', level: 80, color: '#0066ff' },
];

// Duplicate to fill out a nice hex grid
const GRID_SKILLS = [...SKILLS];

// ─── Decryption lines ─────────────────────────────────────────
const DECRYPT_LINES = [
  { text: '> WARNING: UNAUTHORIZED ACCESS DETECTED.',  color: '#ef4444', delay: 0 },
  { text: '> OVERRIDING FIREWALL...',                   color: '#ffb000', delay: 600 },
  { text: '> DECRYPTING PILOT SKILL MATRICES...',       color: '#00f3ff', delay: 1200 },
  { text: '> ACCESS GRANTED.',                          color: '#22c55e', delay: 2100 },
];

type Phase = 'locked' | 'hacking' | 'decrypting' | 'opening' | 'revealed';

// ─── Deterministic explosion sparks ───────────────────────────
const SPARKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * 360;
  const dist = 60 + (i % 5) * 40;
  return {
    id: i,
    tx: Math.cos((angle * Math.PI) / 180) * dist,
    ty: Math.sin((angle * Math.PI) / 180) * dist,
    color: i % 3 === 0 ? '#ff4500' : i % 3 === 1 ? '#ffb000' : '#ff6600',
    size: 3 + (i % 4) * 2,
    dur: 0.5 + (i % 4) * 0.15,
  };
});

// ─── Hex cell ─────────────────────────────────────────────────
function HexSkill({ skill, index }: { skill: SkillItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative flex items-center justify-center cursor-default select-none"
      style={{
        width: 110,
        height: 110,
        clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
        background: hovered
          ? `linear-gradient(135deg, ${skill.color}40 0%, ${skill.color}15 100%)`
          : 'linear-gradient(135deg, #1a2235 0%, #111827 100%)',
        border: `2px solid ${hovered ? skill.color : skill.color + '35'}`,
        boxShadow: hovered ? `0 0 22px ${skill.color}70, inset 0 0 15px ${skill.color}20` : 'none',
        transition: 'all 0.25s ease',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.12 }}
    >
      <div className="text-center px-2">
        <div className="font-mono text-xs font-bold leading-tight" style={{ color: hovered ? skill.color : skill.color + 'cc', textShadow: hovered ? `0 0 8px ${skill.color}` : 'none' }}>
          {skill.name}
        </div>
        {hovered && (
          <motion.div className="text-xs mt-1 font-mono" style={{ color: skill.color }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {skill.level}%
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function Skills() {
  const [phase, setPhase] = useState<Phase>('locked');
  const [shownLines, setShownLines] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };

  const handleOverride = () => {
    if (phase !== 'locked') return;
    setPhase('hacking');
    // Brief glitch, then start decryption
    const t1 = setTimeout(() => {
      setPhase('decrypting');
      // Reveal lines one by one
      DECRYPT_LINES.forEach((line, i) => {
        const t = setTimeout(() => setShownLines(prev => [...prev, i]), line.delay + 300);
        timerRef.current.push(t);
      });
      // After last line + 1s → blast door open
      const lastDelay = DECRYPT_LINES[DECRYPT_LINES.length - 1].delay;
      const t2 = setTimeout(() => {
        setPhase('opening');
        const t3 = setTimeout(() => setPhase('revealed'), 1200);
        timerRef.current.push(t3);
      }, lastDelay + 1400);
      timerRef.current.push(t2);
    }, 600);
    timerRef.current.push(t1);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <section id="skills" className="py-24 px-6 md:px-20 relative">
      {/* Header */}
      <motion.div className="mb-12 border-l-4 border-alert-amber pl-4"
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-5xl font-sans font-bold text-alert-amber tracking-widest uppercase">Ship Specifications</h2>
        <div className="text-foreground/60 font-mono mt-2 text-sm uppercase">Section 05 // Arsenal &amp; System Matrix</div>
      </motion.div>

      {/* Main locked panel */}
      <div className="relative min-h-[480px] rounded-xl border overflow-hidden"
           style={{
             borderColor: phase === 'revealed' ? '#00f3ff40' : '#ffb00040',
             background: 'linear-gradient(135deg, #0b0f19 0%, #141c2e 100%)',
           }}>

        {/* ── Phase 1 & 2: Locked console ── */}
        <AnimatePresence>
          {(phase === 'locked' || phase === 'hacking') && (
            <motion.div key="lock"
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-10"
              exit={{ opacity: 0 }}
              animate={phase === 'hacking' ? {
                x: [0, -6, 6, -4, 4, -2, 2, 0],
                filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* Hazard stripes top */}
              <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden">
                <div className="h-full w-[200%] flex" style={{ animation: 'pan 3s linear infinite' }}>
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0" style={{ width: '5%', height: '100%', background: i % 2 === 0 ? '#ffb000' : '#000' }} />
                  ))}
                </div>
              </div>
              {/* Hazard stripes bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden">
                <div className="h-full w-[200%] flex" style={{ animation: 'pan 3s linear infinite' }}>
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0" style={{ width: '5%', height: '100%', background: i % 2 === 0 ? '#ffb000' : '#000' }} />
                  ))}
                </div>
              </div>

              {/* Lock icon */}
              <motion.div animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}>
                <svg className="w-20 h-20 text-alert-amber opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </motion.div>

              <div className="text-center space-y-2">
                <div className="font-mono text-alert-amber text-xs tracking-widest uppercase">[ CLASSIFIED — CLEARANCE REQUIRED ]</div>
                <div className="font-mono text-foreground/30 text-xs">SECTION 05 // PILOT SKILL MATRICES — RESTRICTED</div>
              </div>

              {/* Override switch */}
              <motion.button
                onClick={handleOverride}
                disabled={phase === 'hacking'}
                className="group relative px-8 py-4 rounded border-2 font-mono text-sm font-bold uppercase tracking-widest transition-all"
                style={{
                  borderColor: '#ffb000',
                  color: '#ffb000',
                  background: 'rgba(255,176,0,0.08)',
                  boxShadow: '0 0 20px rgba(255,176,0,0.3)',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(255,176,0,0.6)' }}
                whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ['0 0 15px rgba(255,176,0,0.2)', '0 0 30px rgba(255,176,0,0.5)', '0 0 15px rgba(255,176,0,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡ INITIATE MANUAL OVERRIDE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 3: Terminal decryption ── */}
        <AnimatePresence>
          {phase === 'decrypting' && (
            <motion.div key="terminal"
              className="absolute inset-0 flex items-center justify-center z-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full max-w-xl mx-6 rounded-lg border border-cyan/40 overflow-hidden"
                   style={{ background: 'rgba(0,0,0,0.85)', boxShadow: '0 0 40px rgba(0,243,255,0.3)' }}>
                {/* Terminal header */}
                <div className="px-4 py-2 border-b border-cyan/20 flex items-center gap-2 bg-cyan/5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 font-mono text-xs text-cyan/50">OVERRIDE_TERMINAL — ROOT ACCESS</span>
                </div>
                <div className="p-6 font-mono text-sm space-y-3 min-h-[200px]">
                  {DECRYPT_LINES.map((line, i) => (
                    <AnimatePresence key={i}>
                      {shownLines.includes(i) && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ color: line.color }}
                        >
                          {line.text}
                          {i === shownLines[shownLines.length - 1] && (
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>█</motion.span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 4: Blast door opening ── */}
        <AnimatePresence>
          {phase === 'opening' && (
            <>
              {/* Flash overlay */}
              <motion.div key="flash"
                className="absolute inset-0 z-50 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,140,0,0.7) 0%, rgba(255,69,0,0.4) 40%, transparent 70%)' }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />

              {/* Shockwave ring */}
              <motion.div key="shockwave"
                className="absolute z-50 pointer-events-none rounded-full border-4 border-orange-400"
                style={{ top: '50%', left: '50%', marginTop: -2, marginLeft: -2, width: 4, height: 4 }}
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 120, opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />

              {/* Fire sparks */}
              {SPARKS.map(spark => (
                <motion.div
                  key={`spark-${spark.id}`}
                  className="absolute rounded-full z-50 pointer-events-none"
                  style={{
                    width: spark.size,
                    height: spark.size,
                    top: '50%',
                    left: '50%',
                    marginTop: -spark.size / 2,
                    marginLeft: -spark.size / 2,
                    background: spark.color,
                    boxShadow: `0 0 8px ${spark.color}, 0 0 16px ${spark.color}80`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: spark.tx,
                    y: spark.ty,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: spark.dur, ease: 'easeOut' }}
                />
              ))}

              {/* Additional glowing ember trail */}
              {SPARKS.filter((_, i) => i % 3 === 0).map(spark => (
                <motion.div
                  key={`ember-${spark.id}`}
                  className="absolute rounded-full z-50 pointer-events-none blur-sm"
                  style={{
                    width: spark.size * 3,
                    height: spark.size * 3,
                    top: '50%',
                    left: '50%',
                    marginTop: -(spark.size * 3) / 2,
                    marginLeft: -(spark.size * 3) / 2,
                    background: '#ff4500',
                    opacity: 0.4,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0.6 }}
                  animate={{
                    x: spark.tx * 0.5,
                    y: spark.ty * 0.5,
                    opacity: 0,
                  }}
                  transition={{ duration: spark.dur * 0.6, ease: 'easeOut' }}
                />
              ))}

              {/* Left door */}
              <motion.div key="door-left"
                className="absolute top-0 left-0 bottom-0 w-1/2 z-30"
                style={{ background: 'linear-gradient(to right, #0b0f19, #111827)', borderRight: '3px solid #ff6600' }}
                initial={{ x: 0 }}
                animate={{ x: '-100%' }}
                exit={{}}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="absolute right-4 inset-y-4 flex flex-col justify-around gap-2">
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-px bg-orange-500/30" />)}
                </div>
              </motion.div>

              {/* Right door */}
              <motion.div key="door-right"
                className="absolute top-0 right-0 bottom-0 w-1/2 z-30"
                style={{ background: 'linear-gradient(to left, #0b0f19, #111827)', borderLeft: '3px solid #ff6600' }}
                initial={{ x: 0 }}
                animate={{ x: '100%' }}
                exit={{}}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="absolute left-4 inset-y-4 flex flex-col justify-around gap-2">
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-px bg-orange-500/30" />)}
                </div>
              </motion.div>

              {/* Lingering glow at seam */}
              <motion.div key="dust"
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 z-40 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent, #ff6600, #ffb000, #ff6600, transparent)', filter: 'blur(6px)' }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* ── Phase 5: Skills grid revealed ── */}
        {(phase === 'opening' || phase === 'revealed') && (
          <div className="p-8">
            {/* Category headers */}
            {[
              { label: '[ NAVIGATION SYSTEMS ]', sublabel: 'AI/ML & Data', color: '#ffb000', skills: GRID_SKILLS.filter(s => s.color === '#ffb000') },
              { label: '[ ENGINE CORE ]', sublabel: 'Web & Frontend', color: '#00f3ff', skills: GRID_SKILLS.filter(s => s.color === '#00f3ff') },
              { label: '[ ARMAMENT ]', sublabel: 'Backend & Software', color: '#0066ff', skills: GRID_SKILLS.filter(s => s.color === '#0066ff') },
            ].map((cat, ci) => (
              <div key={ci} className="mb-8">
                <div className="font-mono mb-4">
                  <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.label}</span>
                  <span className="text-xs ml-2 text-foreground/40">{cat.sublabel}</span>
                </div>
                {/* Hex grid row — offset every other hex down */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, si) => (
                    <HexSkill key={`${ci}-${si}`} skill={skill} index={si + ci * 8} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
