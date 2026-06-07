'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TarotCard from './TarotCard';
import CardBack from './CardBack';
import { SpreadType, DrawnCard } from '@/types/tarot';

gsap.registerPlugin(useGSAP);

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
  { left: '28%', top: '30%' },
  { left: '28%', top: '30%', rotate: 90 },
  { left: '28%', top: '2%' },
  { left: '28%', top: '58%' },
  { left: '4%', top: '30%' },
  { left: '52%', top: '30%' },
  { left: '76%', top: '6%' },
  { left: '76%', top: '22%' },
  { left: '76%', top: '38%' },
  { left: '76%', top: '54%' },
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

/* ============================================================
   Three Card Spread — Ritual: draw up → flip → place down
   ============================================================ */

function ThreeCardSpread({
  drawnCards,
  revealedIndices,
  selectedIndex,
  onCardClick,
  labels,
}: {
  drawnCards: DrawnCard[];
  revealedIndices: number[];
  selectedIndex: number | null;
  onCardClick: (index: number) => void;
  labels: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const timelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const cardSize: 'sm' | 'md' = isMobile ? 'sm' : 'md';
  const dims = sizeMap[cardSize];
  const allRevealed = drawnCards.length > 0 && revealedIndices.length >= 3;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDrawnCard = (positionIndex: number) =>
    drawnCards.find((d) => d.position === positionIndex);

  const getOffsets = useCallback(
    (i: number) => ({
      x: [isMobile ? -6 : -12, 0, isMobile ? 6 : 12][i],
      y: [4, 0, 4][i],
      rotation: [isMobile ? -3 : -6, 0, isMobile ? 3 : 6][i],
    }),
    [isMobile]
  );

  // ── Initial stack position ──
  useGSAP(
    () => {
      cardWrapRefs.current.forEach((el, i) => {
        if (!el || revealedIndices.includes(i)) return;
        const off = getOffsets(i);
        gsap.set(el, {
          x: off.x,
          y: off.y + 40,
          rotation: off.rotation,
          scale: 1,
        });
      });
    },
    { scope: containerRef, dependencies: [isMobile] }
  );

  // ── Idle breathing for unrevealed cards ──
  useGSAP(
    () => {
      if (allRevealed) return;
      cardWrapRefs.current.forEach((el, i) => {
        if (!el || revealedIndices.includes(i)) return;
        gsap.to(el, {
          y: '+=4',
          scale: 1.015,
          duration: 2 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    },
    { scope: containerRef, dependencies: [allRevealed, revealedIndices], revertOnUpdate: true }
  );

  // ── Card reveal animation: draw up → place down ──
  useGSAP(
    () => {
      const gap = isMobile ? 12 : 28;
      const cardWidth = dims.w;
      const spreadDistance = cardWidth + gap;

      cardWrapRefs.current.forEach((el, i) => {
        if (!el) return;
        const isRevealed = revealedIndices.includes(i);
        const wasRevealedBefore = timelineRefs.current[i] !== null;

        if (!isRevealed || wasRevealedBefore) return;

        gsap.killTweensOf(el);

        const targetX = (i - 1) * spreadDistance;
        const targetRotation = (i - 1) * (isMobile ? 1 : 2);

        const tl = gsap.timeline({
          defaults: { duration: 0.5, ease: 'power2.out' },
        });

        // Phase 1: Draw up
        tl.to(el, { y: -40, scale: 1.05, duration: 0.35 });

        // Phase 2: Place down (overlap with flip handled by TarotCard)
        tl.to(
          el,
          {
            x: targetX,
            y: 30,
            rotation: targetRotation,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
          },
          '<0.1'
        );

        timelineRefs.current[i] = tl;
      });
    },
    { scope: containerRef, dependencies: [revealedIndices, isMobile, dims.w] }
  );

  // ── All revealed: preview panel fades in ──
  useGSAP(
    () => {
      if (!allRevealed || !previewRef.current) return;
      gsap.fromTo(
        previewRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out', delay: 0.5 }
      );
    },
    { scope: containerRef, dependencies: [allRevealed] }
  );

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title hint */}
      {!allRevealed && (
        <p className="text-sm text-[var(--text-muted)] mb-8 text-center animate-pulse">
          {revealedIndices.length === 0
            ? '✦ 点击牌背，翻开你的第一张牌'
            : revealedIndices.length === 1
            ? '✦ 再翻开一张'
            : '✦ 翻开最后一张'}
        </p>
      )}

      {/* Cards area */}
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{
          width: '100%',
          maxWidth: isMobile ? 340 : 660,
          height: dims.h + (isMobile ? 60 : 100),
        }}
      >
        {[0, 1, 2].map((i) => {
          const drawn = getDrawnCard(i);
          const isRevealed = revealedIndices.includes(i);

          return (
            <div
              key={i}
              ref={(el) => {
                cardWrapRefs.current[i] = el;
              }}
              className="absolute flex flex-col items-center"
              style={{
                left: '50%',
                top: '50%',
                width: dims.w,
                marginLeft: -dims.w / 2,
                marginTop: -dims.h / 2,
                zIndex: isRevealed ? 5 + i : 20 - i,
                cursor: isRevealed ? 'default' : 'pointer',
                willChange: 'transform, opacity',
              }}
            >
              {drawn ? (
                <TarotCard
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  isRevealed={isRevealed}
                  isSelected={selectedIndex === i}
                  onClick={() => {
                    if (!isRevealed) onCardClick(i);
                  }}
                  size={cardSize}
                />
              ) : (
                <CardBack size={cardSize} />
              )}

              {/* Position label */}
              <div
                className="mt-3 transition-opacity duration-700"
                style={{ opacity: isRevealed ? 1 : 0 }}
              >
                <PillLabel>{drawn?.positionLabel ?? labels[i]}</PillLabel>
              </div>
            </div>
          );
        })}
      </div>

      {/* Counter */}
      {!allRevealed && (
        <p className="mt-6 text-[var(--text-muted)] text-sm">
          已翻开 {revealedIndices.length} / 3 张
        </p>
      )}

      {/* All revealed — preview panel */}
      {allRevealed && (
        <div
          ref={previewRef}
          className="mt-6 w-full max-w-md mx-auto text-center px-4"
          style={{ visibility: 'hidden' }}
        >
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{
              background: 'rgba(201, 162, 39, 0.05)',
              border: '1px solid rgba(201, 162, 39, 0.15)',
            }}
          >
            <p
              className="text-sm mb-4"
              style={{
                color: 'var(--accent)',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.08em',
              }}
            >
              ✦ 命运之轮已转动 ✦
            </p>
            <div className="space-y-2">
              {drawnCards.map((drawn) => (
                <p
                  key={drawn.position}
                  className="text-sm"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>
                    {drawn.positionLabel}
                  </span>{' '}
                  · {drawn.card.name}
                  {drawn.isReversed && (
                    <span className="text-[var(--text-muted)] ml-1">（逆位）</span>
                  )}
                </p>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4 animate-pulse">
              正在进入深度解读...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Main CardSpread component
   ============================================================ */

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

  // ── Single card ──
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

  // ── Three cards — ritual spread ──
  if (spreadType === 'three') {
    return (
      <ThreeCardSpread
        drawnCards={drawnCards}
        revealedIndices={revealedIndices}
        selectedIndex={selectedIndex}
        onCardClick={onCardClick}
        labels={labels}
      />
    );
  }

  // ── Celtic Cross ──
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
