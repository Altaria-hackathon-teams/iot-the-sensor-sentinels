'use client';

import { motion } from 'framer-motion';

export function MiddleSectionObjects() {
  return (
    <div className="absolute inset-x-0 top-1/3 h-1/3 pointer-events-none overflow-hidden">
      {/* Floating Circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full border border-green-400/30 dark:border-green-300/40"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${(i / 5) * 100 + 10}%`,
            top: `${30 + Math.random() * 40}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Geometric Shapes */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            left: `${20 + i * 20}%`,
            top: `${40 + Math.random() * 20}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {i % 2 === 0 ? (
            <div className="w-8 h-8 border-2 border-green-400/40 dark:border-green-300/50" />
          ) : (
            <div className="w-8 h-8 border-2 border-green-400/40 dark:border-green-300/50 transform rotate-45" />
          )}
        </motion.div>
      ))}

      {/* Glowing Lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-1 bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 80}%`,
            top: `${35 + i * 20}%`,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Soft Glowing Orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-xl"
          style={{
            width: 60,
            height: 60,
            left: `${15 + i * 35}%`,
            top: `${45 + Math.sin(i) * 10}%`,
            background: `radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0) 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i * 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
