'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function AnimatedTree3D() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-96 pointer-events-none">
      {/* Tree SVG Representation */}
      <motion.svg
        viewBox="0 0 200 300"
        className="w-full h-full filter drop-shadow-lg"
        animate={{ rotateZ: [0, 5, 0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="treeGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Main trunk */}
        <rect x="85" y="180" width="30" height="100" fill="#8b4513" rx="5" />

        {/* Roots */}
        <path d="M 70 280 Q 60 295 50 300" stroke="#6b3410" strokeWidth="4" fill="none" />
        <path d="M 130 280 Q 140 295 150 300" stroke="#6b3410" strokeWidth="4" fill="none" />
        <path d="M 100 280 Q 100 300 100 305" stroke="#6b3410" strokeWidth="4" fill="none" />

        {/* Foliage layers */}
        <circle cx="100" cy="100" r="70" fill="url(#treeGradient)" filter="url(#glow)" opacity="0.9" />
        <circle cx="75" cy="130" r="50" fill="#22c55e" filter="url(#glow)" opacity="0.8" />
        <circle cx="125" cy="130" r="50" fill="#22c55e" filter="url(#glow)" opacity="0.8" />
        <circle cx="100" cy="60" r="45" fill="#4ade80" filter="url(#glow)" opacity="0.9" />
      </motion.svg>

      {/* Floating Particles around tree */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-green-400/60"
          animate={{
            x: [0, Math.cos((i / 6) * Math.PI * 2) * 60, 0],
            y: [0, Math.sin((i / 6) * Math.PI * 2) * 60, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Glow aura */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 via-green-400/10 to-transparent blur-2xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
