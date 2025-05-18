'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, ThemeOption } from '../theme/ThemeContext';

// Theme options with their visual properties
const themeOptions = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    icon: '✨',
    description: 'Deep purple galaxies and nebulae'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    icon: '🌌',
    description: 'Northern lights with teal and blue'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    icon: '🌙',
    description: 'Blue night sky with stars'
  },
  {
    id: 'ember',
    name: 'Ember',
    icon: '🔥',
    description: 'Warm dark gradients with fire accents'
  }
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentTheme = themeOptions.find(t => t.id === theme) || themeOptions[0];
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        className="theme-button flex items-center gap-2 px-4 py-2.5 rounded-full glass-card backdrop-blur-lg shadow-lg border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl">{currentTheme.icon}</span>
        <span className="font-medium text-sm text-white/90">{currentTheme.name}</span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 bottom-16 glass-card backdrop-blur-md rounded-2xl p-4 shadow-xl w-64 border border-white/10"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.25 }}
          >
            <h3 className="text-white/80 text-sm mb-3 font-medium">Select Theme</h3>
            
            <div className="space-y-2">
              {themeOptions.map((option) => (
                <motion.button
                  key={option.id}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    theme === option.id 
                      ? 'bg-white/15 shadow-inner' 
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => {
                    setTheme(option.id as ThemeOption);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl 
                    ${option.id === 'cosmic' ? 'bg-gradient-to-br from-purple-500 to-indigo-700' : ''}
                    ${option.id === 'aurora' ? 'bg-gradient-to-br from-teal-500 to-blue-700' : ''}
                    ${option.id === 'midnight' ? 'bg-gradient-to-br from-blue-500 to-indigo-900' : ''}
                    ${option.id === 'ember' ? 'bg-gradient-to-br from-amber-500 to-rose-800' : ''}
                  `}>
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-white/90 font-medium text-sm">{option.name}</div>
                    <div className="text-white/50 text-xs">{option.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-3 pt-2 border-t border-white/5 text-center">
              <button 
                className="text-xs text-white/50 hover:text-white/80"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 