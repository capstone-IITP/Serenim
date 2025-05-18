'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import * as Tone from 'tone'

interface BreathingSphereProps {
  phase: 'inhale' | 'hold' | 'exhale';
  isActive: boolean;
  scaleMultiplier?: number;
}

// Core breathing sphere that scales with the breathing pattern
const BreathingSphere = ({ phase, isActive, scaleMultiplier = 1 }: BreathingSphereProps) => {
  // Create synced animation values based on breathing phase
  const { scale, emissiveIntensity, speed } = useSpring({
    scale: isActive 
      ? phase === 'inhale' ? [1.2 * scaleMultiplier, 1.2 * scaleMultiplier, 1.2 * scaleMultiplier]
      : phase === 'hold' ? [1.2 * scaleMultiplier, 1.2 * scaleMultiplier, 1.2 * scaleMultiplier] 
      : [1 * scaleMultiplier, 1 * scaleMultiplier, 1 * scaleMultiplier]
      : [1.1 * scaleMultiplier, 1.1 * scaleMultiplier, 1.1 * scaleMultiplier],
    emissiveIntensity: isActive
      ? phase === 'inhale' ? 1.0
      : phase === 'hold' ? 1.2
      : 0.7
      : 0.5,
    speed: isActive
      ? phase === 'inhale' ? 3
      : phase === 'hold' ? 1
      : 5
      : 2,
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    }
  })
  
  // Create rotating reference
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.003 * speed.get()
      sphereRef.current.rotation.z += 0.001 * speed.get()
    }
  })
  
  return (
    <animated.mesh ref={sphereRef} scale={scale as any}>
      <sphereGeometry args={[1, 128, 128]} />
      <animated.meshPhysicalMaterial 
        roughness={0.2} 
        metalness={0.9}
        color="#9333ea"
        emissive="#6b21a8"
        emissiveIntensity={emissiveIntensity}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        wireframe={false}
      />
    </animated.mesh>
  )
}

interface OrbitingParticlesProps {
  count?: number;
  phase: 'inhale' | 'hold' | 'exhale';
  isActive: boolean;
}

// Orbiting particles that respond to breathing
const OrbitingParticles = ({ count = 300, phase, isActive }: OrbitingParticlesProps) => {
  const particlesRef = useRef<THREE.Points>(null)
  const [positions, setPositions] = useState<THREE.Vector3[]>([])
  const [phaseChanged, setPhaseChanged] = useState<number>(0)
  
  // Initialize particles
  useEffect(() => {
    const newPositions = []
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 2
      
      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(theta)
      
      newPositions.push(new THREE.Vector3(x, y, z))
    }
    setPositions(newPositions)
  }, [count])
  
  // Detect phase changes for particle effects
  useEffect(() => {
    setPhaseChanged(prev => prev + 1)
    
    // Play sounds on phase change
    if (isActive) {
      const tone = new Tone.Synth({
        oscillator: {
          type: phase === 'inhale' ? 'sine' : phase === 'hold' ? 'triangle' : 'sine4'
        },
        envelope: {
          attack: 0.2,
          decay: 0.9,
          sustain: 0.2,
          release: 1.5,
        }
      }).toDestination()
      
      const note = phase === 'inhale' ? 'F4' : phase === 'hold' ? 'A4' : 'D4'
      const duration = phase === 'inhale' ? '8n' : phase === 'hold' ? '16n' : '8n'
      const volume = -25 // quiet background sound
      
      tone.volume.value = volume
      tone.triggerAttackRelease(note, duration)
    }
  }, [phase, isActive])
  
  // Animate particles
  useFrame(({ clock }) => {
    if (!particlesRef.current) return
    
    const particlePositions = particlesRef.current.geometry.attributes.position
    
    for (let i = 0; i < particlePositions.count; i++) {
      const i3 = i * 3
      const x = particlePositions.array[i3]
      const y = particlePositions.array[i3 + 1]
      const z = particlePositions.array[i3 + 2]
      
      // Move particles based on breathing phase
      if (isActive) {
        if (phase === 'inhale') {
          // Particles move slightly inward during inhale
          particlePositions.array[i3] = x * 0.998
          particlePositions.array[i3 + 1] = y * 0.998
          particlePositions.array[i3 + 2] = z * 0.998
        } else if (phase === 'exhale') {
          // Particles move outward during exhale
          particlePositions.array[i3] = x * 1.002
          particlePositions.array[i3 + 1] = y * 1.002
          particlePositions.array[i3 + 2] = z * 1.002
        }
        
        // Add some gentle floating movement
        const time = clock.getElapsedTime() * 0.5
        const offset = i * 0.01
        particlePositions.array[i3] += Math.sin(time + offset) * 0.002
        particlePositions.array[i3 + 1] += Math.cos(time + offset) * 0.002
        particlePositions.array[i3 + 2] += Math.sin(time + offset * 0.7) * 0.002
      }
    }
    
    particlePositions.needsUpdate = true
  })
  
  // Spring animation for particle size and opacity
  const { size, opacity, color } = useSpring({
    size: isActive 
      ? phase === 'inhale' ? 0.03 
      : phase === 'hold' ? 0.035
      : 0.04
      : 0.03,
    opacity: isActive 
      ? phase === 'inhale' ? 0.7
      : phase === 'hold' ? 0.9
      : 0.6
      : 0.5,
    color: isActive
      ? phase === 'inhale' ? '#9333ea' 
      : phase === 'hold' ? '#a855f7'
      : '#8b5cf6'
      : '#6b21a8'
  })
  
  return positions.length > 0 && (
    <animated.points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length}
          array={new Float32Array(positions.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <animated.pointsMaterial
        size={size}
        transparent
        opacity={opacity}
        color={color}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </animated.points>
  )
}

interface EnergyRingsProps {
  phase: 'inhale' | 'hold' | 'exhale';
  isActive: boolean;
}

// Energy rings that expand during exhale
const EnergyRings = ({ phase, isActive }: EnergyRingsProps) => {
  interface Ring {
    id: number;
    scale: number;
    opacity: number;
    createdAt: number;
  }

  const [rings, setRings] = useState<Ring[]>([])
  
  // Create new ring on exhale
  useEffect(() => {
    if (phase === 'exhale' && isActive) {
      // Add a new ring that will expand outward
      const newRing = {
        id: Date.now(),
        scale: 1.2,
        opacity: 0.8,
        createdAt: Date.now()
      }
      setRings(prev => [...prev, newRing])
    }
  }, [phase, isActive])
  
  // Animate and remove rings
  useFrame(() => {
    setRings(prevRings => 
      prevRings
        .map(ring => ({
          ...ring,
          scale: ring.scale + 0.03,
          opacity: ring.opacity - 0.02
        }))
        .filter(ring => ring.opacity > 0)
    )
  })
  
  return (
    <>
      {rings.map((ring) => (
        <mesh key={ring.id} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.scale - 0.05, ring.scale, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  )
}

// Aura effect
interface AuraProps {
  phase: 'inhale' | 'hold' | 'exhale';
  isActive: boolean;
}

const Aura = ({ phase, isActive }: AuraProps) => {
  const { scale, opacity } = useSpring({
    scale: isActive 
      ? phase === 'inhale' ? 2.2
      : phase === 'hold' ? 2.5
      : 3.0
      : 2.4,
    opacity: isActive
      ? phase === 'inhale' ? 0.15
      : phase === 'hold' ? 0.2
      : 0.1
      : 0.15
  })
  
  return (
    <animated.mesh scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <animated.meshBasicMaterial
        color="#9333ea"
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </animated.mesh>
  )
}

// Main component
interface InteractiveSphereProps {
  breathingPhase: 'inhale' | 'hold' | 'exhale';
  isActive: boolean;
}

const InteractiveSphere = ({ breathingPhase, isActive }: InteractiveSphereProps) => {
  interface MousePosition {
    x: number;
    y: number;
  }

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track mouse position for interactive lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      setMousePosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <div ref={containerRef} className="w-full h-[500px] rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={['#000']} />
        
        {/* Ambient light */}
        <ambientLight intensity={0.2} />
        
        {/* Main directional light */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          color="#a855f7" 
        />
        
        {/* Interactive light follows mouse */}
        <pointLight
          position={[mousePosition.x * 10, mousePosition.y * 10, 4]}
          intensity={2}
          color="#d8b4fe"
          distance={15}
        />
        
        {/* Main sphere */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <BreathingSphere phase={breathingPhase} isActive={isActive} />
          <Aura phase={breathingPhase} isActive={isActive} />
        </Float>
        
        {/* Orbiting particles */}
        <OrbitingParticles phase={breathingPhase} isActive={isActive} count={300} />
        
        {/* Energy rings */}
        <EnergyRings phase={breathingPhase} isActive={isActive} />
        
        {/* Camera controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Overlay information */}
      <div className="absolute bottom-4 left-4 text-purple-200/40 text-xs">
        Interactive 3D Visualization • Move mouse to influence the energy field
      </div>
    </div>
  )
}

export default InteractiveSphere 