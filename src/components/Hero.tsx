'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';

const bootSequenceCode = [
  "INITIALIZING KERNEL...",
  "LOADING CORE MODULES: OK",
  "ESTABLISHING NEURAL LINK: OK",
  "BYPASSING SECURITY PROTOCOLS: COMPLETE",
  "ACCESSING COMMAND CENTER TIER 1...",
];

export default function Hero() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  // Typing effect logic
  useEffect(() => {
    if (bootComplete) return;

    if (currentLineIndex < bootSequenceCode.length) {
      const currentLineText = bootSequenceCode[currentLineIndex];
      
      if (currentCharIndex < currentLineText.length) {
        const timeout = setTimeout(() => {
          setTypedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[currentLineIndex]) newLines[currentLineIndex] = "";
            newLines[currentLineIndex] += currentLineText[currentCharIndex];
            return newLines;
          });
          setCurrentCharIndex((prev) => prev + 1);
        }, 30); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 400); // Pause between lines
        return () => clearTimeout(timeout);
      }
    } else {
      setTimeout(() => setBootComplete(true), 500);
    }
  }, [currentLineIndex, currentCharIndex, bootComplete]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 overflow-hidden">
      
      {/* Terminal Boot Sequence (top left) */}
      <div className="absolute top-10 left-6 md:left-20 font-mono text-cyan/70 text-xs md:text-sm">
        {typedLines.map((line, idx) => (
          <div key={idx}>{`> ${line}`}</div>
        ))}
        {!bootComplete && currentLineIndex < bootSequenceCode.length && (
          <motion.div
            className="inline-block w-2 h-4 bg-cyan ml-1 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        )}
      </div>

      <div className="max-w-4xl z-10 mt-20">
        <motion.h1 
          className="font-sans text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan to-plasma-blue drop-shadow-[0_0_15px_rgba(0,243,255,0.6)] uppercase tracking-tighter"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }} // Delay until boot sequence is mostly done
        >
          Welcome to the Command Center.
        </motion.h1>
        
        <motion.div
          className="mt-6 font-mono text-lg md:text-xl text-foreground/80 border-l-2 border-alert-amber pl-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 3 }}
        >
          <p>MSc Software Technology | AI/ML Research Intern | Full-Stack Developer</p>
        </motion.div>

        <motion.div 
          className="mt-12 flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5 }}
        >
          {/* Mission Brief Button (Scroll) */}
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 py-3 font-mono font-bold text-obsidian bg-cyan overflow-hidden rounded-sm transition-transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center gap-2">
              [ Initiate Mission Brief ] <ChevronDown className="w-4 h-4" />
            </span>
          </button>

          {/* Access Data Slate Button (Resume) */}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="group relative px-6 py-3 font-mono font-bold text-cyan border border-cyan/50 hover:border-cyan overflow-hidden rounded-sm transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:bg-cyan/10">
            <span className="relative flex items-center gap-2">
              [ Access Data Slate ] <FileText className="w-4 h-4 group-hover:text-plasma-blue transition-colors" />
            </span>
          </a>
        </motion.div>
      </div>
      
      {/* Decorative Grid Lines */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="absolute top-0 right-20 w-[1px] h-full bg-gradient-to-b from-transparent via-plasma-blue/20 to-transparent" />
    </section>
  );
}
