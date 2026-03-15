'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CLICKABLE_SELECTORS = 'a, button, input, textarea, select, [role="button"], [data-clickable]';

export default function TacticalCursor() {
  // Core (instant tracking)
  const coreX = useMotionValue(-100);
  const coreY = useMotionValue(-100);

  // Reticle (spring-delayed tracking)
  const springConfig = { stiffness: 280, damping: 25, mass: 0.5 };
  const reticleX = useSpring(coreX, springConfig);
  const reticleY = useSpring(coreY, springConfig);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const hoverTarget = useRef<HTMLElement | null>(null);

  // Detect touch / mobile — hide on touch devices
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmall = window.innerWidth < 768;
    setIsMobile(isTouch || isSmall);
  }, []);

  // Mouse move — track core instantly
  const handleMouseMove = useCallback((e: MouseEvent) => {
    coreX.set(e.clientX);
    coreY.set(e.clientY);
    if (!visible) setVisible(true);
  }, [coreX, coreY, visible]);

  // Hover detection — check if hovered element matches clickable selectors
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(CLICKABLE_SELECTORS)) {
      setHovered(true);
      hoverTarget.current = target.closest(CLICKABLE_SELECTORS) as HTMLElement;
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.relatedTarget as HTMLElement | null;
    if (!target || !target.closest(CLICKABLE_SELECTORS)) {
      setHovered(false);
      hoverTarget.current = null;
    }
  }, []);

  // Click pulse
  const handleMouseDown = useCallback(() => { setClicked(true); }, []);
  const handleMouseUp = useCallback(() => { setClicked(false); }, []);

  // Leave window → hide
  const handleMouseLeave = useCallback(() => setVisible(false), []);
  const handleMouseEnter = useCallback(() => setVisible(true), []);

  useEffect(() => {
    if (isMobile) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile, handleMouseMove, handleMouseOver, handleMouseOut, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter]);

  // Don't render on mobile/touch
  if (isMobile) return null;

  const coreSize = 6;
  const reticleSize  = hovered ? 48 : 32;
  const reticleColor = hovered ? '#ffb000' : '#00f3ff';

  return (
    <>
      {/* CSS to hide default cursor on desktop */}
      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      {/* Core — precise center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: coreX,
          y: coreY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          style={{
            width: coreSize,
            height: coreSize,
            background: '#00f3ff',
            boxShadow: '0 0 6px #00f3ff, 0 0 12px #00f3ff80',
          }}
          animate={{
            scale: clicked ? 0.4 : 1,
          }}
          transition={{ duration: 0.08 }}
        />
      </motion.div>

      {/* Reticle — outer targeting brackets with spring delay */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: reticleX,
          y: reticleY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            width: reticleSize,
            height: reticleSize,
            rotate: hovered ? 360 : 0,
          }}
          transition={
            hovered
              ? { rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, width: { duration: 0.2 }, height: { duration: 0.2 } }
              : { width: { duration: 0.2 }, height: { duration: 0.2 }, rotate: { duration: 0 } }
          }
          style={{ width: reticleSize, height: reticleSize }}
        >
          {/* 4 targeting brackets */}
          {/* Top-left */}
          <motion.div
            className="absolute top-0 left-0"
            style={{ width: '35%', height: '35%', borderTop: `2px solid ${reticleColor}`, borderLeft: `2px solid ${reticleColor}` }}
            animate={{ scale: clicked ? 0.7 : 1 }}
            transition={{ duration: 0.08 }}
          />
          {/* Top-right */}
          <motion.div
            className="absolute top-0 right-0"
            style={{ width: '35%', height: '35%', borderTop: `2px solid ${reticleColor}`, borderRight: `2px solid ${reticleColor}` }}
            animate={{ scale: clicked ? 0.7 : 1 }}
            transition={{ duration: 0.08 }}
          />
          {/* Bottom-left */}
          <motion.div
            className="absolute bottom-0 left-0"
            style={{ width: '35%', height: '35%', borderBottom: `2px solid ${reticleColor}`, borderLeft: `2px solid ${reticleColor}` }}
            animate={{ scale: clicked ? 0.7 : 1 }}
            transition={{ duration: 0.08 }}
          />
          {/* Bottom-right */}
          <motion.div
            className="absolute bottom-0 right-0"
            style={{ width: '35%', height: '35%', borderBottom: `2px solid ${reticleColor}`, borderRight: `2px solid ${reticleColor}` }}
            animate={{ scale: clicked ? 0.7 : 1 }}
            transition={{ duration: 0.08 }}
          />

          {/* Mini crosshair lines at center (only in normal state) */}
          {!hovered && (
            <>
              <div className="absolute left-1/2 top-[15%] w-px h-[18%] bg-cyan/30 -translate-x-1/2" />
              <div className="absolute left-1/2 bottom-[15%] w-px h-[18%] bg-cyan/30 -translate-x-1/2" />
              <div className="absolute top-1/2 left-[15%] h-px w-[18%] bg-cyan/30 -translate-y-1/2" />
              <div className="absolute top-1/2 right-[15%] h-px w-[18%] bg-cyan/30 -translate-y-1/2" />
            </>
          )}

          {/* Glow ring on hover */}
          {hovered && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 12px ${reticleColor}60, 0 0 24px ${reticleColor}30` }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
