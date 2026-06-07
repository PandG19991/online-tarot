'use client';

import React from 'react';

interface CardBackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { w: 120, h: 190 },
  md: { w: 180, h: 280 },
  lg: { w: 220, h: 340 },
};

export default function CardBack({ className = '', size = 'md' }: CardBackProps) {
  const { w, h } = sizeMap[size];
  const scale = w / 180;

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        width: w,
        height: h,
        background: 'linear-gradient(145deg, #1a0f3c 0%, #0f0820 40%, #1a0f3c 100%)',
        boxShadow: `
          inset 0 0 40px rgba(139, 92, 246, 0.12),
          0 4px 24px rgba(0, 0, 0, 0.5),
          0 0 16px rgba(139, 92, 246, 0.15)
        `,
      }}
    >
      <style>{`
        @keyframes cardBackPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        @keyframes cardBackRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cardBackTwinkle {
          0%, 100% { transform: scale(0.8); opacity: 0.2; }
          50% { transform: scale(1.8); opacity: 0.9; }
        }
      `}</style>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
          animation: 'cardBackPulse 3s ease-in-out infinite',
        }}
      />

      {/* Outer frame */}
      <div
        className="absolute rounded-lg pointer-events-none"
        style={{
          inset: 8 * scale,
          border: '1px solid rgba(251, 191, 36, 0.25)',
          boxShadow: 'inset 0 0 12px rgba(251, 191, 36, 0.08)',
        }}
      />

      {/* Crosshair lines */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 8 * scale,
          background: `
            linear-gradient(90deg, transparent calc(50% - 0.5px), rgba(251, 191, 36, 0.2) 50%, transparent calc(50% + 0.5px)),
            linear-gradient(0deg, transparent calc(50% - 0.5px), rgba(251, 191, 36, 0.2) 50%, transparent calc(50% + 0.5px))
          `,
        }}
      />

      {/* Corner marks */}
      {[
        { t: 8 * scale, l: 8 * scale },
        { t: 8 * scale, r: 8 * scale },
        { b: 8 * scale, l: 8 * scale },
        { b: 8 * scale, r: 8 * scale },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: 10 * scale,
            height: 10 * scale,
            ...pos,
            borderTop: 't' in pos ? `${2 * scale}px solid rgba(251, 191, 36, 0.5)` : 'none',
            borderBottom: 'b' in pos ? `${2 * scale}px solid rgba(251, 191, 36, 0.5)` : 'none',
            borderLeft: 'l' in pos ? `${2 * scale}px solid rgba(251, 191, 36, 0.5)` : 'none',
            borderRight: 'r' in pos ? `${2 * scale}px solid rgba(251, 191, 36, 0.5)` : 'none',
          }}
        />
      ))}

      {/* Central rotating symbol */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ animation: 'cardBackRotate 24s linear infinite' }}
      >
        <svg width={70 * scale} height={70 * scale} viewBox="0 0 100 100">
          {/* Outer ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(251, 191, 36, 0.35)" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* Inner star octagon */}
          <polygon
            points="50,10 55,45 90,50 55,55 50,90 45,55 10,50 45,45"
            fill="none"
            stroke="rgba(251, 191, 36, 0.3)"
            strokeWidth="0.6"
          />

          {/* Crescent moon */}
          <path
            d="M50 18 A32 32 0 1 1 50 82 A24 24 0 1 0 50 18 Z"
            fill="rgba(251, 191, 36, 0.15)"
            stroke="rgba(251, 191, 36, 0.35)"
            strokeWidth="0.6"
          />

          {/* Eye */}
          <ellipse cx="50" cy="50" rx="16" ry="10" fill="none" stroke="rgba(251, 191, 36, 0.45)" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="5" fill="rgba(139, 92, 246, 0.4)" />
          <circle cx="50" cy="50" r="2" fill="rgba(251, 191, 36, 0.8)" />

          {/* Star at top */}
          <polygon
            points="50,4 52,12 60,12 54,17 56,25 50,20 44,25 46,17 40,12 48,12"
            fill="rgba(251, 191, 36, 0.6)"
          />

          {/* Small corner stars */}
          <polygon points="18,30 19,33 22,33 20,35 21,38 18,36 15,38 16,35 14,33 17,33" fill="rgba(251, 191, 36, 0.35)" />
          <polygon points="82,30 83,33 86,33 84,35 85,38 82,36 79,38 80,35 78,33 81,33" fill="rgba(251, 191, 36, 0.35)" />
          <polygon points="18,70 19,73 22,73 20,75 21,78 18,76 15,78 16,75 14,73 17,73" fill="rgba(251, 191, 36, 0.35)" />
          <polygon points="82,70 83,73 86,73 84,75 85,78 82,76 79,78 80,75 78,73 81,73" fill="rgba(251, 191, 36, 0.35)" />
        </svg>
      </div>

      {/* Sparkles */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const dist = 30;
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 2,
              height: 2,
              top: `calc(50% + ${Math.sin(angle) * dist}%)`,
              left: `calc(50% + ${Math.cos(angle) * dist}%)`,
              background: '#fbbf24',
              animation: `cardBackTwinkle ${2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        );
      })}
    </div>
  );
}
