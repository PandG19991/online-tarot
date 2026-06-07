'use client';

import { useState, useMemo, useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import type { DrawnCard, SpreadType } from '@/types/tarot';
import TarotCard from './TarotCard';

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
    '现状', '阻碍', '基础', '过去', '目标',
    '未来', '自我', '环境', '希望/恐惧', '结果',
  ],
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

export default function ReadingResult({
  drawnCards,
  spreadType,
  onCardSelect,
  selectedIndex,
}: ReadingResultProps) {
  const labels = spreadLabels[spreadType];
  const summary = useMemo(() => getSummaryText(drawnCards, spreadType), [drawnCards, spreadType]);

  const [displayedIndex, setDisplayedIndex] = useState<number | null>(selectedIndex);
  const detailRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const exitTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (selectedIndex === displayedIndex) return;

    if (selectedIndex === null) {
      if (detailRef.current && !isAnimating.current) {
        isAnimating.current = true;
        exitTweenRef.current?.kill();
        exitTweenRef.current = gsap.to(detailRef.current, {
          opacity: 0,
          x: -40,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            setDisplayedIndex(null);
            isAnimating.current = false;
            exitTweenRef.current = null;
          },
        });
      }
      return;
    }

    if (displayedIndex === null) {
      setDisplayedIndex(selectedIndex);
      return;
    }

    if (detailRef.current && !isAnimating.current) {
      isAnimating.current = true;
      exitTweenRef.current?.kill();
      exitTweenRef.current = gsap.to(detailRef.current, {
        opacity: 0,
        x: -40,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayedIndex(selectedIndex);
          isAnimating.current = false;
          exitTweenRef.current = null;
        },
      });
    }

    return () => {
      exitTweenRef.current?.kill();
    };
  }, [selectedIndex, displayedIndex]);

  useLayoutEffect(() => {
    if (displayedIndex !== null && detailRef.current) {
      const tween = gsap.fromTo(
        detailRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
      );
      return () => {
        tween.kill();
      };
    }
  }, [displayedIndex]);

  const selectedCard = displayedIndex !== null ? drawnCards[displayedIndex] : null;

  return (
    <div className="w-full space-y-6">
      {/* Top: Card Overview */}
      <div className="flex flex-wrap justify-center gap-4">
        {drawnCards.map((drawn, index) => (
          <div
            key={index}
            onClick={() => onCardSelect(index)}
            className={`relative flex flex-col items-center gap-2 cursor-pointer transition-opacity duration-300 ${
              selectedIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-90'
            }`}
          >
            <TarotCard
              card={drawn.card}
              isReversed={drawn.isReversed}
              isRevealed={true}
              isSelected={selectedIndex === index}
              size="md"
            />
            <span
              className={`text-[10px] tracking-wider uppercase ${
                selectedIndex === index ? 'text-amber-300/90' : 'text-white/40'
              }`}
            >
              {labels[index] || `牌 ${index + 1}`}
            </span>
          </div>
        ))}
      </div>

      {/* Middle: Selected Card Detail */}
      {selectedCard && (
        <div ref={detailRef} className="card-outer">
          <div className="card-inner p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Large Card */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <TarotCard
                  card={selectedCard.card}
                  isReversed={selectedCard.isReversed}
                  isRevealed={true}
                  size="lg"
                />
                {displayedIndex !== null && labels[displayedIndex] && (
                  <p className="text-center mt-3 text-xs text-amber-300/60 tracking-widest uppercase font-medium">
                    {labels[displayedIndex]}
                  </p>
                )}
              </div>

              {/* Card Info */}
              <div className="flex-1 min-w-0 space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3
                    className="text-2xl font-medium text-white/90"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {selectedCard.card.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      selectedCard.isReversed
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
                        : 'bg-amber-500/12 text-amber-300 border-amber-500/25'
                    }`}
                  >
                    {selectedCard.isReversed ? '逆位' : '正位'}
                  </span>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2">
                  {selectedCard.card.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/55"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Meanings - 三段式 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-amber-500/8 flex-shrink-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(251,191,36,0.7)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
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
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(167,139,250,0.7)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
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
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(129,140,248,0.7)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" />
                        <path d="M12 12L20 7.5" />
                        <path d="M12 12V21" />
                        <path d="M12 12L4 7.5" />
                      </svg>
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
          </div>
        </div>
      )}

      {/* Bottom: Summary */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-7 border-l-2 border-amber-400/40"
        style={{ background: 'var(--card-outer)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(251,191,36,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" />
            <path d="M12 12L20 7.5" />
            <path d="M12 12V21" />
            <path d="M12 12L4 7.5" />
          </svg>
          <span className="text-xs text-amber-300/60 uppercase tracking-[0.2em] font-medium">
            综合解读
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(251,191,36,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" />
            <path d="M12 12L20 7.5" />
            <path d="M12 12V21" />
            <path d="M12 12L4 7.5" />
          </svg>
        </div>
        <p className="text-sm md:text-[15px] text-white/65 leading-[1.85] max-w-2xl mx-auto font-light tracking-wide">
          {summary}
        </p>
      </div>
    </div>
  );
}
