'use client';
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

/* ─── Starfield (R3F) ─── */
function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 25;
      ref.current.rotation.y -= delta / 35;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent color="#00f3ff" size={0.04}
          sizeAttenuation depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

/* ─── Static meteor data (computed once outside component to be stable) ─── */
// Use deterministic values — no Math.random() in render
const METEOR_DATA = [
  { top: '5%',  left: '80%', delay: '0s',   dur: '5s',  size: '2px', len: '100px' },
  { top: '12%', left: '50%', delay: '2s',   dur: '4s',  size: '1px', len: '80px'  },
  { top: '3%',  left: '30%', delay: '1s',   dur: '6s',  size: '2px', len: '120px' },
  { top: '20%', left: '70%', delay: '3s',   dur: '3s',  size: '1px', len: '70px'  },
  { top: '8%',  left: '90%', delay: '4s',   dur: '5s',  size: '2px', len: '110px' },
  { top: '15%', left: '20%', delay: '0.5s', dur: '7s',  size: '1px', len: '90px'  },
  { top: '2%',  left: '60%', delay: '6s',   dur: '4s',  size: '2px', len: '85px'  },
  { top: '25%', left: '40%', delay: '1.5s', dur: '5s',  size: '1px', len: '75px'  },
  { top: '10%', left: '10%', delay: '7s',   dur: '6s',  size: '2px', len: '130px' },
  { top: '18%', left: '85%', delay: '2.5s', dur: '3s',  size: '1px', len: '65px'  },
  { top: '6%',  left: '45%', delay: '5s',   dur: '8s',  size: '2px', len: '95px'  },
  { top: '30%', left: '25%', delay: '3.5s', dur: '4s',  size: '1px', len: '80px'  },
  { top: '1%',  left: '75%', delay: '8s',   dur: '5s',  size: '2px', len: '105px' },
  { top: '22%', left: '55%', delay: '4.5s', dur: '7s',  size: '1px', len: '70px'  },
  { top: '14%', left: '15%', delay: '9s',   dur: '4s',  size: '2px', len: '115px' },
  { top: '7%',  left: '65%', delay: '0.8s', dur: '6s',  size: '1px', len: '88px'  },
  { top: '28%', left: '35%', delay: '10s',  dur: '5s',  size: '2px', len: '92px'  },
  { top: '4%',  left: '95%', delay: '5.5s', dur: '3s',  size: '1px', len: '60px'  },
];

/* Static dot data for background stars */
const STATIC_STARS = Array.from({ length: 80 }, (_, i) => {
  // Deterministic pseudo-random using index
  const seed1 = (i * 7919 + 1) % 100 / 100;
  const seed2 = (i * 6271 + 3) % 100 / 100;
  const seed3 = (i * 4523 + 7) % 100 / 100;
  return {
    left: `${seed1 * 100}%`,
    top:  `${seed2 * 100}%`,
    size: seed3 < 0.2 ? '2px' : '1px',
    opacity: 0.2 + seed3 * 0.5,
  };
});

/* ─── Spaceship SVG ─── */
function ShipSVG({ scale = 1, color = '#00f3ff' }: { scale?: number; color?: string }) {
  return (
    <svg width={60 * scale} height={28 * scale} viewBox="0 0 60 28" fill="none"
         style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
      <ellipse cx="30" cy="18" rx="28" ry="8" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      <ellipse cx="38" cy="13" rx="10" ry="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="0.8"/>
      <ellipse cx="8" cy="18" rx="4" ry="3" fill={color} fillOpacity="0.5"/>
      <ellipse cx="15" cy="20" rx="3" ry="2" fill={color} fillOpacity="0.4"/>
      <path d="M4 18 Q0 22 2 26 Q6 22 8 18" fill="#ffb000" fillOpacity="0.6"/>
    </svg>
  );
}

/* ─── Alien silhouette ─── */
function AlienSilhouette() {
  return (
    <div className="absolute bottom-0 right-8 pointer-events-none select-none"
         style={{ animation: 'alienPulse 6s ease-in-out infinite', opacity: 0.05 }}>
      <svg width="220" height="400" viewBox="0 0 220 400" fill="none">
        <ellipse cx="110" cy="90" rx="70" ry="85" fill="#00f3ff"/>
        <ellipse cx="78"  cy="80" rx="28" ry="20" fill="#0b0f19"/>
        <ellipse cx="142" cy="80" rx="28" ry="20" fill="#0b0f19"/>
        <ellipse cx="78"  cy="80" rx="18" ry="13" fill="#00f3ff" fillOpacity="0.6"/>
        <ellipse cx="142" cy="80" rx="18" ry="13" fill="#00f3ff" fillOpacity="0.6"/>
        <rect x="95" y="170" width="30" height="40" rx="8" fill="#00f3ff"/>
        <ellipse cx="110" cy="265" rx="55" ry="70" fill="#00f3ff"/>
        <path d="M55 230 Q10 270 20 320" stroke="#00f3ff" strokeWidth="16" strokeLinecap="round" fill="none"/>
        <path d="M165 230 Q210 270 200 320" stroke="#00f3ff" strokeWidth="16" strokeLinecap="round" fill="none"/>
        <rect x="82" y="325" width="18" height="70" rx="9" fill="#00f3ff"/>
        <rect x="120" y="325" width="18" height="70" rx="9" fill="#00f3ff"/>
      </svg>
    </div>
  );
}

/* ─── Main export ─── */
export default function WarpSpeedBackground() {
  // Prevent hydration mismatch — only show CSS decorative elements after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-obsidian pointer-events-none overflow-hidden">
      {/* R3F starfield — suppressed during SSR via Canvas */}
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Starfield />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian/90 pointer-events-none" />

      {/* Cockpit corner brackets */}
      <div className="absolute top-4 left-4 w-28 h-28 border-t-2 border-l-2 border-cyan/25 rounded-tl-2xl" />
      <div className="absolute top-4 right-4 w-28 h-28 border-t-2 border-r-2 border-cyan/25 rounded-tr-2xl" />
      <div className="absolute bottom-4 left-4 w-28 h-28 border-b-2 border-l-2 border-cyan/25 rounded-bl-2xl" />
      <div className="absolute bottom-4 right-4 w-28 h-28 border-b-2 border-r-2 border-cyan/25 rounded-br-2xl" />

      {/* Client-only dynamic elements  */}
      {mounted && (
        <>
          {/* Meteor shower (deterministic data, no Math.random in render) */}
          {METEOR_DATA.map((m, i) => (
            <div key={i} className="absolute rounded-full bg-white"
                 style={{
                   top: m.top, left: m.left,
                   width: m.size, height: m.size,
                   boxShadow: `0 0 4px #fff, 0 0 8px #00f3ff, -${m.len} 0 ${parseInt(m.len)/4}px rgba(0,243,255,0.15)`,
                   animation: `meteor ${m.dur} ${m.delay} linear infinite`,
                   opacity: 0,
                 }}
            />
          ))}

          {/* Static background star dots */}
          {STATIC_STARS.map((s, i) => (
            <div key={i} className="absolute rounded-full bg-white pointer-events-none"
                 style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.opacity * 0.4 }}
            />
          ))}

          {/* Floating spaceships */}
          <div className="absolute" style={{ top: '18%', animation: 'shipDrift 40s 2s linear infinite' }}>
            <ShipSVG scale={1.3} color="#00f3ff" />
          </div>
          <div className="absolute" style={{ top: '55%', animation: 'shipDrift2 65s 10s linear infinite' }}>
            <ShipSVG scale={0.7} color="#0066ff" />
          </div>

          {/* Alien silhouette */}
          <AlienSilhouette />
        </>
      )}
    </div>
  );
}
