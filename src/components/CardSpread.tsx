'use client';

import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import gsap from 'gsap';
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

/* ============================================================
   Three Card Spread — Fan stack → Flip & spread → Rise & reveal
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
  const idleTweenRefs = useRef<(gsap.core.Tween | undefined)[]>([]);
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

  // ── Idle breathing animation for stacked cards ──
  useLayoutEffect(() => {
    if (allRevealed) {
      idleTweenRefs.current.forEach((t) => t?.kill());
      idleTweenRefs.current = [];
      return;
    }

    cardWrapRefs.current.forEach((el, i) => {
      if (!el || revealedIndices.includes(i)) return;
      const t = gsap.to(el, {
        y: '+=3',
        scale: 1.01,
        duration: 1.8 + i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      idleTweenRefs.current[i] = t;
    });

    return () => {
      idleTweenRefs.current.forEach((t) => t?.kill());
    };
  }, [allRevealed, revealedIndices]);

  // ── Card position animation: stack ↔ spread ──
  useLayoutEffect(() => {
    const gap = isMobile ? 16 : 32;
    const cardWidth = dims.w;
    const spreadDistance = cardWidth + gap;

    // Fan-shaped stack offsets (visible & clickable)
    const stackOffsets = [
      { x: isMobile ? -10 : -30, y: isMobile ? 6 : 10, rotation: isMobile ? -5 : -10 },
      { x: 0, y: 0, rotation: 0 },
      { x: isMobile ? 10 : 30, y: isMobile ? 6 : 10, rotation: isMobile ? 5 : 10 },
    ];

    const tweens: gsap.core.Tween[] = [];

    cardWrapRefs.current.forEach((el, i) => {
      if (!el) return;
      const isRevealed = revealedIndices.includes(i);

      // Kill idle tween for this card when revealed
      if (isRevealed && idleTweenRefs.current[i]) {
        idleTweenRefs.current[i].kill();
        idleTweenRefs.current[i] = undefined;
      }

      if (isRevealed) {
        // Spread to horizontal positions
        const targetX = (i - 1) * spreadDistance;
        const targetY = 0;
        const targetRotation = (i - 1) * (isMobile ? 1 : 2);

        tweens.push(
          gsap.to(el, {
            x: targetX,
            y: targetY,
            rotation: targetRotation,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            delay: 0.05,
          })
        );
      } else {
        // Stack with fan offset
        tweens.push(
          gsap.to(el, {
            x: stackOffsets[i].x,
            y: stackOffsets[i].y,
            rotation: stackOffsets[i].rotation,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        );
      }
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [revealedIndices, isMobile, dims.w]);

  // ── All revealed: container rises + preview fades in ──
  useLayoutEffect(() => {
    if (!allRevealed || !containerRef.current) return;

    const tl = gsap.timeline();

    // Cards container rises
    tl.to(containerRef.current, {
      y: isMobile ? -30 : -50,
      duration: 1.2,
      ease: 'power2.out',
    }, 0.2);

    // Preview panel fades in
    if (previewRef.current) {
      tl.fromTo(
        previewRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
        0.8
      );
    }

    return () => {
      tl.kill();
    };
  }, [allRevealed, isMobile]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title hint */}
      {!allRevealed && (
        <p className="text-sm text-[var(--text-muted)] mb-6 text-center animate-pulse">
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
          maxWidth: isMobile ? 360 : 700,
          height: dims.h + (isMobile ? 50 : 80),
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
                zIndex: isRevealed ? 10 + i : 3 - i,
                cursor: isRevealed ? 'default' : 'pointer',
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

              {/* Position label — shows after reveal */}
              <div
                className="mt-3 transition-opacity duration-500"
                style={{ opacity: isRevealed ? 1 : 0 }}
              >
                <PillLabel>{drawn?.positionLabel ?? labels[i]}</PillLabel>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal counter */}
      {!allRevealed && (
        <p className="mt-6 text-[var(--text-muted)] text-sm">
          已翻开 {revealedIndices.length} / 3 张
        </p>
      )}

      {/* All revealed — preview panel */}
      {allRevealed && (
        <div
          ref={previewRef}
          className="mt-4 w-full max-w-md mx-auto text-center px-4"
          style={{ opacity: 0 }}
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

  // ── Three cards — use animated spread ──
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
