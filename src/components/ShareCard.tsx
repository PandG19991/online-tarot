'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Check } from 'lucide-react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!exportRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      const node = exportRef.current;

      // Measure height (visibility:hidden preserves layout)
      const originalVisibility = node.style.visibility;
      node.style.visibility = 'visible';
      const height = node.offsetHeight;
      node.style.visibility = originalVisibility;

      const width = 600;
      const scale = 2;

      // Clone and scale for SVG rendering
      const clone = node.cloneNode(true) as HTMLDivElement;
      clone.style.transform = `scale(${scale})`;
      clone.style.transformOrigin = 'top left';

      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${clone.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      // Load SVG into image
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = svgUrl;
      });

      // Fill background and draw
      ctx.fillStyle = '#0f0a1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);

      // Download
      const link = document.createElement('a');
      link.download = `MysticDraw-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Share image generation failed:', err);
      alert('图片生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  const handleCopySummary = useCallback(() => {
    const summary = generateShareSummary(drawnCards, spreadType);
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#1a103c] via-[#0f0a1e] to-[#1a0b2e] border border-amber-500/25 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden relative"
      >
        {/* Subtle glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center mb-6">
          <h3 className="text-xl font-semibold text-amber-200/90 tracking-[0.15em] mb-1">
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
                className={`
                  relative w-[60px] h-[92px] rounded-lg overflow-hidden
                  bg-gradient-to-br from-indigo-900 to-purple-950
                  border border-amber-500/25 flex flex-col items-center justify-center p-2
                  shadow-lg
                  ${drawn.isReversed ? 'rotate-180' : ''}
                `}
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

        <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 mb-5">
          <p className="text-sm text-white/65 text-center leading-relaxed italic">
            {summary}
          </p>
        </div>

        <div className="relative text-center">
          <span className="text-[10px] text-amber-400/35 tracking-[0.25em]">
            ✦ MYSTICDRAW · 塔罗指引 ✦
          </span>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-center mt-5 gap-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-500/25 text-amber-200/80 text-sm font-medium hover:border-amber-500/45 hover:from-amber-500/25 hover:to-purple-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={15} />
          {isGenerating ? '生成中...' : '保存图片'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleCopySummary}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-sm font-medium hover:bg-white/[0.07] hover:border-white/15 transition-all"
        >
          {copied ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
          {copied ? '已复制' : '复制文案'}
        </motion.button>
      </div>

      {/* Hidden export element - inline styles only for SVG foreignObject */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div
          ref={exportRef}
          style={{
            width: '600px',
            background: 'linear-gradient(135deg, #1a103c 0%, #0f0a1e 50%, #1a0b2e 100%)',
            padding: '40px',
            border: '2px solid #c9a227',
            borderRadius: '16px',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#ffffff',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#f0d78c',
                margin: '0 0 8px 0',
                letterSpacing: '0.15em',
              }}
            >
              MysticDraw
            </h2>
            <p
              style={{
                fontSize: '13px',
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
              gap: '14px',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}
          >
            {drawnCards.map((drawn, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '78px',
                    height: '118px',
                    background:
                      'linear-gradient(135deg, #2d1b69 0%, #1a0f3c 100%)',
                    borderRadius: '10px',
                    border: '1px solid rgba(201, 162, 39, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    transform: drawn.isReversed ? 'rotate(180deg)' : 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      fontSize: '9px',
                      color: 'rgba(240, 215, 140, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {drawn.card.arcana}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#ffffff',
                      textAlign: 'center',
                      marginTop: '6px',
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {drawn.card.name}
                  </span>
                  {drawn.card.suit && (
                    <span
                      style={{
                        fontSize: '9px',
                        color: 'rgba(167, 139, 250, 0.5)',
                        marginTop: '4px',
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
                      fontSize: '10px',
                      color: '#a78bfa',
                      marginTop: '6px',
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
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
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
                fontSize: '11px',
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
