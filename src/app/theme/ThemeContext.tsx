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
  
  // Load theme from localStorage on client-side
  useEffect(() => {
    const savedTheme = localStorage.getItem('serenim-theme');
    if (savedTheme && ['cosmic', 'aurora', 'midnight', 'ember'].includes(savedTheme)) {
      setTheme(savedTheme as ThemeOption);
    }
  }, []);
  
  // Save theme to localStorage when it changes
  useEffect(() => {
    if (theme) {
      localStorage.setItem('serenim-theme', theme);
      // Apply theme class to the document body
      document.body.className = `theme-${theme}`;
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 