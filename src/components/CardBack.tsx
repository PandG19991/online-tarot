'use client';

import React from 'react';

interface CardBackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { w: 120, h: 190 },
  md: { w: 180, h: 280 },
  lg: { w: 240, h: 360 },
};

/* ── Grid texture SVG ── */
const gridSvg = `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 24 0 L 0 0 0 24' fill='none' stroke='rgba(201,162,39,0.07)' stroke-width='0.5'/%3E%3C/svg%3E")`;

export default function CardBack({ className = '', size = 'md' }: CardBackProps) {
  const { w, h } = sizeMap[size];
  const scale = w / 180;

  return (
    <div className={className} style={{ width: w, height: h }}>
      <style>{`
        @keyframes cardBackBreathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.08); }
        }
        @keyframes cardBackRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cornerStarTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
      `}</style>

      {/* ═════ Double-Bezel Outer ═════ */}
      <div
        className="card-outer"
        style={{
          width: w,
          height: h,
          background: 'linear-gradient(145deg, #1a0b2e 0%, #0d0221 100%)',
        }}
      >
        {/* ═════ Double-Bezel Inner ═════ */}
        <div
          className="card-inner"
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(160deg, #1a0b2e 0%, #120624 50%, #0d0221 100%)',
          }}
        >
          {/* ── Grid texture overlay ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: gridSvg,
              backgroundSize: `${24 * scale}px ${24 * scale}px`,
              opacity: 0.5,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* ── Breathing radial glow ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.18) 0%, transparent 55%)',
              animation: 'cardBackBreathe 3.5s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* ── Inner golden frame line ── */}
          <div
            style={{
              position: 'absolute',
              inset: 10 * scale,
              border: '1px solid rgba(201, 162, 39, 0.18)',
              borderRadius: 16 * scale,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* ── Crosshair ── */}
          <div
            style={{
              position: 'absolute',
              inset: 10 * scale,
              background: `
                linear-gradient(90deg, transparent calc(50% - 0.5px), rgba(201, 162, 39, 0.14) 50%, transparent calc(50% + 0.5px)),
                linear-gradient(0deg, transparent calc(50% - 0.5px), rgba(201, 162, 39, 0.14) 50%, transparent calc(50% + 0.5px))
              `,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* ── Corner L-brackets ── */}
          {[
            { top: 10 * scale, left: 10 * scale },
            { top: 10 * scale, right: 10 * scale },
            { bottom: 10 * scale, left: 10 * scale },
            { bottom: 10 * scale, right: 10 * scale },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 12 * scale,
                height: 12 * scale,
                ...pos,
                borderTop:
                  'top' in pos
                    ? `${1.5 * scale}px solid rgba(201, 162, 39, 0.45)`
                    : 'none',
                borderBottom:
                  'bottom' in pos
                    ? `${1.5 * scale}px solid rgba(201, 162, 39, 0.45)`
                    : 'none',
                borderLeft:
                  'left' in pos
                    ? `${1.5 * scale}px solid rgba(201, 162, 39, 0.45)`
                    : 'none',
                borderRight:
                  'right' in pos
                    ? `${1.5 * scale}px solid rgba(201, 162, 39, 0.45)`
                    : 'none',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          ))}

          {/* ── Central rotating star-moon symbol ── */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              animation: 'cardBackRotate 22s linear infinite',
              zIndex: 3,
            }}
          >
            <svg width={78 * scale} height={78 * scale} viewBox="0 0 100 100">
              {/* Outer ring */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(201, 162, 39, 0.3)"
                strokeWidth="0.7"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(124, 58, 237, 0.25)"
                strokeWidth="0.5"
                strokeDasharray="4 3"
              />

              {/* Inner octagram */}
              <polygon
                points="50,10 56,44 90,50 56,56 50,90 44,56 10,50 44,44"
                fill="none"
                stroke="rgba(201, 162, 39, 0.25)"
                strokeWidth="0.6"
              />

              {/* Crescent moon */}
              <path
                d="M50 16 A34 34 0 1 1 50 84 A26 26 0 1 0 50 16 Z"
                fill="rgba(201, 162, 39, 0.1)"
                stroke="rgba(201, 162, 39, 0.3)"
                strokeWidth="0.6"
              />

              {/* All-seeing eye */}
              <ellipse
                cx="50"
                cy="50"
                rx="17"
                ry="11"
                fill="none"
                stroke="rgba(201, 162, 39, 0.4)"
                strokeWidth="0.8"
              />
              <circle cx="50" cy="50" r="5.5" fill="rgba(124, 58, 237, 0.35)" />
              <circle cx="50" cy="50" r="2" fill="rgba(201, 162, 39, 0.85)" />

              {/* Top star */}
              <polygon
                points="50,3 52.5,12 61,12 54,17.5 56.5,26 50,20.5 43.5,26 46,17.5 39,12 47.5,12"
                fill="rgba(201, 162, 39, 0.55)"
              />

              {/* Orbiting small stars */}
              <polygon
                points="18,28 19.5,31.5 23,31.5 20.5,34 21.5,37.5 18,35.5 14.5,37.5 15.5,34 13,31.5 16.5,31.5"
                fill="rgba(201, 162, 39, 0.3)"
              />
              <polygon
                points="82,28 83.5,31.5 87,31.5 84.5,34 85.5,37.5 82,35.5 78.5,37.5 79.5,34 77,31.5 80.5,31.5"
                fill="rgba(201, 162, 39, 0.3)"
              />
              <polygon
                points="18,68 19.5,71.5 23,71.5 20.5,74 21.5,77.5 18,75.5 14.5,77.5 15.5,74 13,71.5 16.5,71.5"
                fill="rgba(201, 162, 39, 0.3)"
              />
              <polygon
                points="82,68 83.5,71.5 87,71.5 84.5,74 85.5,77.5 82,75.5 78.5,77.5 79.5,74 77,71.5 80.5,71.5"
                fill="rgba(201, 162, 39, 0.3)"
              />
            </svg>
          </div>

          {/* ── Corner stars (twinkling) ── */}
          {[
            { top: 18 * scale, left: 18 * scale },
            { top: 18 * scale, right: 18 * scale },
            { bottom: 18 * scale, left: 18 * scale },
            { bottom: 18 * scale, right: 18 * scale },
          ].map((pos, i) => (
            <div
              key={`star-${i}`}
              style={{
                position: 'absolute',
                ...pos,
                animation: `cornerStarTwinkle ${2.5 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.6}s`,
                pointerEvents: 'none',
                zIndex: 3,
              }}
            >
              <svg width={10 * scale} height={10 * scale} viewBox="0 0 10 10">
                <polygon
                  points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4"
                  fill="rgba(201, 162, 39, 0.6)"
                />
              </svg>
            </div>
          ))}

          {/* ── Floating sparkles ── */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 + 0.3;
            const dist = 32;
            return (
              <div
                key={`sparkle-${i}`}
                style={{
                  position: 'absolute',
                  width: 2,
                  height: 2,
                  top: `calc(50% + ${Math.sin(angle) * dist}%)`,
                  left: `calc(50% + ${Math.cos(angle) * dist}%)`,
                  background: '#c9a227',
                  borderRadius: '50%',
                  animation: `cornerStarTwinkle ${1.8 + i * 0.35}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                  pointerEvents: 'none',
                  zIndex: 3,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
