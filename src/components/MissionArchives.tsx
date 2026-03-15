'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Float } from '@react-three/drei';
import Image from 'next/image';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// Project Data
// ----------------------------------------------------------------------
const PROJECTS = [
  {
    id: 's4holidays',
    title: 's4holidays',
    tech: 'MERN Stack',
    desc: 'Full-stack client website built collaboratively. Features dynamic listings and real-time booking.',
    image: '/project_s4holidays.png',
  },
  {
    id: 'stress_management',
    title: 'Stress Management Tool',
    tech: 'React / Node',
    desc: 'Report generator built during a hackathon for law enforcement. Provides AI-driven stress analysis reports.',
    image: '/project_stress.png',
  },
  {
    id: 'sclera_extraction',
    title: 'Sclera Extraction',
    tech: 'Python / OpenCV',
    desc: 'Computer vision pipeline utilizing Python and OpenCV for precise sclera region detection and extraction.',
    image: '/project_sclera.png',
  }
];

// ----------------------------------------------------------------------
// 3D Components
// ----------------------------------------------------------------------

function Drone({ targetPosition, onRetrieved }: { targetPosition: THREE.Vector3 | null, onRetrieved: () => void }) {
  const droneRef = useRef<THREE.Group>(null);
  const [hasData, setHasData] = useState(false);
  
  // Starting position in the "foreground"
  const homePosition = new THREE.Vector3(0, 0, 3);

  useFrame((state, delta) => {
    if (!droneRef.current) return;

    // Very simple state machine for the drone pathfinding
    if (targetPosition && !hasData) {
        // Fly to data cluster
        droneRef.current.position.lerp(targetPosition, delta * 2);
        
        // Look at target
        droneRef.current.lookAt(targetPosition);

        // If close enough to target, "grab" it
        if (droneRef.current.position.distanceTo(targetPosition) < 0.5) {
            setHasData(true);
        }
    } else if (targetPosition && hasData) {
        // Fly back home
        droneRef.current.position.lerp(homePosition, delta * 2);
        
        // Look at home
        droneRef.current.lookAt(homePosition);

        // If returned home, trigger UI
        if (droneRef.current.position.distanceTo(homePosition) < 0.5) {
            onRetrieved();
        }
    } else {
        // Idling at home
        droneRef.current.position.lerp(homePosition, delta * 2);
        droneRef.current.rotation.y += delta * 0.5; // Idle spin
    }
  });

  return (
    <group ref={droneRef} position={[0, 0, 3]}>
       {/* Drone Body */}
       <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
         <Box args={[0.4, 0.2, 0.6]}>
            <meshStandardMaterial color="#161e30" emissive="#00f3ff" emissiveIntensity={0.2} wireframe />
         </Box>
         {/* Drone Core Glow */}
         <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
            <meshBasicMaterial color={hasData ? "#ffb000" : "#00f3ff"} />
         </Sphere>
       </Float>
    </group>
  );
}

function DataClusters() {
   // Static representations of data in the vault
   return (
       <group position={[0, 0, -4]}>
           <Box args={[1, 2, 1]} position={[-3, 0, 0]}>
               <meshStandardMaterial color="#0066ff" wireframe opacity={0.3} transparent />
           </Box>
           <Box args={[1, 3, 1]} position={[0, 0, -2]}>
               <meshStandardMaterial color="#00f3ff" wireframe opacity={0.3} transparent />
           </Box>
           <Box args={[1, 1.5, 1]} position={[3, 0, 0]}>
               <meshStandardMaterial color="#ffb000" wireframe opacity={0.3} transparent />
           </Box>
       </group>
   );
}


// ----------------------------------------------------------------------
// Main Section Component
// ----------------------------------------------------------------------

export default function MissionArchives() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [droneTarget, setDroneTarget] = useState<THREE.Vector3 | null>(null);
  const [showUI, setShowUI] = useState(false);

  const handleProjectSelect = (idx: number) => {
      setShowUI(false);
      setActiveProject(PROJECTS[idx].id);
      
      // Determine dummy target position based on index to simulate flying to a specific cluster
      const xMap = [-3, 0, 3];
      const zMap = [-4, -6, -4];
      setDroneTarget(new THREE.Vector3(xMap[idx], 0, zMap[idx]));
  };

  const currentProjectData = PROJECTS.find(p => p.id === activeProject);

  return (
    <section id="mission-archives" className="min-h-screen py-24 px-6 md:px-20 relative">
      
      {/* Header */}
      <div className="mb-12 border-l-4 border-plasma-blue pl-4">
        <h2 className="text-3xl md:text-5xl font-sans font-bold text-plasma-blue tracking-widest uppercase">
          Mission Archives
        </h2>
        <div className="text-foreground/70 font-mono mt-2 text-sm uppercase">Section 04 // Data Vault</div>
      </div>

      <div className="flex flex-col lg:flex-row h-[600px] border border-cyan/20 bg-obsidian-light/30 rounded-sm overflow-hidden backdrop-blur-sm relative">
          
          {/* Left: Terminal List */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-cyan/20 p-6 flex flex-col bg-obsidian/80 z-10">
              <div className="font-mono text-cyan text-sm mb-6 border-b border-cyan/30 pb-2">
                  {`> SELECT LOG FOR RETRIEVAL...`}
              </div>
              <ul className="space-y-4">
                  {PROJECTS.map((proj, idx) => (
                      <li key={proj.id}>
                          <button
                              onClick={() => handleProjectSelect(idx)}
                              className={`w-full text-left font-mono p-3 rounded-sm transition-all duration-300 border-l-2
                                  ${activeProject === proj.id 
                                      ? 'bg-plasma-blue/20 border-plasma-blue text-white shadow-[inset_0_0_10px_rgba(0,102,255,0.3)]' 
                                      : 'border-transparent text-foreground/70 hover:bg-cyan/10 hover:border-cyan hover:text-cyan'
                                  }`}
                          >
                              {proj.title}
                          </button>
                      </li>
                  ))}
              </ul>
          </div>

          {/* Right: 3D Vault Canvas */}
          <div className="w-full lg:w-2/3 h-full relative">
              <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} color="#00f3ff" intensity={1} />
                  
                  {/* Grid floor for sci-fi look */}
                  <gridHelper args={[20, 20, '#00f3ff', '#161e30']} position={[0, -2, 0]} />
                  
                  <DataClusters />
                  <Drone 
                      targetPosition={droneTarget} 
                      onRetrieved={() => setShowUI(true)} 
                  />
                  
                  <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
              </Canvas>

              {/* Holographic UI Overlay (Appears when drone returns) */}
              {showUI && currentProjectData && (
                  <div className="absolute inset-x-4 md:inset-x-10 bottom-4 md:bottom-10 bg-obsidian/95 border border-alert-amber p-4 md:p-6 rounded-sm backdrop-blur-md shadow-[0_0_20px_rgba(255,176,0,0.3)] 
                                  animate-in fade-in slide-in-from-bottom-5 duration-500 font-mono">
                       <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-alert-amber">{currentProjectData.title}</h3>
                          <span className="text-xs bg-alert-amber/20 text-alert-amber px-2 py-1 rounded">DATA RETRIEVED</span>
                       </div>
                       {/* Project Image */}
                       <div className="mb-3 rounded overflow-hidden border border-alert-amber/30 w-full h-28 md:h-36 relative">
                           <Image src={currentProjectData.image} alt={currentProjectData.title} fill className="object-cover opacity-80 hover:opacity-100 transition-opacity" />
                       </div>
                       <div className="mb-1 text-sm">
                           <span className="text-cyan/70">TECH_STACK: </span><span className="text-white">{currentProjectData.tech}</span>
                       </div>
                       <div className="text-sm">
                           <span className="text-cyan/70">DETAILS: </span><span className="text-white/90">{currentProjectData.desc}</span>
                       </div>
                  </div>
              )}
          </div>

      </div>

    </section>
  );
}
