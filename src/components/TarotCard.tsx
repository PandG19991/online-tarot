'use client';

import React from 'react';
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
  lg: { w: 220, h: 340, nameSize: 16, numSize: 13, symbolSize: 110, tagSize: 11, pad: 14 },
};

function getCardColor(card: TarotCardType): string {
  if (card.arcana === 'major') {
    if (card.number <= 2) return '#8b5cf6';
    if (card.number <= 5) return '#10b981';
    if (card.number <= 8) return '#f43f5e';
    if (card.number <= 11) return '#0ea5e9';
    if (card.number <= 14) return '#f59e0b';
    if (card.number <= 16) return '#dc2626';
    return '#fbbf24';
  }
  switch (card.suit) {
    case 'wands': return '#ea580c';
    case 'cups': return '#0284c7';
    case 'swords': return '#64748b';
    case 'pentacles': return '#15803d';
    default: return '#8b5cf6';
  }
}

function MajorArcanaSymbol({ number, color, size }: { number: number; color: string; size: number }) {
  const fill = color + '18';
  const stroke = color;

  if (number <= 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="38" cy="50" r="26" fill="none" stroke={stroke} strokeWidth="2" opacity="0.8" />
        <circle cx="62" cy="50" r="26" fill="none" stroke={stroke} strokeWidth="2" opacity="0.8" />
        <circle cx="38" cy="50" r="5" fill={stroke} opacity="0.5" />
        <circle cx="62" cy="50" r="5" fill={stroke} opacity="0.5" />
      </svg>
    );
  }
  if (number <= 5) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M22 66 L22 42 L36 56 L50 32 L64 56 L78 42 L78 66 Z" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="22" cy="42" r="3.5" fill={stroke} />
        <circle cx="50" cy="32" r="4.5" fill={stroke} />
        <circle cx="78" cy="42" r="3.5" fill={stroke} />
        <line x1="22" y1="66" x2="78" y2="66" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }
  if (number <= 8) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M50 78 C50 78 22 55 22 40 C22 29 31 22 40 22 C45 22 50 26 50 26 C50 26 55 22 60 22 C69 22 78 29 78 40 C78 55 50 78 50 78 Z" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M22 36 Q8 31 8 45 Q8 54 22 49" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M78 36 Q92 31 92 45 Q92 54 78 49" fill="none" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  }
  if (number <= 11) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="50" r="24" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50" y1="16" x2="50" y2="84" stroke={stroke} strokeWidth="1.5" />
        <line x1="16" y1="50" x2="84" y2="50" stroke={stroke} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="5" fill={stroke} />
      </svg>
    );
  }
  if (number <= 14) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,22 78,72 22,72" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="50" y1="50" x2="50" y2="84" stroke={stroke} strokeWidth="2" />
        <line x1="36" y1="66" x2="64" y2="66" stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="50" r="4" fill={stroke} />
      </svg>
    );
  }
  if (number <= 16) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,84 22,36 84,36 16,62 96,62" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="50" r="36" fill="none" stroke={stroke} strokeWidth="1" opacity="0.5" />
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
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.5" />;
      })}
      <polygon points="50,20 55,40 78,40 60,54 66,74 50,62 34,74 40,54 22,40 45,40" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function MinorArcanaSymbol({ suit, color, size }: { suit: 'wands' | 'cups' | 'swords' | 'pentacles'; color: string; size: number }) {
  const fill = color + '18';
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

  const glowColor = isSelected ? 'rgba(251, 191, 36, 0.22)' : 'rgba(139, 92, 246, 0.18)';
  const borderColor = isSelected ? '#fbbf24' : color + '60';

  return (
    <div
      className="perspective-1000 cursor-pointer group relative"
      style={{ width: dims.w, height: dims.h }}
      onClick={onClick}
    >
      {/* Lift wrapper */}
      <div
        className={`relative transition-transform duration-300 ${
          isSelected ? '-translate-y-1' : 'group-hover:-translate-y-2'
        }`}
      >
        {/* Glow layer */}
        <div
          className={`absolute -inset-4 rounded-2xl pointer-events-none transition-opacity duration-300 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{
            background: `radial-gradient(circle at 50% 45%, ${glowColor} 0%, transparent 65%)`,
            zIndex: 0,
          }}
        />

        {/* 3D Flipper */}
        <div
          className="transform-style-3d relative"
          style={{
            width: dims.w,
            height: dims.h,
            transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1,
          }}
        >
          {/* Side A: CardBack (visible when rotateY = 0) */}
          <div className="backface-hidden absolute inset-0 rounded-xl overflow-hidden">
            <CardBack size={size} className="w-full h-full" />
          </div>

          {/* Side B: CardFace (visible when rotateY = 180) */}
          <div
            className="backface-hidden absolute inset-0 rounded-xl overflow-hidden flex flex-col"
            style={{
              width: dims.w,
              height: dims.h,
              background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)',
              border: `2px solid ${borderColor}`,
              boxShadow: `
                inset 0 0 20px ${color}18,
                0 0 ${isSelected ? 24 : 12}px ${isSelected ? 'rgba(251,191,36,0.35)' : color + '30'}
              `,
              transform: `rotateY(180deg) ${isReversed ? 'rotate(180deg)' : ''}`,
            }}
          >
            {/* Inner color glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${color}12 0%, transparent 60%)`,
              }}
            />

            {/* Header: name + number */}
            <div
              className="relative z-10 flex items-start justify-between shrink-0"
              style={{ padding: `${dims.pad}px ${dims.pad}px 0` }}
            >
              <span
                className="font-bold text-white leading-tight"
                style={{ fontSize: dims.nameSize, maxWidth: '78%' }}
              >
                {card.name}
              </span>
              <span
                className="tabular-nums shrink-0 ml-1"
                style={{ fontSize: dims.numSize, color: color + 'cc' }}
              >
                {card.arcana === 'major' ? String(card.number).padStart(2, '0') : card.number}
              </span>
            </div>

            {/* Divider */}
            <div
              className="relative z-10 mx-auto mt-1.5 shrink-0"
              style={{
                width: '55%',
                height: 1,
                background: `linear-gradient(90deg, transparent, ${color}50, transparent)`,
              }}
            />

            {/* Symbol */}
            <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 py-1">
              {card.arcana === 'major' ? (
                <MajorArcanaSymbol number={card.number} color={color} size={dims.symbolSize} />
              ) : (
                <MinorArcanaSymbol suit={card.suit!} color={color} size={dims.symbolSize} />
              )}
            </div>

            {/* Keywords */}
            <div
              className="relative z-10 flex flex-wrap justify-center gap-1 shrink-0"
              style={{ padding: `0 ${dims.pad}px ${dims.pad}px` }}
            >
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded px-1 py-0.5 whitespace-nowrap"
                  style={{
                    fontSize: dims.tagSize,
                    background: color + '18',
                    color: color,
                    border: `1px solid ${color}35`,
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
  );
}
