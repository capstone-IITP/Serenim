'use client';

import { useRef, useEffect, useState } from 'react';
import { useTheme, ThemeOption } from '../theme/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// Theme-specific animations and visual effects
export default function ThemeEffects() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Mark component as mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Effect for drawing particles based on the current theme - moved BEFORE conditional return
  useEffect(() => {
    if (!mounted) return; // Skip during SSR
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Theme-specific settings
    const getThemeSettings = (currentTheme: ThemeOption) => {
      switch(currentTheme) {
        case 'cosmic':
          return {
            particleCount: 150,
            baseSize: 1.5,
            baseSpeed: 0.4,
            colorShift: false,
            rgbValues: '139, 92, 246',
          };
        case 'aurora':
          return {
            particleCount: 100,
            baseSize: 2,
            baseSpeed: 0.2,
            colorShift: true,
            rgbValues: '20, 184, 166',
          };
        case 'midnight':
          return {
            particleCount: 200,
            baseSize: 1,
            baseSpeed: 0.3,
            colorShift: false,
            rgbValues: '59, 130, 246',
          };
        case 'ember':
          return {
            particleCount: 80,
            baseSize: 2.5,
            baseSpeed: 0.5,
            colorShift: true,
            rgbValues: '245, 158, 11',
          };
      }
    };
    
    const settings = getThemeSettings(theme);
    
    // Create particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
      
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * settings.baseSize + 0.5;
        this.speedX = (Math.random() - 0.5) * settings.baseSpeed;
        this.speedY = (Math.random() - 0.5) * settings.baseSpeed;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.life = Math.random() * 100 + 100;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        
        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
        
        if (this.life <= 0) {
          this.x = Math.random() * canvas!.width;
          this.y = Math.random() * canvas!.height;
          this.life = Math.random() * 100 + 100;
        }
      }
      
      draw(context: CanvasRenderingContext2D) {
        let color = settings.rgbValues;
        
        if (settings.colorShift) {
          // For themes with colorShift, gradually shift the color based on position
          if (theme === 'aurora') {
            const hue = (this.x / canvas!.width) * 60 + 170; // Teal to blue range
            const hsla = `hsla(${hue}, 70%, 50%, ${this.opacity})`;
            context.fillStyle = hsla;
          } else if (theme === 'ember') {
            const hue = (this.x / canvas!.width) * 50 + 10; // Red to amber range
            const hsla = `hsla(${hue}, 80%, 55%, ${this.opacity})`;
            context.fillStyle = hsla;
          }
        } else {
          context.fillStyle = `rgba(${color}, ${this.opacity})`;
        }
        
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    // Create particles array
    const particles: Particle[] = [];
    for (let i = 0; i < settings.particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      
      // Draw and update particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
      
      if (theme === 'aurora') {
        // Add aurora-specific effect: subtle wave at bottom
        const gradient = ctx.createLinearGradient(0, canvas!.height * 0.7, 0, canvas!.height);
        gradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
        gradient.addColorStop(1, 'rgba(20, 184, 166, 0.05)');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(0, canvas!.height);
        
        for (let i = 0; i < canvas!.width; i++) {
          const waveHeight = Math.sin(i * 0.01 + Date.now() * 0.001) * 20;
          ctx.lineTo(i, canvas!.height * 0.85 + waveHeight);
        }
        
        ctx.lineTo(canvas!.width, canvas!.height);
        ctx.closePath();
        ctx.fill();
      }
      
      if (theme === 'ember') {
        // Add ember-specific effect: subtle flame at bottom
        const flameCount = 5;
        for (let i = 0; i < flameCount; i++) {
          const x = canvas!.width * (i + 0.5) / flameCount;
          const height = Math.sin(Date.now() * 0.002 + i) * 40 + 60;
          
          const gradient = ctx.createRadialGradient(
            x, canvas!.height, 0,
            x, canvas!.height, height
          );
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, canvas!.height, height, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      if (theme === 'midnight') {
        // Add midnight-specific effect: subtle star twinkles
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * canvas!.width;
          const y = Math.random() * canvas!.height * 0.7;
          const size = Math.random() * 2 + 1;
          const opacity = Math.sin(Date.now() * 0.003 + i) * 0.4 + 0.6;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mounted]);
  
  // Prevent rendering canvas effects during SSR
  if (!mounted) {
    return null;
  }
  
  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-[-1] pointer-events-none opacity-40"
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="fixed inset-0 z-[-2] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {theme === 'cosmic' && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_70%)]" />
          )}
          
          {theme === 'aurora' && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_70%)]" />
          )}
          
          {theme === 'midnight' && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.15),transparent_70%)]" />
          )}
          
          {theme === 'ember' && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(245,158,11,0.15),transparent_70%)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
} 