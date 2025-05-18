'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ControlButton from './ControlButton'

// Constants for animation timing
const INHALE_DURATION = 4 // 4 seconds to inhale
const HOLD_DURATION = 2 // 2 seconds to hold breath
const EXHALE_DURATION = 6 // 6 seconds to exhale

interface BreathingAnimationProps {
  onPhaseChange?: (phase: 'inhale' | 'hold' | 'exhale') => void;
  onActiveChange?: (isActive: boolean) => void;
  compact?: boolean;
}

const BreathingAnimation = ({ 
  onPhaseChange, 
  onActiveChange,
  compact = false 
}: BreathingAnimationProps) => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [countdown, setCountdown] = useState(INHALE_DURATION)
  const [completedCycles, setCompletedCycles] = useState(0)
  const [isActive, setIsActive] = useState(true)
  
  // Manage breathing cycle
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isActive) {
      interval = setInterval(() => {
        setCountdown((prevCount) => {
          // When countdown reaches 0, switch to next phase
          if (prevCount <= 1) {
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold')
              return HOLD_DURATION
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale')
              return EXHALE_DURATION
            } else {
              setBreathingPhase('inhale')
              setCompletedCycles(prev => prev + 1)
              return INHALE_DURATION
            }
          }
          return prevCount - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [breathingPhase, isActive])

  // Notify parent component about phase/active changes
  useEffect(() => {
    if (onPhaseChange) {
      onPhaseChange(breathingPhase)
    }
  }, [breathingPhase, onPhaseChange])
  
  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isActive)
    }
  }, [isActive, onActiveChange])
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsActive(prev => !prev)
      } else if (e.code === 'Escape') {
        handleReset()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Get instruction text based on current phase
  const getInstructionText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Inhale slowly'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Exhale slowly'
      default:
        return ''
    }
  }

  const handleReset = () => {
    setBreathingPhase('inhale')
    setCountdown(INHALE_DURATION)
    setCompletedCycles(0)
    setIsActive(true)
  }

  const toggleActive = () => {
    setIsActive(!isActive)
  }

  // Render compact version when used with 3D view
  if (compact) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-purple-200 mb-1">
              {isActive ? getInstructionText() : 'Paused'}
            </h2>
            <div className="text-white/90 text-xl">{countdown}</div>
          </div>
          
          <div className="flex space-x-2">
            <ControlButton 
              onClick={toggleActive} 
              active={isActive}
              className="shadow-lg"
            >
              {isActive ? 'Pause' : 'Resume'}
            </ControlButton>
            
            <ControlButton 
              onClick={handleReset}
              className="shadow-lg"
            >
              Reset
            </ControlButton>
          </div>
        </div>
        
        {completedCycles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-1 mt-3 bg-purple-900/20 px-3 py-1 rounded-full backdrop-blur-sm"
          >
            <span className="text-xs text-white/70">
              Completed cycles: <span className="text-purple-200">{completedCycles}</span>
            </span>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="breathing-container h-64 mb-2">
        {/* Particles effect */}
        <div className="absolute inset-0 flex justify-center items-center">
          {breathingPhase === 'exhale' && isActive && (
            <AnimatePresence>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full"
                  style={{
                    background: `rgba(${168 + Math.random() * 30}, ${85 + Math.random() * 30}, ${247 + Math.random() * 8}, ${0.6 + Math.random() * 0.4})`,
                    boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)'
                  }}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 0.8
                  }}
                  animate={{ 
                    scale: [0, 1, 0.8],
                    x: [0, (Math.random() * 200 - 100) * (i % 2 ? 1 : -1)],
                    y: [0, (Math.random() * 200 - 100) * (i % 3 ? 1 : -1)],
                    opacity: [0.8, 0.4, 0]
                  }}
                  transition={{
                    duration: EXHALE_DURATION * 0.8,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                  exit={{ opacity: 0 }}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
        
        {/* Outer ring with glow */}
        <motion.div 
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(79, 70, 229, 0) 70%)',
            boxShadow: 'inset 0 0 40px rgba(139, 92, 246, 0.2)'
          }}
          animate={{
            scale: isActive ? (
              breathingPhase === 'inhale' ? [1, 1.2] : 
              breathingPhase === 'hold' ? 1.2 : [1.2, 1]
            ) : 1.1
          }}
          transition={{
            scale: { 
              duration: isActive ? (
                breathingPhase === 'inhale' ? INHALE_DURATION : 
                breathingPhase === 'exhale' ? EXHALE_DURATION : 0
              ) : 0,
              ease: "easeInOut"
            }
          }}
        />
        
        {/* Middle ring with pulse */}
        <motion.div 
          className="absolute h-56 w-56 rounded-full border border-purple-500/30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: isActive ? (
              breathingPhase === 'inhale' ? [1, 1.1] : 
              breathingPhase === 'hold' ? 1.1 : [1.1, 1]
            ) : 1,
            boxShadow: isActive ? '0 0 20px rgba(139, 92, 246, 0.2)' : 'none'
          }}
          transition={{
            scale: { 
              duration: isActive ? (
                breathingPhase === 'inhale' ? INHALE_DURATION : 
                breathingPhase === 'exhale' ? EXHALE_DURATION : 0
              ) : 0,
              ease: "easeInOut"
            },
            opacity: { duration: 4, repeat: Infinity },
            boxShadow: {
              duration: isActive ? (
                breathingPhase === 'inhale' ? INHALE_DURATION :
                breathingPhase === 'exhale' ? EXHALE_DURATION : 0
              ) : 0.8,
              ease: "easeInOut"
            }
          }}
        />
        
        {/* Inner ring with animated pattern */}
        <motion.div
          className="absolute h-44 w-44 rounded-full border border-white/30 overflow-hidden"
          style={{
            background: `radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(76, 29, 149, 0.1) 60%, rgba(30, 27, 75, 0.05) 100%)`,
          }}
          animate={{
            scale: isActive ? (
              breathingPhase === 'inhale' ? [1, 1.15] : 
              breathingPhase === 'hold' ? 1.15 : [1.15, 1]
            ) : 1.05
          }}
          transition={{
            scale: { 
              duration: isActive ? (
                breathingPhase === 'inhale' ? INHALE_DURATION : 
                breathingPhase === 'exhale' ? EXHALE_DURATION : 0
              ) : 0,
              ease: "easeInOut"
            }
          }}
        >
          {/* Animated pattern inside */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a78bfa' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px' 
            }}
            animate={{
              rotate: breathingPhase === 'inhale' ? [0, 10] : 
                      breathingPhase === 'exhale' ? [10, 0] : 0
            }}
            transition={{
              rotate: {
                duration: breathingPhase === 'inhale' ? INHALE_DURATION : 
                         breathingPhase === 'exhale' ? EXHALE_DURATION : 0,
                ease: "easeInOut"
              }
            }}
          />
        </motion.div>
        
        {/* Main breathing circle */}
        <motion.div
          className="relative h-40 w-40 rounded-full bg-gradient-to-br from-purple-400/90 via-indigo-500/90 to-violet-600/90 flex items-center justify-center"
          style={{
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)',
          }}
          animate={{
            scale: isActive ? (
              breathingPhase === 'inhale' ? [1, 1.6] : 
              breathingPhase === 'hold' ? 1.6 : [1.6, 1]
            ) : 1.3,
            boxShadow: isActive ? (
              breathingPhase === 'inhale' 
                ? ['0 0 15px rgba(168,85,247,0.3), inset 0 0 10px rgba(255,255,255,0.1)', 
                   '0 0 50px rgba(168,85,247,0.7), inset 0 0 30px rgba(255,255,255,0.3)'] 
                : breathingPhase === 'hold' 
                  ? '0 0 50px rgba(168,85,247,0.7), inset 0 0 30px rgba(255,255,255,0.3)'
                  : ['0 0 50px rgba(168,85,247,0.7), inset 0 0 30px rgba(255,255,255,0.3)',
                     '0 0 15px rgba(168,85,247,0.3), inset 0 0 10px rgba(255,255,255,0.1)']
            ) : '0 0 25px rgba(168,85,247,0.5), inset 0 0 15px rgba(255,255,255,0.2)'
          }}
          transition={{
            scale: { 
              duration: isActive ? (
                breathingPhase === 'inhale' ? INHALE_DURATION : 
                breathingPhase === 'exhale' ? EXHALE_DURATION : 0
              ) : 0.8,
              ease: "easeInOut"
            },
            boxShadow: {
              duration: isActive ? (
                breathingPhase === 'inhale' ? INHALE_DURATION :
                breathingPhase === 'exhale' ? EXHALE_DURATION : 0
              ) : 0.8,
              ease: "easeInOut"
            }
          }}
        >
          {/* Inner circle with countdown */}
          <motion.div 
            className="h-20 w-20 rounded-full backdrop-blur-md bg-white/10 flex items-center justify-center border border-white/30 overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            }}
            animate={{
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={countdown}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-white/90 text-xl font-light"
              >
                {isActive ? countdown : '--'}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isActive ? breathingPhase : 'paused'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-xl font-medium text-white mb-1 text-glow">
            {isActive ? getInstructionText() : 'Paused'}
          </h2>
        </motion.div>
      </AnimatePresence>
      
      {/* Controls */}
      <div className="flex space-x-3 mt-2">
        <ControlButton 
          onClick={toggleActive} 
          active={isActive}
          className="shadow-lg"
        >
          {isActive ? 'Pause' : 'Resume'}
        </ControlButton>
        
        <ControlButton 
          onClick={handleReset}
          className="shadow-lg"
        >
          Reset
        </ControlButton>
      </div>
      
      {/* Progress indicator */}
      {completedCycles > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-1 mt-2 bg-purple-900/20 px-3 py-1 rounded-full backdrop-blur-sm"
        >
          <span className="text-xs text-white/70">
            Completed cycles: <span className="text-purple-200">{completedCycles}</span>
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default BreathingAnimation 