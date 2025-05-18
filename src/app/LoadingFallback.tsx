'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Renamed component to avoid conflict with Next.js loading conventions
export default function LoadingFallback() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 80)
    
    return () => clearInterval(interval)
  }, [])
  
  // Array of stars for the background
  const stars = Array(20).fill(0)

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      {/* Cosmic background with stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              backgroundColor: `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 100}, ${246 + Math.random() * 10}, ${Math.random() * 0.7 + 0.3})`,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(139, 92, 246, 0.7)`
            }}
          />
        ))}
      </div>

      {/* Central breathing circle */}
      <div className="relative z-10 mb-8 flex items-center justify-center">
        <motion.div
          className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"
          animate={{ 
            scale: [0.8, 1.1, 0.8],
            boxShadow: [
              '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
              '0 0 50px rgba(139, 92, 246, 0.7), 0 0 100px rgba(139, 92, 246, 0.4)',
              '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="w-28 h-28 rounded-full bg-purple-900/40 backdrop-blur-lg flex items-center justify-center border border-purple-300/20"
            animate={{
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <motion.svg 
              className="w-14 h-14 text-purple-100/80" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              animate={{
                rotateZ: [0, 180, 360],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.div>
        </motion.div>
        
        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-400/30"
          animate={{
            scale: [1, 1.6],
            opacity: [0.7, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full border border-indigo-400/20"
          animate={{
            scale: [1, 1.8],
            opacity: [0.5, 0]
          }}
          transition={{
            duration: 2,
            delay: 0.3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Text and progress */}
      <motion.div
        className="glass-card px-10 py-5 rounded-2xl max-w-xs text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-medium text-white mb-2 text-glow">
          {progress < 50 ? "Finding your center..." : "Almost ready..."}
        </h2>
        
        <p className="text-sm text-purple-200/70 mb-3">
          Take a deep breath with us
        </p>
        
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-1">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </div>
  )
} 