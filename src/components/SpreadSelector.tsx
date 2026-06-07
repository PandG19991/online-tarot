'use client';

import { motion } from 'framer-motion';
import { Sparkles, Timer, Compass } from 'lucide-react';
import type { SpreadType } from '@/types/tarot';

interface SpreadSelectorProps {
  onSelect: (spread: SpreadType) => void;
  selected: SpreadType | null;
}

const spreads = [
  {
    type: 'single' as SpreadType,
    title: '单张牌',
    subtitle: '今日指引',
    description: '适合快速提问，捕捉当下的能量流动',
    icon: Sparkles,
  },
  {
    type: 'three' as SpreadType,
    title: '三张牌',
    subtitle: '过去·现在·未来',
    description: '时间线解读，看清命运的脉络',
    icon: Timer,
  },
  {
    type: 'celtic' as SpreadType,
    title: '凯尔特十字',
    subtitle: '深度洞察',
    description: '全面分析，十张牌编织生命图景',
    icon: Compass,
  },
];

export default function SpreadSelector({ onSelect, selected }: SpreadSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 max-w-4xl mx-auto">
      {spreads.map((spread, index) => {
        const Icon = spread.icon;
        const isSelected = selected === spread.type;
        return (
          <motion.button
            key={spread.type}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.55,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onClick={() => onSelect(spread.type)}
            className={`
              relative group flex flex-col items-center text-center p-7 rounded-2xl
              bg-gradient-to-b from-white/[0.06] to-white/[0.02]
              backdrop-blur-sm
              border transition-all duration-300 cursor-pointer
              ${isSelected
                ? 'border-amber-400/70 shadow-[0_0_35px_rgba(251,191,36,0.12)]'
                : 'border-white/[0.08] hover:border-white/20 hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)]'
              }
            `}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Ambient glow on hover */}
            <div
              className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                ${isSelected ? 'opacity-100' : ''}
              `}
              style={{
                background: isSelected
                  ? 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)',
              }}
            />

            <div
              className={`
                relative mb-5 p-4 rounded-2xl transition-all duration-300
                ${isSelected
                  ? 'bg-amber-400/12 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                  : 'bg-white/[0.04] text-purple-300/80 group-hover:bg-purple-500/12 group-hover:text-purple-200 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                }
              `}
            >
              <Icon size={30} strokeWidth={1.4} />
            </div>

            <h3 className="relative text-lg font-semibold text-white/90 mb-1 tracking-wide">
              {spread.title}
            </h3>
            <p
              className={`
                relative text-sm font-medium mb-2 tracking-wider
                ${isSelected ? 'text-amber-300/80' : 'text-purple-300/60'}
              `}
            >
              {spread.subtitle}
            </p>
            <p className="relative text-xs text-white/35 leading-relaxed max-w-[200px]">
              {spread.description}
            </p>

            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                layoutId="spread-selection-ring"
                className="absolute inset-0 rounded-2xl border-2 border-amber-400/30 pointer-events-none"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
