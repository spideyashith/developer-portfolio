'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Hexagonal grid — deterministic, no Math.random (fixes hydration error)
const COLS = 12;
const ROWS = 8;
// Pre-compute stable scatter values using a simple seeded formula
const HEX_TILES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const angle = (i * 137.508) % 360; // golden angle spread
  const dist  = 80 + (i % 7) * 20;
  return {
    id:    i,
    row:   Math.floor(i / COLS),
    col:   i % COLS,
    tx:    `${Math.cos((angle * Math.PI) / 180) * dist}px`,
    ty:    `${Math.sin((angle * Math.PI) / 180) * dist}px`,
    rot:   `${(i % 12) * 30 - 60}deg`,
    delay: (i % 10) * 0.04,
  };
});

function HexTile({ tile, shattering }: { tile: typeof HEX_TILES[0]; shattering: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${(tile.col / COLS) * 100}%`,
        top:  `${(tile.row / ROWS) * 100}%`,
        width:  `${100 / COLS + 0.5}%`,
        height: `${100 / ROWS + 0.5}%`,
        background: 'linear-gradient(135deg, #111827 0%, #0b0f19 100%)',
        border: '1px solid rgba(0,243,255,0.12)',
        clipPath: 'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)',
        transformOrigin: 'center center',
        zIndex: 10,
      }}
      animate={shattering ? {
        x: tile.tx,
        y: tile.ty,
        rotate: tile.rot,
        scale: 3.5,
        opacity: 0,
      } : {}}
      transition={shattering ? { duration: 0.85, delay: tile.delay, ease: 'easeIn' } : {}}
    />
  );
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('> INITIATING CLEARANCE PROTOCOL...');
  const [isGranted, setIsGranted] = useState(false);
  const [shattering, setShattering] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load voices — browsers fire onvoiceschanged before voices are available
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const preferred = voicesRef.current.find(v =>
      v.name.toLowerCase().includes('google') ||
      v.name.toLowerCase().includes('hazel') ||
      v.name.toLowerCase().includes('samantha') ||
      v.lang.startsWith('en')
    );
    if (preferred) utterance.voice = preferred;
    utterance.pitch = 0.75;
    utterance.rate = 1.05;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const duration = 2800;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const p = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(p);

      if (p === 5) { speakText('Initiating clearance protocol. Stand by.'); }
      if (p === 30) { setStatusText('> IDENTIFYING USER BIOMETRICS...'); speakText('Identifying user biometrics.'); }
      if (p === 70) { setStatusText('> MATCH FOUND. DECRYPTING DATA...'); speakText('Match found. Decrypting data.'); }
      if (p === 100) {
        setStatusText('> CLEARANCE GRANTED: WELCOME COMMANDER.');
        setIsGranted(true);
        speakText('Clearance granted. Welcome Commander.');
        clearInterval(timer);
        // Trigger hex shatter, then call onComplete
        setTimeout(() => setShattering(true), 800);
        setTimeout(onComplete, 2200);
      }
    }, interval);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian">
      {/* Biometric UI — above hex tiles always */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center font-mono text-cyan cursor-pointer"
        onClick={() => speakText('Initiating clearance protocol. Stand by.')}
      >
        <div className="absolute top-4 right-6 text-xs text-cyan/40 animate-pulse">
          {`[ CLICK TO ENABLE AUDIO ]`}
        </div>

        {/* Biometric Scanner */}
        <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-cyan/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-8 rounded-full border border-cyan/20" />
          {/* Icon */}
          <svg className="w-14 h-14 text-cyan opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10"/>
            <path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6"/>
            <path d="M12 14a2 2 0 0 0 0-4"/>
          </svg>
          {/* Scan laser */}
          <motion.div
            className="absolute left-2 right-2 h-[2px] bg-cyan"
            style={{ boxShadow: '0 0 10px 4px rgba(0,243,255,0.8)' }}
            animate={{ top: ['8%', '92%', '8%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Progress */}
        <div className="text-center space-y-4">
          <div className="text-5xl font-sans font-bold tracking-widest text-cyan"
               style={{ textShadow: '0 0 20px rgba(0,243,255,0.9)' }}>
            {progress}%
          </div>

          <div className="w-64 h-1 bg-obsidian-light/50 rounded-full overflow-hidden border border-cyan/20">
            <motion.div
              className="h-full bg-cyan rounded-full"
              style={{ boxShadow: '0 0 10px rgba(0,243,255,0.8)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.div
            className={`text-sm tracking-wider ${isGranted ? 'text-alert-amber' : 'text-cyan/80'}`}
            animate={isGranted ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {statusText}
          </motion.div>
        </div>
      </div>

      {/* Hex tile grid — behind UI (z:10) */}
      {HEX_TILES.map(tile => (
        <HexTile key={tile.id} tile={tile} shattering={shattering} />
      ))}
    </div>
  );
}
