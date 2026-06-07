"use client";

import { motion } from "framer-motion";
import type { SpreadType } from "@/types/tarot";

interface SpreadSelectorProps {
  onSelect: (spread: SpreadType) => void;
  selected: SpreadType | null;
}

const spreads = [
  {
    type: "single" as SpreadType,
    title: "单张牌",
    subtitle: "今日指引",
    description: "适合快速提问，捕捉当下的能量流动",
  },
  {
    type: "three" as SpreadType,
    title: "三张牌",
    subtitle: "过去·现在·未来",
    description: "时间线解读，看清命运的脉络",
  },
  {
    type: "celtic" as SpreadType,
    title: "凯尔特十字",
    subtitle: "深度洞察",
    description: "全面分析，十张牌编织生命图景",
  },
];

/* ── 自定义细线 SVG 图标（不用粗 Lucide） ── */

function SingleCardIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 4L28 16L16 28L4 16Z" />
      <circle cx="16" cy="16" r="2.5" />
    </svg>
  );
}

function ThreeCardsIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="8" y1="22" x2="8" y2="10" />
      <line x1="16" y1="26" x2="16" y2="6" />
      <line x1="24" y1="22" x2="24" y2="10" />
    </svg>
  );
}

function CelticCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="16" cy="16" r="7" />
      <line x1="16" y1="5" x2="16" y2="27" />
      <line x1="5" y1="16" x2="27" y2="16" />
    </svg>
  );
}

const icons = {
  single: SingleCardIcon,
  three: ThreeCardsIcon,
  celtic: CelticCrossIcon,
};

export default function SpreadSelector({ onSelect, selected }: SpreadSelectorProps) {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
      <style>{`
        @keyframes gold-pulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(201, 162, 39, 0.1),
              inset 0 0 30px rgba(201, 162, 39, 0.06);
          }
          50% {
            box-shadow:
              0 0 50px rgba(201, 162, 39, 0.28),
              inset 0 0 55px rgba(201, 162, 39, 0.15);
          }
        }
        .animate-gold-pulse {
          animation: gold-pulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spreads.map((spread, index) => {
          const isSelected = selected === spread.type;
          const Icon = icons[spread.type];

          return (
            <motion.div
              key={spread.type}
              className="perspective-1000"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.7,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <motion.button
                onClick={() => onSelect(spread.type)}
                className={`
                  relative w-full text-left cursor-pointer group transform-style-3d
                  ${isSelected ? "animate-gold-pulse" : ""}
                `}
                style={{
                  background: "#111118",
                  borderRadius: "24px",
                  padding: "3px",
                  border: isSelected
                    ? "1px solid rgba(201, 162, 39, 0.6)"
                    : "1px solid rgba(201, 162, 39, 0.15)",
                  boxShadow: isSelected
                    ? "0 0 0 1px rgba(201, 162, 39, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.05)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.05)",
                  transition:
                    "border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                whileHover={{
                  rotateY: 5,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 悬停金色光晕增强 */}
                <div
                  className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.12) 0%, transparent 60%)",
                  }}
                />

                {/* ── Inner Core（Double-Bezel 内芯）── */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: "#161620",
                    borderRadius: "21px",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08)",
                    padding: "28px",
                  }}
                >
                  {/* 暗角 vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: "inherit",
                      background:
                        "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
                    }}
                  />

                  {/* 选中时的顶部金色光晕线 */}
                  {isSelected && (
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.6), transparent)",
                      }}
                    />
                  )}

                  {/* Icon 容器 */}
                  <div
                    className={`
                      relative mb-5 inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500
                      ${isSelected
                        ? "text-[#c9a227] bg-[rgba(201,162,39,0.1)]"
                        : "text-[#6b6570] bg-[rgba(255,255,255,0.03)] group-hover:text-[#c9a227]/70 group-hover:bg-[rgba(201,162,39,0.06)]"
                      }
                    `}
                    style={
                      isSelected
                        ? { boxShadow: "0 0 20px rgba(201, 162, 39, 0.12)" }
                        : {}
                    }
                  >
                    <Icon />
                  </div>

                  {/* 标题 */}
                  <h3
                    className="relative text-lg font-medium text-[#e8e6e3] mb-1 tracking-wide"
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                    }}
                  >
                    {spread.title}
                  </h3>

                  {/* 副标题 */}
                  <p
                    className={`
                      relative text-xs font-medium mb-3 tracking-[0.15em] uppercase
                      ${isSelected ? "text-[#c9a227]/80" : "text-[#6b6570]"}
                    `}
                  >
                    {spread.subtitle}
                  </p>

                  {/* 描述 */}
                  <p className="relative text-sm text-[#6b6570]/80 leading-relaxed">
                    {spread.description}
                  </p>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
