'use client';

import { motion } from 'framer-motion';

export function DashboardAnimatedObjects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Data Points */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-green-500/60"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 12}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Floating Sensor Icon */}
      <motion.div
        className="absolute text-3xl opacity-30"
        style={{ top: '60%', right: '8%' }}
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        📡
      </motion.div>
    </div>
  );
}
