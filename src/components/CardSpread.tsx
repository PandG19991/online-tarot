'use client';

import React from 'react';
import TarotCard from './TarotCard';
import CardBack from './CardBack';
import { SpreadType, DrawnCard } from '@/types/tarot';

interface CardSpreadProps {
  spreadType: SpreadType;
  drawnCards: DrawnCard[];
  revealedIndices: number[];
  selectedIndex: number | null;
  onCardClick: (index: number) => void;
}

const defaultLabels: Record<string, string[]> = {
  single: ['指引'],
  three: ['过去', '现在', '未来'],
  celtic: ['现状', '挑战', '意识', '基础', '过去', '未来', '自我', '环境', '希望/恐惧', '结果'],
};

const celticPositions = [
  { left: '30%', top: '28%' },
  { left: '30%', top: '28%', rotate: 90 },
  { left: '30%', top: '2%' },
  { left: '30%', top: '54%' },
  { left: '5%', top: '28%' },
  { left: '55%', top: '28%' },
  { left: '76%', top: '54%' },
  { left: '76%', top: '38%' },
  { left: '76%', top: '22%' },
  { left: '76%', top: '6%' },
];

export default function CardSpread({
  spreadType,
  drawnCards,
  revealedIndices,
  selectedIndex,
  onCardClick,
}: CardSpreadProps) {
  const labels = defaultLabels[spreadType];
  const cardSize = spreadType === 'celtic' ? 'sm' : spreadType === 'single' ? 'lg' : 'md';

  const getDrawnCard = (positionIndex: number) =>
    drawnCards.find((d) => d.position === positionIndex);

  if (spreadType === 'single') {
    const drawn = getDrawnCard(0);
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        {drawn ? (
          <TarotCard
            card={drawn.card}
            isReversed={drawn.isReversed}
            isRevealed={revealedIndices.includes(0)}
            isSelected={selectedIndex === 0}
            onClick={() => onCardClick(0)}
            size={cardSize}
          />
        ) : (
          <CardBack size={cardSize} />
        )}
        <span className="text-sm text-slate-400 tracking-wide">
          {drawn?.positionLabel ?? labels[0]}
        </span>
      </div>
    );
  }

  if (spreadType === 'three') {
    return (
      <div className="flex items-center justify-center gap-6 md:gap-10">
        {[0, 1, 2].map((i) => {
          const drawn = getDrawnCard(i);
          return (
            <div key={i} className="flex flex-col items-center gap-3">
              {drawn ? (
                <TarotCard
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  isRevealed={revealedIndices.includes(i)}
                  isSelected={selectedIndex === i}
                  onClick={() => onCardClick(i)}
                  size={cardSize}
                />
              ) : (
                <CardBack size={cardSize} />
              )}
              <span className="text-xs md:text-sm text-slate-400 tracking-wide">
                {drawn?.positionLabel ?? labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Celtic Cross
  return (
    <div className="relative mx-auto" style={{ width: 760, height: 520, maxWidth: '100%' }}>
      {celticPositions.map((pos, i) => {
        const drawn = getDrawnCard(i);
        return (
          <div
            key={i}
            className="absolute flex flex-col items-center gap-1.5"
            style={{
              left: pos.left,
              top: pos.top,
              transform: pos.rotate ? `rotate(${pos.rotate}deg)` : undefined,
              transformOrigin: 'center center',
            }}
          >
            {drawn ? (
              <div style={{ transform: pos.rotate ? `rotate(${-pos.rotate}deg)` : undefined }}>
                <TarotCard
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  isRevealed={revealedIndices.includes(i)}
                  isSelected={selectedIndex === i}
                  onClick={() => onCardClick(i)}
                  size={cardSize}
                />
              </div>
            ) : (
              <CardBack size={cardSize} />
            )}
            <span
              className="text-[10px] text-slate-400 tracking-wide whitespace-nowrap"
              style={{ transform: pos.rotate ? `rotate(${-pos.rotate}deg)` : undefined }}
            >
              {drawn?.positionLabel ?? labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
