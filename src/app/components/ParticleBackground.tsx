'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Particle props type
interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  type: 'star' | 'dust' | 'meteor'
  delay: number
  color: string
}

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([])
  
  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const newParticles: Particle[] = []
      // Stars
      const starCount = 30
      
      for (let i = 0; i < starCount; i++) {
        // Randomly select star color
        const colors = [
          'rgb(255, 255, 255)', // white
          'rgb(199, 210, 254)', // indigo-200
          'rgb(216, 180, 254)', // purple-200
          'rgb(224, 231, 255)', // slight blue tint
        ]
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        newParticles.push({
          id: i,
          x: Math.random() * 100, // percentage position
          y: Math.random() * 100,
          size: Math.random() * 0.25 + 0.1, // between 0.1 and 0.35
          opacity: Math.random() * 0.5 + 0.2, // between 0.2 and 0.7
          duration: Math.random() * 15 + 5, // between 5 and 20 seconds
          type: 'star',
          delay: Math.random() * 5,
          color
        })
      }
      
      // Dust particles
      const dustCount = 15
      for (let i = 0; i < dustCount; i++) {
        newParticles.push({
          id: starCount + i,
          x: Math.random() * 100, 
          y: Math.random() * 100,
          size: Math.random() * 1 + 0.5, // larger dust clouds
          opacity: Math.random() * 0.08 + 0.02, // very subtle
          duration: Math.random() * 40 + 20, // slower
          type: 'dust',
          delay: Math.random() * 2,
          color: 'rgb(139, 92, 246)' // purple-500
        })
      }
      
      // Occasional meteors
      const meteorCount = 3;
      for (let i = 0; i < meteorCount; i++) {
        newParticles.push({
          id: starCount + dustCount + i,
          x: Math.random() * 100,
          y: Math.random() * 50, // only in upper half
          size: Math.random() * 0.2 + 0.1,
          opacity: 0.7,
          duration: Math.random() * 3 + 2, // fast
          type: 'meteor',
          delay: Math.random() * 10 + i * 10, // delay between meteors
          color: 'rgb(255, 255, 255)'
        })
      }
      
      setParticles(newParticles)
    }
    
    generateParticles()
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => {
        if (particle.type === 'star') {
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}rem`,
                height: `${particle.size}rem`,
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 3}px rgba(255, 255, 255, 0.8)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
                scale: [0.7, 1, 0.7]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          )
        }
        
        if (particle.type === 'dust') {
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full opacity-10"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}rem`,
                height: `${particle.size}rem`,
                background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              }}
              animate={{
                x: [0, Math.random() * 30 - 15],
                y: [0, Math.random() * 30 - 15],
                opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          )
        }
        
        if (particle.type === 'meteor') {
          return (
            <motion.div
              key={particle.id}
              className="absolute h-px bg-white origin-top-left"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${Math.random() * 100 + 50}px`,
                opacity: particle.opacity,
                boxShadow: '0 0 4px #fff',
                transform: `rotate(${Math.random() * 45 + 15}deg)`
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, particle.opacity, 0],
                scaleX: [0, 1, 1],
                y: ['0%', `${Math.random() * 40 + 10}%`],
                x: ['0%', `${Math.random() * 20 + 5}%`]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                repeatDelay: 20,
                ease: "easeOut"
              }}
            />
          )
        }
        
        return null;
      })}
    </div>
  )
}

export default ParticleBackground 