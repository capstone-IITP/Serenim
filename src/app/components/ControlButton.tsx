'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ControlButtonProps {
  onClick: () => void
  children: ReactNode
  active?: boolean
  className?: string
}

const ControlButton = ({ 
  onClick, 
  children, 
  active = false,
  className = '' 
}: ControlButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        px-5 py-2.5 rounded-full 
        ${active 
          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' 
          : 'bg-white/5 text-white/90 hover:bg-white/10 border border-white/10'
        } 
        backdrop-blur relative overflow-hidden
        transition-all duration-300 ease-in-out
        font-medium tracking-wide
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: active 
          ? '0 10px 25px -5px rgba(139, 92, 246, 0.5), 0 8px 10px -6px rgba(139, 92, 246, 0.4)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Glass overlay */}
      <span className="absolute inset-0 overflow-hidden">
        <span className={`absolute inset-0 opacity-25 ${active ? 'bg-gradient-to-t from-transparent to-white/20' : ''}`}></span>
      </span>
      
      {/* Button glow for active state */}
      {active && (
        <motion.span 
          className="absolute inset-0 -z-10"
          animate={{
            boxShadow: ['0 0 15px rgba(139, 92, 246, 0.5)', '0 0 25px rgba(139, 92, 246, 0.7)', '0 0 15px rgba(139, 92, 246, 0.5)']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export default ControlButton