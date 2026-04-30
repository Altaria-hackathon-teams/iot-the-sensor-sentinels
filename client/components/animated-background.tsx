'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Generate particles for all three layers
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    // Check for dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* TOP LAYER - Dark Gradient */}
      <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-gray-900/5 to-transparent dark:via-green-950/10" />

      {/* TOP LAYER - Slow Floating Particles */}
      {particles.slice(0, 10).map((particle) => (
        <motion.div
          key={`top-${particle.id}`}
          className="absolute w-1 h-1 rounded-full bg-green-400/30 dark:bg-green-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y * 0.3}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* MIDDLE LAYER - Brighter Neon Waves */}
      <div className="absolute inset-x-0 top-1/3 h-1/3">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent dark:via-green-600/10" />
        
        {particles.slice(10, 20).map((particle) => (
          <motion.div
            key={`mid-${particle.id}`}
            className="absolute w-2 h-2 rounded-full bg-green-500/40 dark:bg-green-400/30"
            style={{
              left: `${particle.x}%`,
              top: `${50 + particle.y * 0.3}%`,
            }}
            animate={{
              y: [-50, 50, -50],
              x: [-20, 20, -20],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: particle.duration + 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* BOTTOM LAYER - Dark Glow */}
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent dark:from-gray-950/20" />

      {/* BOTTOM LAYER - Upward Drifting Particles */}
      {particles.slice(20, 30).map((particle) => (
        <motion.div
          key={`bottom-${particle.id}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-green-600/25 dark:bg-green-500/20"
          style={{
            left: `${particle.x}%`,
            top: `${70 + particle.y * 0.3}%`,
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration + 3,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Large Gradient Orbs for Depth */}
      <motion.div
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-tl from-green-500/5 to-transparent rounded-full blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
