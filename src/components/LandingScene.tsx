"use client";

import { motion } from "framer-motion";

interface LandingSceneProps {
  onStart: () => void;
}

export default function LandingScene({ onStart }: LandingSceneProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4"
          style={{ fontFamily: "var(--font-playfair), serif" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          MysticDraw
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-zinc-300 max-w-md mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          探索塔罗的智慧，揭示命运的指引
        </motion.p>

        <motion.p
          className="text-sm text-zinc-500 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          在星辰与卡牌之间，寻找属于你的答案
        </motion.p>

        <motion.button
          onClick={onStart}
          className="group relative px-8 py-4 bg-transparent border border-white/20 rounded-full text-white text-lg font-medium overflow-hidden transition-colors hover:border-white/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">开始占卜</span>
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>
    </div>
  );
}
