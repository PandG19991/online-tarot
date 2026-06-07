"use client";

import { motion } from "framer-motion";

interface LandingSceneProps {
  onStart: () => void;
}

export default function LandingScene({ onStart }: LandingSceneProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 overflow-hidden">
      {/* 背景渐变层（紫+靛蓝径向渐变） */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #1a0b2e 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, #0d1b2a 0%, transparent 45%), #050505",
        }}
      />

      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 品牌名：渐变文字 + text-glow */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-5"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          }}
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          <span
            className="bg-gradient-to-r from-[#c9a227] via-[#e8d5a3] to-white bg-clip-text text-transparent"
            style={{
              filter: "drop-shadow(0 0 25px rgba(201, 162, 39, 0.35))",
            }}
          >
            MysticDraw
          </span>
        </motion.h1>

        {/* 副标题 1：Noto Serif SC，细字重 */}
        <motion.p
          className="text-lg sm:text-xl text-[#e8e6e3]/90 max-w-md mb-2 tracking-wide"
          style={{
            fontFamily: "'Noto Serif SC', 'STSong', 'FangSong', serif",
            fontWeight: 300,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.6,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          探索塔罗的智慧，揭示命运的指引
        </motion.p>

        {/* 副标题 2 */}
        <motion.p
          className="text-sm text-[#6b6570] mb-14 tracking-[0.12em]"
          style={{
            fontFamily: "'Noto Serif SC', 'STSong', serif",
            fontWeight: 300,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.9,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          在星辰与卡牌之间，寻找属于你的答案
        </motion.p>

        {/* 开始占卜按钮 — Island Button */}
        <motion.button
          onClick={onStart}
          className="group relative px-10 py-4 rounded-full text-[#c9a227] text-sm font-medium tracking-[0.2em] uppercase overflow-hidden cursor-pointer border border-[rgba(201,162,39,0.3)] bg-transparent transition-all duration-500 hover:border-[rgba(201,162,39,0.8)] hover:bg-[rgba(201,162,39,0.05)] hover:shadow-[0_0_30px_rgba(201,162,39,0.15)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.1,
            ease: [0.32, 0.72, 0, 1],
          }}
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="relative z-10">开始占卜</span>
        </motion.button>
      </motion.div>

      {/* Scroll Hint：向下箭头，呼吸动画 */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
