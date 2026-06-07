'use client';

import React, { useState, useMemo } from 'react';
import CardBack from './CardBack';
import { TarotCard as TarotCardType } from '@/types/tarot';

interface TarotCardProps {
  card: TarotCardType;
  isReversed?: boolean;
  isRevealed?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { w: 120, h: 190, nameSize: 11, numSize: 9, symbolSize: 48, tagSize: 8, pad: 6 },
  md: { w: 180, h: 280, nameSize: 14, numSize: 11, symbolSize: 80, tagSize: 10, pad: 10 },
  lg: { w: 240, h: 360, nameSize: 18, numSize: 14, symbolSize: 120, tagSize: 12, pad: 16 },
};

function toRoman(num: number): string {
  if (num === 0) return '0';
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  let n = num;
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return result;
}

function getCardColor(card: TarotCardType): string {
  if (card.arcana === 'major') {
    if (card.number <= 2) return '#8b5cf6'; // violet
    if (card.number <= 5) return '#10b981'; // emerald
    if (card.number <= 8) return '#f43f5e'; // rose
    if (card.number <= 11) return '#0ea5e9'; // sky
    if (card.number <= 14) return '#f59e0b'; // amber
    if (card.number <= 16) return '#dc2626'; // crimson
    return '#fbbf24'; // gold
  }
  switch (card.suit) {
    case 'wands': return '#ea580c';
    case 'cups': return '#0284c7';
    case 'swords': return '#64748b';
    case 'pentacles': return '#15803d';
    default: return '#8b5cf6';
  }
}

/* ─────────────── SVG Symbols ─────────────── */

function MajorArcanaSymbol({ number, color, size }: { number: number; color: string; size: number }) {
  const fill = color + '15';
  const stroke = color;

  if (number <= 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="38" cy="50" r="26" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.8" />
        <circle cx="62" cy="50" r="26" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.8" />
        <circle cx="38" cy="50" r="5" fill={stroke} opacity="0.5" />
        <circle cx="62" cy="50" r="5" fill={stroke} opacity="0.5" />
        <path d="M38 24 Q50 18 62 24" fill="none" stroke={stroke} strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }
  if (number <= 5) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M22 66 L22 42 L36 56 L50 32 L64 56 L78 42 L78 66 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <circle cx="22" cy="42" r="3.5" fill={stroke} />
        <circle cx="50" cy="32" r="4.5" fill={stroke} />
        <circle cx="78" cy="42" r="3.5" fill={stroke} />
        <line x1="22" y1="66" x2="78" y2="66" stroke={stroke} strokeWidth="1.5" />
        <path d="M50 22 L50 32" stroke={stroke} strokeWidth="1" opacity="0.5" />
      </svg>
    );
  }
  if (number <= 8) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M50 78 C50 78 22 55 22 40 C22 29 31 22 40 22 C45 22 50 26 50 26 C50 26 55 22 60 22 C69 22 78 29 78 40 C78 55 50 78 50 78 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M22 36 Q8 31 8 45 Q8 54 22 49" fill="none" stroke={stroke} strokeWidth="1.2" />
        <path d="M78 36 Q92 31 92 45 Q92 54 78 49" fill="none" stroke={stroke} strokeWidth="1.2" />
        <circle cx="50" cy="50" r="3" fill={stroke} opacity="0.6" />
      </svg>
    );
  }
  if (number <= 11) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="24" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50" y1="16" x2="50" y2="84" stroke={stroke} strokeWidth="1.2" />
        <line x1="16" y1="50" x2="84" y2="50" stroke={stroke} strokeWidth="1.2" />
        <circle cx="50" cy="50" r="5" fill={stroke} />
        <circle cx="50" cy="50" r="12" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
      </svg>
    );
  }
  if (number <= 14) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,22 78,72 22,72" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <line x1="50" y1="50" x2="50" y2="84" stroke={stroke} strokeWidth="1.5" />
        <line x1="36" y1="66" x2="64" y2="66" stroke={stroke} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill={stroke} />
        <path d="M30 72 Q50 88 70 72" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  }
  if (number <= 16) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,84 22,36 84,36 16,62 96,62" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke={stroke} strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="18" x2="50" y2="82" stroke={stroke} strokeWidth="0.8" opacity="0.3" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="4" fill={stroke} />
      {[...Array(8)].map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = 50 + Math.cos(a) * 14;
        const y1 = 50 + Math.sin(a) * 14;
        const x2 = 50 + Math.cos(a) * 36;
        const y2 = 50 + Math.sin(a) * 36;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.2" />;
      })}
      <polygon points="50,20 55,40 78,40 60,54 66,74 50,62 34,74 40,54 22,40 45,40" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <circle cx="50" cy="50" r="20" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function MinorArcanaSymbol({ suit, color, size }: { suit: 'wands' | 'cups' | 'swords' | 'pentacles'; color: string; size: number }) {
  const fill = color + '15';
  const stroke = color;

  switch (suit) {
    case 'wands':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <line x1="50" y1="78" x2="50" y2="26" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <path d="M45 30 Q50 18 55 30 Q50 38 45 30" fill={stroke} />
          <path d="M40 36 Q34 28 41 33" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M60 36 Q66 28 59 33" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M38 46 Q30 42 38 44" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M62 46 Q70 42 62 44" fill="none" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'cups':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M36 36 L36 54 Q36 72 50 72 Q64 72 64 54 L64 36 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <line x1="50" y1="22" x2="50" y2="36" stroke={stroke} strokeWidth="2" />
          <ellipse cx="50" cy="22" rx="7" ry="3.5" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M45 58 Q50 66 55 58" fill="none" stroke={stroke} strokeWidth="1" opacity="0.6" />
        </svg>
      );
    case 'swords':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <line x1="50" y1="82" x2="50" y2="22" stroke={stroke} strokeWidth="2.5" />
          <line x1="36" y1="36" x2="64" y2="36" stroke={stroke} strokeWidth="2" />
          <line x1="39" y1="32" x2="61" y2="32" stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="42" r="3" fill="none" stroke={stroke} strokeWidth="1" />
          <polygon points="50,18 47,24 53,24" fill={stroke} />
        </svg>
      );
    case 'pentacles':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="28" fill={fill} stroke={stroke} strokeWidth="2" />
          <polygon points="50,30 60,42 57,58 43,58 40,42" fill="none" stroke={stroke} strokeWidth="1.5" />
          <line x1="50" y1="30" x2="43" y2="58" stroke={stroke} strokeWidth="1" />
          <line x1="50" y1="30" x2="57" y2="58" stroke={stroke} strokeWidth="1" />
          <line x1="40" y1="42" x2="60" y2="42" stroke={stroke} strokeWidth="1" />
          <circle cx="50" cy="48" r="5" fill="none" stroke={stroke} strokeWidth="1" opacity="0.5" />
        </svg>
      );
  }
}

/* ─────────────── Grain texture data URI ─────────────── */

const grainSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

/* ─────────────── Component ─────────────── */

export default function TarotCard({
  card,
  isReversed = false,
  isRevealed = false,
  isSelected = false,
  onClick,
  size = 'md',
}: TarotCardProps) {
  const dims = sizeMap[size];
  const color = getCardColor(card);
  const keywords = card.keywords.slice(0, 3);
  const [isHovered, setIsHovered] = useState(false);

  const romanNum = useMemo(() => {
    if (card.arcana === 'major') return toRoman(card.number);
    return String(card.number);
  }, [card.arcana, card.number]);

  const liftY = isHovered ? -10 : isSelected ? -4 : 0;
  const glowOpacity = isSelected ? 1 : isHovered ? 0.55 : 0;

  const selectedOuterStyles = isSelected
    ? {
        borderColor: 'rgba(201, 162, 39, 0.85)',
        boxShadow: `
          0 0 0 1px rgba(201, 162, 39, 0.15),
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          inset 0 1px 1px rgba(255,255,255,0.05),
          0 0 30px rgba(201, 162, 39, 0.25)
        `,
      }
    : {};

  return (
    <div
      className="perspective-1000 cursor-pointer group relative"
      style={{ width: dims.w, height: dims.h }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Glow layer ── */}
      <div
        className="absolute -inset-4 rounded-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(201, 162, 39, 0.35) 0%, transparent 65%)',
          opacity: glowOpacity,
          transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 0,
        }}
      />

      {/* ── Lift wrapper ── */}
      <div
        className="relative"
        style={{
          transform: `translateY(${liftY}px)`,
          transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 1,
        }}
      >
        {/* ── 3D Flipper ── */}
        <div
          className="transform-style-3d relative"
          style={{
            width: dims.w,
            height: dims.h,
            transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
            willChange: 'transform',
          }}
        >
          {/* ═══ Side A: CardBack ═══ */}
          <div className="backface-hidden absolute inset-0 rounded-[24px] overflow-hidden">
            <CardBack size={size} />
          </div>

          {/* ═══ Side B: CardFace ═══ */}
          <div
            className="backface-hidden absolute inset-0"
            style={{
              width: dims.w,
              height: dims.h,
              transform: `rotateY(180deg) ${isReversed ? 'rotate(180deg)' : ''}`,
              zIndex: 1,
            }}
          >
            {/* Double-Bezel Outer */}
            <div
              className="card-outer"
              style={{
                width: dims.w,
                height: dims.h,
                transition: 'border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                ...selectedOuterStyles,
              }}
            >
              {/* Double-Bezel Inner */}
              <div
                className="card-inner"
                style={{
                  width: '100%',
                  height: '100%',
                  background: `
                    linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 60%),
                    ${grainSvg},
                    var(--card-inner)
                  `,
                  backgroundSize: '100% 100%, 200px 200px, 100% 100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Inner ambient color glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${color}10 0%, transparent 55%)`,
                    zIndex: 0,
                  }}
                />

                {/* ── Header: name + roman numeral ── */}
                <div
                  className="relative z-10 flex items-start justify-between shrink-0"
                  style={{ padding: `${dims.pad}px ${dims.pad}px 0` }}
                >
                  <span
                    className="leading-tight"
                    style={{
                      fontSize: dims.nameSize,
                      maxWidth: '78%',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {card.name}
                  </span>
                  <span
                    className="tabular-nums shrink-0 ml-1"
                    style={{
                      fontSize: dims.numSize,
                      color: color + 'cc',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 400,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {romanNum}
                  </span>
                </div>

                {/* ── Divider ── */}
                <div
                  className="relative z-10 mx-auto mt-1.5 shrink-0"
                  style={{
                    width: '55%',
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${color}45, transparent)`,
                  }}
                />

                {/* ── Symbol ── */}
                <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 py-1">
                  {card.arcana === 'major' ? (
                    <MajorArcanaSymbol number={card.number} color={color} size={dims.symbolSize} />
                  ) : (
                    <MinorArcanaSymbol suit={card.suit!} color={color} size={dims.symbolSize} />
                  )}
                </div>

                {/* ── Keywords ── */}
                <div
                  className="relative z-10 flex flex-wrap justify-center gap-1 shrink-0"
                  style={{ padding: `0 ${dims.pad}px ${dims.pad}px` }}
                >
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full px-1.5 py-0.5 whitespace-nowrap"
                      style={{
                        fontSize: dims.tagSize,
                        background: color + '16',
                        color: color,
                        border: `1px solid ${color}30`,
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
