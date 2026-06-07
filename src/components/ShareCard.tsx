'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import type { DrawnCard, SpreadType } from '@/types/tarot';

interface ShareCardProps {
  drawnCards: DrawnCard[];
  spreadType: SpreadType;
}

const spreadTitleMap: Record<SpreadType, string> = {
  single: '今日指引',
  three: '过去·现在·未来',
  celtic: '凯尔特十字',
};

function generateShareSummary(drawnCards: DrawnCard[], spreadType: SpreadType): string {
  if (drawnCards.length === 0) return '';
  const names = drawnCards
    .map((d) => d.card.name + (d.isReversed ? '·逆' : ''))
    .join('、');

  if (spreadType === 'single') {
    return `${names} — 宇宙此刻想要告诉你的核心讯息。愿你在这张牌的指引下，找到内心的平静与方向。`;
  } else if (spreadType === 'three') {
    return `三张牌的流动：${names}。时间的长河在你手中展开，过去、现在与未来在此刻交汇。`;
  }
  return `十张牌编织的命运之网：${names}。深层的洞察已揭示，生命的图景正在你眼前缓缓展开。`;
}

export default function ShareCard({ drawnCards, spreadType }: ShareCardProps) {
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!exportRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 1,
      });

      const link = document.createElement('a');
      link.download = `MysticDraw-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Share image generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  const handleCopySummary = useCallback(() => {
    const summary = generateShareSummary(drawnCards, spreadType);
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [drawnCards, spreadType]);

  if (drawnCards.length === 0) return null;

  const summary = generateShareSummary(drawnCards, spreadType);
  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-5">
      {/* Preview Card */}
      <div
        className="rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #1a103c 0%, #0f0a1e 50%, #1a0b2e 100%)',
          border: '1px solid rgba(201, 162, 39, 0.25)',
        }}
      >
        {/* Subtle glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(124, 58, 237, 0.1)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(201, 162, 39, 0.08)' }}
        />

        <div className="relative text-center mb-6">
          <h3
            className="text-xl font-medium tracking-[0.15em] mb-1"
            style={{ color: 'rgba(240, 215, 140, 0.9)', fontFamily: 'var(--font-heading)' }}
          >
            MysticDraw
          </h3>
          <p className="text-[11px] text-white/35 tracking-wider">
            {dateStr} · {spreadTitleMap[spreadType]}
          </p>
        </div>

        <div className="relative flex justify-center gap-3 mb-6 flex-wrap">
          {drawnCards.map((drawn, i) => (
            <div key={i} className="text-center">
              <div
                className="relative w-[60px] h-[92px] rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #2d1b69 0%, #1a0f3c 100%)',
                  border: '1px solid rgba(201, 162, 39, 0.25)',
                  transform: drawn.isReversed ? 'rotate(180deg)' : 'none',
                }}
              >
                <span className="text-[7px] text-amber-200/40 uppercase tracking-[0.15em]">
                  {drawn.card.arcana}
                </span>
                <span className="text-[10px] text-white text-center font-medium mt-1 leading-tight">
                  {drawn.card.name}
                </span>
                {drawn.card.suit && (
                  <span className="text-[7px] text-purple-300/40 mt-1 capitalize">
                    {drawn.card.suit}
                  </span>
                )}
              </div>
              {drawn.isReversed && (
                <span className="text-[9px] text-purple-400/60 mt-1 block">逆位</span>
              )}
            </div>
          ))}
        </div>

        <div
          className="relative rounded-xl p-5 mb-5"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-sm text-white/65 text-center leading-relaxed italic">
            {summary}
          </p>
        </div>

        <div className="relative text-center">
          <span className="text-[10px] tracking-[0.25em]" style={{ color: 'rgba(240, 215, 140, 0.35)' }}>
            ✦ MYSTICDRAW · 塔罗指引 ✦
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center mt-5 gap-3">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="island-button text-xs py-3 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? '生成中...' : '保存图片'}
        </button>

        <button onClick={handleCopySummary} className="island-button text-xs py-3 px-6">
          {copied ? '已复制' : '复制文案'}
        </button>
      </div>

      {/* Hidden export element - 1200x630 */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div
          ref={exportRef}
          style={{
            width: 1200,
            height: 630,
            background: 'linear-gradient(135deg, #1a103c 0%, #0f0a1e 50%, #1a0b2e 100%)',
            padding: 60,
            border: '2px solid #c9a227',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontFamily: 'var(--font-body), system-ui, sans-serif',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: '#f0d78c',
                margin: '0 0 8px 0',
                letterSpacing: '0.15em',
                fontFamily: 'var(--font-heading), serif',
              }}
            >
              MysticDraw
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
                letterSpacing: '0.1em',
              }}
            >
              {dateStr} · {spreadTitleMap[spreadType]}
            </p>
          </div>

          {/* Cards */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 18,
              marginBottom: 32,
              flexWrap: 'wrap',
            }}
          >
            {drawnCards.map((drawn, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 90,
                    height: 136,
                    background: 'linear-gradient(135deg, #2d1b69 0%, #1a0f3c 100%)',
                    borderRadius: 10,
                    border: '1px solid rgba(201, 162, 39, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    transform: drawn.isReversed ? 'rotate(180deg)' : 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: 'rgba(240, 215, 140, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {drawn.card.arcana}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: '#ffffff',
                      textAlign: 'center',
                      marginTop: 8,
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {drawn.card.name}
                  </span>
                  {drawn.card.suit && (
                    <span
                      style={{
                        fontSize: 10,
                        color: 'rgba(167, 139, 250, 0.5)',
                        marginTop: 6,
                        textTransform: 'capitalize',
                      }}
                    >
                      {drawn.card.suit}
                    </span>
                  )}
                </div>
                {drawn.isReversed && (
                  <span
                    style={{
                      fontSize: 11,
                      color: '#a78bfa',
                      marginTop: 6,
                      display: 'inline-block',
                    }}
                  >
                    逆位
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: 24,
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: 24,
              maxWidth: 800,
              width: '100%',
            }}
          >
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.8)',
                margin: 0,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              {summary}
            </p>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 12,
                color: 'rgba(240, 215, 140, 0.45)',
                letterSpacing: '0.2em',
                margin: 0,
              }}
            >
              ✦ MYSTICDRAW · 塔罗指引 ✦
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
