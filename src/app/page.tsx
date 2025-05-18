'use client'

import { useState, useEffect } from 'react'
import BreathingAnimation from './components/BreathingAnimation'
import InteractiveSphere from './components/InteractiveSphere'
import BiometricScanner from './components/BiometricScanner'
import { motion } from 'framer-motion'
import { useTheme } from './theme/ThemeContext'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'2d' | '3d' | 'biometrics'>('2d')
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [isActive, setIsActive] = useState(true)
  const [userName, setUserName] = useState("Guest")
  const { theme } = useTheme()

  // This effect allows the parent to be aware of the breathing state
  // from the BreathingAnimation component for synchronizing the 3D visualization
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Digit1' || e.code === 'Numpad1') {
        setActiveTab('2d')
      } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
        setActiveTab('3d')
      } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
        setActiveTab('biometrics')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div 
        className="glass-card rounded-3xl p-10 relative overflow-hidden"
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-opacity-10 rounded-full blur-3xl -mr-10 -mt-10" style={{ backgroundColor: `var(--primary)` }}></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-opacity-10 rounded-full blur-3xl -ml-10 -mb-10" style={{ backgroundColor: `var(--accent)` }}></div>
        
        {/* Title area with glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10"
        >
          <motion.h1 
            className="text-5xl font-bold mb-2 text-white text-glow-strong bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, var(--primary-light), var(--accent-light))`
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 1.5,
              ease: [0.175, 0.885, 0.32, 1]
            }}
          >
            Breathe
          </motion.h1>
          <p className="text-lg mb-6 text-purple-200/90 font-light">
            Find your calm, one breath at a time
          </p>
          
          {/* Toggle buttons */}
          <div className="flex justify-center space-x-2 mb-10">
            <button 
              onClick={() => setActiveTab('2d')} 
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === '2d' 
                  ? 'primary-gradient primary-button text-white font-medium' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Classic
            </button>
            <button 
              onClick={() => setActiveTab('3d')} 
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === '3d' 
                  ? 'primary-gradient primary-button text-white font-medium' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              3D Experience
            </button>
            <button 
              onClick={() => setActiveTab('biometrics')} 
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === 'biometrics' 
                  ? 'primary-gradient primary-button text-white font-medium' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Biometrics
            </button>
          </div>
        </motion.div>
        
        <div className="relative z-10">
          {activeTab === '2d' && (
            <BreathingAnimation 
              onPhaseChange={setBreathingPhase}
              onActiveChange={setIsActive}
            />
          )}
          
          {activeTab === '3d' && (
            <div className="mb-4">
              <InteractiveSphere 
                breathingPhase={breathingPhase}
                isActive={isActive}
              />
              <div className="mt-6">
                <BreathingAnimation 
                  onPhaseChange={setBreathingPhase}
                  onActiveChange={setIsActive}
                  compact={true}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'biometrics' && (
            <div className="mb-4">
              <BiometricScanner 
                breathingPhase={breathingPhase}
                isActive={isActive}
                userName={userName}
              />
              <div className="mt-6">
                <BreathingAnimation 
                  onPhaseChange={setBreathingPhase}
                  onActiveChange={setIsActive}
                  compact={true}
                />
              </div>
            </div>
          )}
        </div>
        
        <motion.p 
          className="mt-10 text-purple-200/70 text-sm italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Focus your mind and follow the rhythm
        </motion.p>
        
        {/* Footer with subtle details */}
        <motion.div 
          className="mt-8 pt-4 text-xs text-purple-300/50 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
        >
          Press Space to pause · Esc to reset · 1-3 to switch views
        </motion.div>
      </motion.div>
    </motion.div>
  )
} 