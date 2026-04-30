'use client';

import { motion } from 'framer-motion';

export function HeroAnimatedObjects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Leaf 1 */}
      <motion.div
        className="absolute w-8 h-8 text-green-400 opacity-40"
        style={{ top: '15%', left: '10%' }}
        animate={{
          y: [0, -30, 0],
          x: [0, 10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🍃
      </motion.div>

      {/* Glowing Dot 1 */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-green-400 opacity-50"
        style={{ top: '25%', right: '15%' }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Holographic Ring */}
      <motion.div
        className="absolute w-16 h-16 rounded-full border-2 border-green-400 opacity-20"
        style={{ top: '35%', left: '20%' }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating Leaf 2 */}
      <motion.div
        className="absolute w-6 h-6 text-green-500 opacity-40"
        style={{ top: '45%', right: '10%' }}
        animate={{
          y: [0, 40, 0],
          x: [0, -15, 0],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🌿
      </motion.div>

      {/* Glowing Dot 2 */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-green-500 opacity-60"
        style={{ top: '55%', left: '8%' }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Plant Silhouette */}
      <motion.div
        className="absolute text-green-600 opacity-30 text-6xl"
        style={{ bottom: '10%', left: '5%' }}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🌱
      </motion.div>
    </div>
  );
}
