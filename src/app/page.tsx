'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import GalaxyMap from '@/components/GalaxyMap';
import Skills from '@/components/Skills';
import CommsArray from '@/components/CommsArray';
import { AnimatePresence } from 'framer-motion';

function SectionDivider({ color = '#00f3ff' }: { color?: string }) {
  return (
    <div className="relative mx-auto max-w-4xl px-6 md:px-0 flex items-center gap-4 py-2">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}40)` }} />
      <div className="font-mono text-xs opacity-30" style={{ color }}>✦</div>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${color}40)` }} />
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="flex flex-col min-h-screen">
          <Hero />
          <SectionDivider color="#00f3ff" />
          <About />
          <SectionDivider color="#ffb000" />
          <Experience />
          <SectionDivider color="#0066ff" />
          <GalaxyMap />
          <SectionDivider color="#00f3ff" />
          <Skills />
          <SectionDivider color="#ffb000" />
          <CommsArray />
        </div>
      )}
    </>
  );
}

