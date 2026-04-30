'use client';

import { motion } from 'framer-motion';

export function MarketplaceAnimatedObjects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Products */}
      <motion.div
        className="absolute text-4xl opacity-25"
        style={{ top: '15%', left: '10%' }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🌾
      </motion.div>

      <motion.div
        className="absolute text-4xl opacity-25"
        style={{ top: '70%', right: '12%' }}
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🌱
      </motion.div>

      {/* Glowing Dots */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-green-400 opacity-50"
        style={{ top: '40%', left: '5%' }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />
    </div>
  );
}
