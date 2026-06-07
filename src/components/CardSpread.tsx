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

const defaultLabels: Record<SpreadType, string[]> = {
  single: ['指引'],
  three: ['过去', '现在', '未来'],
  celtic: ['现状', '挑战', '意识', '基础', '过去', '未来', '自我', '环境', '希望/恐惧', '结果'],
};

const celticLayout = [
  { left: '28%', top: '30%' },              // 0 现状
  { left: '28%', top: '30%', rotate: 90 },  // 1 挑战
  { left: '28%', top: '2%' },               // 2 意识
  { left: '28%', top: '58%' },              // 3 基础
  { left: '4%', top: '30%' },               // 4 过去
  { left: '52%', top: '30%' },              // 5 未来
  { left: '76%', top: '6%' },               // 6 自我
  { left: '76%', top: '22%' },              // 7 环境
  { left: '76%', top: '38%' },              // 8 希望/恐惧
  { left: '76%', top: '54%' },              // 9 结果
];

const sizeMap = {
  sm: { w: 120, h: 190 },
  md: { w: 180, h: 280 },
  lg: { w: 240, h: 360 },
};

function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mt-2 inline-block rounded-full px-3 py-1 text-[10px] tracking-wider whitespace-nowrap"
      style={{
        border: '1px solid rgba(201, 162, 39, 0.2)',
        background: 'rgba(201, 162, 39, 0.05)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {children}
    </span>
  );
}

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

  const renderCard = (posIndex: number) => {
    const drawn = getDrawnCard(posIndex);
    return drawn ? (
      <TarotCard
        card={drawn.card}
        isReversed={drawn.isReversed}
        isRevealed={revealedIndices.includes(posIndex)}
        isSelected={selectedIndex === posIndex}
        onClick={() => onCardClick(posIndex)}
        size={cardSize}
      />
    ) : (
      <CardBack size={cardSize} />
    );
  };

  const renderLabel = (posIndex: number) => (
    <PillLabel>
      {getDrawnCard(posIndex)?.positionLabel ?? labels[posIndex]}
    </PillLabel>
  );

  if (spreadType === 'single') {
    const drawn = getDrawnCard(0);
    return (
      <div className="flex flex-col items-center justify-center">
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
        <PillLabel>{drawn?.positionLabel ?? labels[0]}</PillLabel>
      </div>
    );
  }

  if (spreadType === 'three') {
    const zIndexMap = [1, 2, 1];
    return (
      <div className="flex items-center justify-center">
        {[0, 1, 2].map((i) => {
          const drawn = getDrawnCard(i);
          return (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{
                zIndex: zIndexMap[i],
                marginLeft: i === 0 ? 0 : -60,
                marginRight: i === 2 ? 0 : -60,
              }}
            >
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
              <PillLabel>{drawn?.positionLabel ?? labels[i]}</PillLabel>
            </div>
          );
        })}
      </div>
    );
  }

  // Celtic Cross
  return (
    <div
      className="relative mx-auto"
      style={{ width: 800, height: 560, maxWidth: '100%' }}
    >
      {celticLayout.map((pos, i) => {
        const dims = sizeMap[cardSize];
        return (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{
              left: pos.left,
              top: pos.top,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {pos.rotate ? (
              <div
                style={{
                  position: 'relative',
                  width: dims.h,
                  height: dims.w,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                  }}
                >
                  {renderCard(i)}
                </div>
              </div>
            ) : (
              renderCard(i)
            )}
            {renderLabel(i)}
          </div>
        );
      })}
    </div>
  );
}
