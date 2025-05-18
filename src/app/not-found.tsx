'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="glass-card rounded-3xl p-10 relative overflow-hidden">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-white text-glow-strong bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          Page Not Found
        </motion.h1>
        
        <p className="text-lg mb-8 text-purple-200/90">
          The page you're looking for doesn't seem to exist
        </p>
        
        <Link 
          href="/"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </motion.div>
  )
} 