"use client";

import { motion } from "framer-motion";

interface LandingSceneProps {
  onStart: () => void;
}

export default function LandingScene({ onStart }: LandingSceneProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 py-8 overflow-hidden">
      {/* ── VAKH-style Hardware Chassis Frame ── */}
      <div className="chassis-frame w-full max-w-2xl">
        {/* Chassis Header: Hardware Status Bar */}
        <div
          className="flex justify-between items-center px-4 py-2 mb-1"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
            borderBottom: "1px dashed rgba(201, 162, 39, 0.15)",
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "rgba(255,255,255,0.15)" }}>⨂</span>
            <span>MYSTICDRAW // TERMINAL // MODEL T-1</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "#22c55e",
                  boxShadow: "0 0 6px rgba(34,197,94,0.6)",
                }}
              />
              <span>SYS_OK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--gold)",
                  animation: "ledPulse 1.2s infinite alternate",
                }}
              />
              <span>RX_DATA</span>
            </div>
          </div>
        </div>

        {/* CRT Screen Content */}
        <div
          className="relative rounded-lg p-8 sm:p-12"
          style={{
            background: "rgba(10, 10, 15, 0.6)",
            border: "1px solid rgba(201, 162, 39, 0.1)",
            boxShadow: "inset 0 15px 30px rgba(0,0,0,0.3)",
          }}
        >
          {/* Prompt Arrow */}
          <div
            className="mb-6"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--gold)",
            }}
          >
            <span className="cursor-blink">A:\\MYSTIC&gt; run tarot.exe</span>
          </div>

          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Brand Name */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-4"
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

            {/* Subtitle 1 */}
            <motion.p
              className="text-base sm:text-lg text-[#e8e6e3]/90 max-w-md mb-2 tracking-wide"
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

            {/* Subtitle 2 */}
            <motion.p
              className="text-xs text-[#6b6570] mb-10 tracking-[0.12em]"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 400,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              [STAGE_01] 在星辰与卡牌之间，寻找属于你的答案
            </motion.p>

            {/* Start Button — Island Button */}
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

          {/* Bottom Status Line */}
          <div
            className="mt-8 pt-4 flex justify-between items-center"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              borderTop: "1px dashed rgba(201, 162, 39, 0.1)",
            }}
          >
            <span>vakh://mysticdraw.local:8080</span>
            <span>MEM: 14.2MB // LATENCY: &lt;3ms</span>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <motion.div
        className="absolute bottom-6 flex flex-col items-center gap-2"
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
