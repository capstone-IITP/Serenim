'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Tone from 'tone'

interface BiometricScannerProps {
  breathingPhase: 'inhale' | 'hold' | 'exhale';
  isActive: boolean;
  userName?: string;
  showBiometrics?: boolean;
}

const BiometricScanner = ({
  breathingPhase, 
  isActive,
  userName = "User",
  showBiometrics = true
}: BiometricScannerProps) => {
  const [heartRate, setHeartRate] = useState(72)
  const [bloodOxygen, setBloodOxygen] = useState(97)
  const [calmLevel, setCalmLevel] = useState(65)
  const [scanActive, setScanActive] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanData, setScanData] = useState<number[]>([])
  const scanIntervalRef = useRef<number | null>(null)

  // Update vitals based on breathing phase
  useEffect(() => {
    if (!isActive) return
    
    // Calculate new values based on breathing phase
    if (breathingPhase === 'inhale') {
      setHeartRate(prev => Math.min(prev + 1, 78))
      setBloodOxygen(prev => Math.min(prev + 0.1, 99))
    } else if (breathingPhase === 'exhale') {
      setHeartRate(prev => Math.max(prev - 2, 65))
    } else if (breathingPhase === 'hold') {
      setCalmLevel(prev => Math.min(prev + 0.5, 95))
    }
    
    // After several cycles, show improvement
    if (isActive && scanComplete) {
      setCalmLevel(prev => Math.min(prev + 0.2, 95))
    }
  }, [breathingPhase, isActive, scanComplete])

  // Biometric scan effect
  const startScan = () => {
    if (scanActive) return
    setScanActive(true)
    setScanComplete(false)
    setScanData([])
    
    // Play scan sound
    const synth = new Tone.Synth({
      oscillator: {
        type: "triangle8"
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination()
    synth.volume.value = -20
    synth.triggerAttackRelease("G5", "16n")
    
    // Generate scan data points
    let i = 0
    const maxPoints = 50
    
    const interval = setInterval(() => {
      setScanData(prev => {
        // Generate biometric data with some randomness and breathing phase influence
        let newValue = 50 + Math.sin(i / 5) * 20
        
        // Add some breathing influence
        if (breathingPhase === 'inhale') {
          newValue += 5
        } else if (breathingPhase === 'exhale') {
          newValue -= 3
        }
        
        // Add slight randomness
        newValue += (Math.random() - 0.5) * 10
        
        // Keep within range
        newValue = Math.max(Math.min(newValue, 100), 0)
        
        return [...prev, newValue]
      })
      
      i++
      if (i >= maxPoints) {
        clearInterval(interval)
        setScanActive(false)
        setScanComplete(true)
        
        // Play completion sound
        const endSynth = new Tone.Synth({
          oscillator: {
            type: "sine"
          },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 1.5
          }
        }).toDestination()
        endSynth.volume.value = -18
        endSynth.triggerAttackRelease("C6", "8n")
      }
    }, 50)
    
    scanIntervalRef.current = interval as unknown as number
    
    // Cleanup on unmount
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }

  return (
    <motion.div 
      className="relative w-full backdrop-blur bg-black/30 rounded-xl border border-purple-500/20 p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with user info and scan button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-medium">{userName}</h3>
            <p className="text-xs text-purple-200/60">Session #1703</p>
          </div>
        </div>
        
        <motion.button
          className={`px-3 py-1.5 rounded-lg text-sm ${
            scanActive ? 'bg-red-500/80 text-white' : 'bg-purple-600 text-white'
          } flex items-center space-x-1.5`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={startScan}
          disabled={scanActive}
        >
          <span className={`h-2 w-2 rounded-full ${scanActive ? 'bg-white animate-pulse' : 'bg-white'}`}></span>
          <span>{scanActive ? 'Scanning...' : 'Scan Vitals'}</span>
        </motion.button>
      </div>
      
      {/* Biometric visualization */}
      <div className="h-32 relative bg-black/50 rounded-lg overflow-hidden mb-4 backdrop-blur-sm">
        {/* Scan line */}
        {scanActive && (
          <motion.div 
            className="absolute top-0 bottom-0 w-0.5 bg-purple-500 z-10"
            initial={{ left: 0 }}
            animate={{ left: '100%' }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
        
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-purple-500/10"></div>
          ))}
        </div>
        
        {/* Data visualization */}
        <motion.svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background grid values */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#a855f725" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#a855f730" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#a855f725" strokeWidth="0.5" />
          
          {/* Heartbeat line */}
          <polyline
            points={scanData.map((value, i) => `${i * (100 / 50)},${100 - value}`).join(' ')}
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        
        {/* Scanning overlay */}
        <AnimatePresence>
          {scanActive && (
            <motion.div 
              className="absolute inset-0 bg-purple-500/5 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-purple-300 text-sm font-mono"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ANALYZING BIOMETRIC DATA...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Scan result overlay */}
        <AnimatePresence>
          {scanComplete && !scanActive && (
            <motion.div 
              className="absolute inset-0 bg-green-900/10 border border-green-500/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-green-400 text-sm font-mono bg-black/30 px-3 py-1 rounded-md backdrop-blur-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                SCAN COMPLETE • RESULTS EXCELLENT
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Biometric stats row */}
      {showBiometrics && (
        <div className="grid grid-cols-3 gap-2">
          <BiometricStat 
            label="Heart Rate" 
            value={`${Math.floor(heartRate)}`} 
            unit="bpm" 
            icon="❤️" 
            trend={breathingPhase === 'inhale' ? 'up' : breathingPhase === 'exhale' ? 'down' : 'stable'} 
          />
          <BiometricStat 
            label="Blood Oxygen" 
            value={`${bloodOxygen.toFixed(1)}`} 
            unit="%" 
            icon="🫁" 
            trend={breathingPhase === 'inhale' ? 'up' : 'stable'} 
          />
          <BiometricStat 
            label="Calm Level" 
            value={`${Math.floor(calmLevel)}`} 
            unit="%" 
            icon="🧘" 
            trend={isActive ? 'up' : 'down'} 
          />
        </div>
      )}
      
      {/* Session info footer */}
      <motion.div 
        className="mt-4 text-xs text-center text-purple-200/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="inline-block h-1 w-1 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
        Session active • Continuous monitoring enabled
      </motion.div>
    </motion.div>
  )
}

// Biometric stat component
interface BiometricStatProps {
  label: string;
  value: string;
  unit: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
}

const BiometricStat = ({
  label,
  value,
  unit,
  icon,
  trend = 'stable'
}: BiometricStatProps) => {
  const getTrendArrow = () => {
    switch (trend) {
      case 'up': return <span className="text-green-500">↑</span>
      case 'down': return <span className="text-blue-400">↓</span>
      default: return <span className="text-purple-300">→</span>
    }
  }
  
  return (
    <motion.div 
      className="bg-black/20 backdrop-blur-md rounded-lg p-3 border border-purple-500/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-purple-300/80">{label}</span>
        <span className="text-xs">{icon}</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-lg font-medium text-white">{value}</span>
        <span className="text-xs text-purple-200/80 ml-1">{unit}</span>
        <span className="text-xs ml-2">{getTrendArrow()}</span>
      </div>
    </motion.div>
  )
}

export default BiometricScanner 