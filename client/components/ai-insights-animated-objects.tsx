'use client';

import { motion } from 'framer-motion';

export function AIInsightsAnimatedObjects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Analysis Nodes */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-40"
          style={{
            top: `${20 + i * 20}%`,
            right: `${15 + i * 10}%`,
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}

      {/* Leaf */}
      <motion.div
        className="absolute text-5xl opacity-20"
        style={{ bottom: '10%', left: '8%' }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        🍃
      </motion.div>
    </div>
  );
}
