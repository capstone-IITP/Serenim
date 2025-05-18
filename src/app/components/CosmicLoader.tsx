'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useLoading } from '../providers'

// Define types for the particle props
interface ParticleProps {
  position: [number, number, number];
  scale: number;
  speed: number;
}

// Particle animation within 3D canvas
function ParticleField() {
  const count = 400
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 4
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)
      
      temp.push({
        position: [
          radius * Math.sin(theta) * Math.cos(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(theta)
        ],
        scale: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.05 + 0.01
      })
    }
    return temp
  }, [])
  
  return (
    <group>
      {particles.map((particle, i) => (
        <Particle key={i} {...particle} />
      ))}
    </group>
  )
}

// Individual particle
function Particle({ position, scale, speed }: ParticleProps) {
  const mesh = useMemo(() => new THREE.Object3D(), [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    mesh.position.set(
      position[0] + Math.sin(time * speed) * 0.3,
      position[1] + Math.cos(time * speed) * 0.3,
      position[2] + Math.sin(time * speed + position[0]) * 0.3
    )
    mesh.scale.setScalar(scale * (1 + 0.1 * Math.sin(time * 2)))
  })
  
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={new THREE.Color().setHSL(0.7 + Math.random() * 0.2, 0.8, 0.6 + Math.random() * 0.4)} />
    </mesh>
  )
}

// Define types for the Effects component
interface EffectsProps {
  phase: string;
}

// Breathing sphere animation
function BreathingSphere() {
  const [phase, setPhase] = useState('inhale')
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale')
    }, 4000)
    return () => clearInterval(interval)
  }, [])
  
  useFrame((state) => {
    state.camera.position.z = 6 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5
    state.camera.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
  })
  
  return (
    <mesh>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshStandardMaterial 
        color="#7c3aed" 
        emissive="#4c1d95"
        emissiveIntensity={1.2}
        roughness={0.3}
        metalness={0.8} 
        transparent
        opacity={0.7}
      />
      <Effects phase={phase} />
    </mesh>
  )
}

// Glowing effects
function Effects({ phase }: EffectsProps) {
  const light = useMemo(() => new THREE.PointLight(), [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const breatheScale = phase === 'inhale' 
      ? 1 + Math.sin(time * 0.5) * 0.1 
      : 1 - Math.sin(time * 0.5) * 0.1
      
    light.intensity = 2 + Math.sin(time * 0.8) * 0.5
    light.color.setHSL(0.7, 0.8, 0.5 + 0.2 * Math.sin(time))
  })
  
  return (
    <>
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#8b5cf6" />
      <ambientLight intensity={0.4} />
      <primitive object={light} position={[2, 1, 4]} />
    </>
  )
}

// Main cosmic loader component
export default function CosmicLoader() {
  const [progress, setProgress] = useState(0)
  const { setIsLoading } = useLoading()
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 97) {
          clearInterval(interval)
          // Complete to 100% and then wait a moment before signaling completion
          setTimeout(() => {
            setProgress(100)
            // Give a small delay for the 100% state to be visible
            setTimeout(() => {
              setIsLoading(false)
            }, 400)
          }, 300)
          return 97
        }
        return prev + 2
      })
    }, 80)
    return () => clearInterval(interval)
  }, [setIsLoading])
  
  // Breathing instructions based on progress
  const breatheText = useMemo(() => {
    if (progress < 33) return "Breathe in slowly..."
    if (progress < 66) return "Hold your breath..."
    return "Release and let go..."
  }, [progress])
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
        />
        
        {/* 3D Canvas */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <BreathingSphere />
            <ParticleField />
          </Canvas>
        </div>
        
        {/* Loading text and progress */}
        <motion.div
          className="absolute text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-white text-glow-strong mb-2">
            {breatheText}
          </h2>
          
          <motion.div 
            className="text-purple-200/60 text-sm font-light"
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Prepare for mindfulness
          </motion.div>
          
          {/* Progress circle */}
          <div className="mt-8 relative h-3 w-40 mx-auto">
            <div className="absolute inset-0 rounded-full overflow-hidden bg-purple-900/30">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
} 