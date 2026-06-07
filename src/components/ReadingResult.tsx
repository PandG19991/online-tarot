'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Sun, Flame, Droplets, Wind, Mountain } from 'lucide-react';
import type { DrawnCard, SpreadType } from '@/types/tarot';

interface ReadingResultProps {
  drawnCards: DrawnCard[];
  spreadType: SpreadType;
  onCardSelect: (index: number) => void;
  selectedIndex: number | null;
}

const spreadLabels: Record<SpreadType, string[]> = {
  single: ['核心指引'],
  three: ['过去', '现在', '未来'],
  celtic: [
    '现状', '挑战', '根基', '过去', '目标',
    '未来', '自我', '环境', '希望', '结果',
  ],
};

const elementIcons = {
  fire: Flame,
  water: Droplets,
  air: Wind,
  earth: Mountain,
};

function getSummaryText(drawnCards: DrawnCard[], spreadType: SpreadType): string {
  const majorCount = drawnCards.filter((d) => d.card.arcana === 'major').length;
  const reversedCount = drawnCards.filter((d) => d.isReversed).length;
  const elements = drawnCards
    .map((d) => d.card.element)
    .filter(Boolean) as Array<'fire' | 'water' | 'air' | 'earth'>;
  const dominantElement = elements.length > 0
    ? elements.sort((a, b) =>
        elements.filter((e) => e === b).length - elements.filter((e) => e === a).length
      )[0]
    : null;

  let summary = '';

  if (spreadType === 'single') {
    summary = '这一张牌为你揭示了此刻能量的核心，它是宇宙此刻想要你看见的真相。';
  } else if (spreadType === 'three') {
    summary =
      '三张牌串联起你的时间线，揭示了过去如何塑造现在，现在又孕育着怎样的未来。流动的能量在你手中交织。';
  } else {
    summary =
      '凯尔特十字为你展现了复杂而完整的生命图景，十张牌交织出深层的心理与外在动力，每一张都是命运拼图的关键一角。';
  }

  if (majorCount >= drawnCards.length / 2) {
    summary += '大牌能量强烈涌动，表明这是一个具有重要意义的转折时刻，灵魂正在经历深刻的蜕变。';
  }

  if (reversedCount > 0) {
    summary += `其中${reversedCount}张逆位牌提示内在能量需要被觉察与转化——逆位不是否定，而是另一种可能的开启。`;
  }

  if (dominantElement) {
    const elementNames = { fire: '火', water: '水', air: '风', earth: '土' };
    summary += `${elementNames[dominantElement]}元素能量 prominent，为你的课题带来${
      dominantElement === 'fire'
        ? '热情与行动力'
        : dominantElement === 'water'
        ? '情感与直觉的深度'
        : dominantElement === 'air'
        ? '理智与沟通的力量'
        : '稳定与物质的根基'
    }。`;
  }

  summary += '愿这些讯息成为你前行路上的星光，照亮迷雾中的道路。';

  return summary;
}

function CardThumbnail({
  drawn,
  isSelected,
  onClick,
  label,
}: {
  drawn: DrawnCard;
  isSelected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className={`
        relative flex flex-col items-center gap-2 p-3 rounded-xl transition-colors duration-300
        ${
          isSelected
            ? 'bg-white/[0.08] border border-amber-400/30 shadow-[0_0_25px_rgba(251,191,36,0.08)]'
            : 'bg-white/[0.03] border border-transparent hover:bg-white/[0.06] hover:border-white/[0.08]'
        }
      `}
    >
      <div
        className={`
          relative w-[60px] h-[90px] rounded-lg overflow-hidden shadow-lg
          ${drawn.isReversed ? 'rotate-180' : ''}
          ${isSelected ? 'ring-2 ring-amber-400/40 ring-offset-2 ring-offset-[#0a0a12]' : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-2 w-1 h-1 bg-amber-300/60 rounded-full" />
          <div className="absolute bottom-3 right-2 w-0.5 h-0.5 bg-purple-300/50 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/[0.04] rounded-full" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1.5">
          <span className="text-[7px] text-amber-200/40 uppercase tracking-[0.15em]">
            {drawn.card.arcana}
          </span>
          <span className="text-[9px] text-white/80 text-center leading-tight mt-1 font-medium">
            {drawn.card.name}
          </span>
          {drawn.card.suit && (
            <span className="text-[7px] text-purple-300/40 mt-1 capitalize">{drawn.card.suit}</span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <span
        className={`text-[10px] font-medium tracking-wider ${
          isSelected ? 'text-amber-300/90' : 'text-white/45'
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}

export default function ReadingResult({
  drawnCards,
  spreadType,
  onCardSelect,
  selectedIndex,
}: ReadingResultProps) {
  const labels = spreadLabels[spreadType];
  const selectedCard = selectedIndex !== null ? drawnCards[selectedIndex] : null;
  const summary = useMemo(() => getSummaryText(drawnCards, spreadType), [drawnCards, spreadType]);

  const ElementIcon = selectedCard?.card.element
    ? elementIcons[selectedCard.card.element]
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-5 space-y-6">
      {/* Top: Card Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {drawnCards.map((drawn, index) => (
          <CardThumbnail
            key={index}
            drawn={drawn}
            isSelected={selectedIndex === index}
            onClick={() => onCardSelect(index)}
            label={labels[index] || `牌 ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Middle: Selected Card Detail */}
      <AnimatePresence mode="wait">
        {selectedCard && (
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 md:p-8 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Large Card */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div
                  className={`
                    relative w-44 h-64 rounded-xl overflow-hidden shadow-2xl
                    ${selectedCard.isReversed ? 'rotate-180' : ''}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-950" />
                  {/* Decorative elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 left-4 w-2 h-2 border border-amber-300/20 rounded-full" />
                    <div className="absolute top-4 right-4 w-2 h-2 border border-amber-300/20 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 border border-amber-300/20 rounded-full" />
                    <div className="absolute bottom-4 right-4 w-2 h-2 border border-amber-300/20 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/[0.03] rounded-full" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                    <span className="text-[10px] text-amber-200/40 uppercase tracking-[0.2em] mb-3">
                      {selectedCard.card.arcana}
                    </span>
                    <span className="text-xl text-white text-center font-semibold leading-tight">
                      {selectedCard.card.name}
                    </span>
                    {selectedCard.card.suit && (
                      <span className="text-xs text-purple-300/50 mt-3 capitalize tracking-wider">
                        {selectedCard.card.suit}
                      </span>
                    )}
                    {selectedCard.card.number > 0 && (
                      <span className="absolute top-4 left-4 text-xs text-white/20 font-mono">
                        {selectedCard.card.number}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/[0.03] pointer-events-none" />
                </div>

                {/* Position label below card */}
                {selectedIndex !== null && labels[selectedIndex] && (
                  <p className="text-center mt-3 text-xs text-amber-300/60 tracking-widest uppercase font-medium">
                    {labels[selectedIndex]}
                  </p>
                )}
              </div>

              {/* Card Info */}
              <div className="flex-1 min-w-0 space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-semibold text-white/90">
                    {selectedCard.card.name}
                  </h3>
                  <span
                    className={`
                      px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${
                        selectedCard.isReversed
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
                          : 'bg-amber-500/12 text-amber-300 border-amber-500/25'
                      }
                    `}
                  >
                    {selectedCard.isReversed ? '逆位' : '正位'}
                  </span>
                  {ElementIcon && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/50">
                      <ElementIcon size={11} />
                      {selectedCard.card.element}
                    </span>
                  )}
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2">
                  {selectedCard.card.keywords.map((kw) => (
                    <motion.span
                      key={kw}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/55 hover:border-amber-400/20 hover:text-white/70 transition-colors"
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>

                {/* Meanings */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-amber-500/8 flex-shrink-0">
                      <Sun size={14} className="text-amber-400/70" />
                    </div>
                    <div>
                      <span className="text-[11px] text-white/35 uppercase tracking-[0.15em] block mb-1">
                        正位含义
                      </span>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {selectedCard.card.upright}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-purple-500/8 flex-shrink-0">
                      <Moon size={14} className="text-purple-400/70" />
                    </div>
                    <div>
                      <span className="text-[11px] text-white/35 uppercase tracking-[0.15em] block mb-1">
                        逆位含义
                      </span>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {selectedCard.card.reversed}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-white/[0.05]">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-500/8 flex-shrink-0">
                      <Sparkles size={14} className="text-indigo-400/70" />
                    </div>
                    <div>
                      <span className="text-[11px] text-white/35 uppercase tracking-[0.15em] block mb-1">
                        占卜师低语
                      </span>
                      <p className="text-sm text-white/80 leading-relaxed italic">
                        {selectedCard.isReversed
                          ? selectedCard.card.fortuneTellerText.reversed
                          : selectedCard.card.fortuneTellerText.upright}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom: Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-7 text-center border border-white/[0.06]"
        style={{
          background:
            'linear-gradient(135deg, rgba(251,191,36,0.04) 0%, rgba(139,92,246,0.04) 50%, rgba(99,102,241,0.04) 100%)',
        }}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-amber-400/10 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-amber-400/10 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-amber-400/10 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-amber-400/10 rounded-br-2xl" />

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles size={14} className="text-amber-400/50" />
          <span className="text-xs text-amber-300/60 uppercase tracking-[0.2em] font-medium">
            综合解读
          </span>
          <Sparkles size={14} className="text-amber-400/50" />
        </div>
        <p className="text-sm md:text-[15px] text-white/65 leading-[1.85] max-w-2xl mx-auto font-light tracking-wide">
          {summary}
        </p>
      </motion.div>
    </div>
  );
}
