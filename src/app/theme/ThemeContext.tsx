'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available themes with their properties
export type ThemeOption = 'cosmic' | 'aurora' | 'midnight' | 'ember';

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cosmic',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeOption>('cosmic');
  const [mounted, setMounted] = useState(false);
  
  // This effect runs only once on the client-side
  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('serenim-theme');
      if (savedTheme && ['cosmic', 'aurora', 'midnight', 'ember'].includes(savedTheme)) {
        setTheme(savedTheme as ThemeOption);
      }
    } catch (error) {
      // Silent catch in case localStorage is not available
      console.warn("LocalStorage may not be available:", error);
    }
  }, []);
  
  // Save theme to localStorage when it changes, but only on the client
  useEffect(() => {
    // Skip during SSR
    if (!mounted) return;
    
    try {
      if (theme) {
        localStorage.setItem('serenim-theme', theme);
      }
    } catch (error) {
      // Silent catch in case localStorage is not available
      console.warn("Error saving theme:", error);
    }
  }, [theme, mounted]);
  
  // Apply theme class on the client-side only
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.body.className = `theme-${theme}`;
    }
  }, [theme, mounted]);

  // Return a default theme during SSR
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 