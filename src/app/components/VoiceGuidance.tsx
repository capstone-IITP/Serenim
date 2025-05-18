'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface VoiceGuidanceProps {
  breathingPhase: 'inhale' | 'hold' | 'exhale'
  isActive: boolean
  volume: number
  voice: 'feminine' | 'masculine' | 'neutral'
  isEnabled: boolean
}

const VoiceGuidance: React.FC<VoiceGuidanceProps> = ({
  breathingPhase,
  isActive,
  volume = 0.7,
  voice = 'feminine',
  isEnabled = true
}) => {
  const [prevPhase, setPrevPhase] = useState<string>(breathingPhase)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  
  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContext) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(context)
      }
    }
    
    // Add event listeners for user interaction
    const events = ['click', 'touchstart', 'keydown']
    events.forEach(event => window.addEventListener(event, initAudioContext, { once: true }))
    
    return () => {
      events.forEach(event => window.removeEventListener(event, initAudioContext))
    }
  }, [audioContext])
  
  // Play voice guidance based on breathing phase
  useEffect(() => {
    if (!isEnabled || !isActive || !audioContext || breathingPhase === prevPhase) {
      setPrevPhase(breathingPhase)
      return
    }
    
    const speakPhase = async () => {
      try {
        // Use the Web Speech API for voice guidance
        const utterance = new SpeechSynthesisUtterance(
          breathingPhase === 'inhale' ? 'Inhale' :
          breathingPhase === 'hold' ? 'Hold' : 'Exhale'
        )
        
        // Set voice properties
        utterance.volume = volume
        utterance.rate = 0.9  // Slightly slower for calm guidance
        
        // Select voice based on preference
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          // Try to find a voice that matches the preference
          let selectedVoice
          
          if (voice === 'feminine') {
            selectedVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha'))
          } else if (voice === 'masculine') {
            selectedVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel'))
          } else {
            // Find a neutral or default voice
            selectedVoice = voices.find(v => v.default)
          }
          
          if (selectedVoice) {
            utterance.voice = selectedVoice
          }
        }
        
        // Speak the guidance
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error('Error with speech synthesis:', error)
      }
    }
    
    speakPhase()
    setPrevPhase(breathingPhase)
  }, [breathingPhase, isActive, isEnabled, audioContext, volume, voice, prevPhase])
  
  // Only render the UI component if voice is enabled
  if (!isEnabled) return null
  
  return (
    <motion.div
      className="absolute left-4 bottom-4 flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600/20 backdrop-blur-sm border border-purple-500/30"
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1
        }}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          repeatDelay: 1
        }}
      >
        <motion.svg 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ opacity: isActive ? [0.6, 1, 0.6] : 0.6 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path 
            d="M12 3V21M19 7V17M5 7V17" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
      <span className="ml-2 text-xs text-purple-200/50">Voice Guidance</span>
    </motion.div>
  )
}

export default VoiceGuidance 