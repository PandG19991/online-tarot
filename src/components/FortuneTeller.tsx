'use client';

import { useReducer, useEffect, useMemo, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { DrawnCard, SpreadType } from '@/types/tarot';

gsap.registerPlugin(useGSAP);

interface FortuneTellerProps {
  drawnCards: DrawnCard[];
  spreadType: SpreadType;
  isVisible: boolean;
}

/* ============================================================
   Generate poetic reading text
   ============================================================ */

function generateReading(drawnCards: DrawnCard[], spreadType: SpreadType): string {
  if (drawnCards.length === 0) return '';

  const lines: string[] = [];

  lines.push('—— 我闭上双眼，让指尖轻抚过这些牌的纹路。空气中弥漫着乳香与月光的气息，星辰的低语正缓缓流入我的耳中……');
  lines.push('');

  drawnCards.forEach((drawn, idx) => {
    const { card, isReversed, positionLabel } = drawn;
    const label = positionLabel || `位置 ${idx + 1}`;
    const text = isReversed ? card.fortuneTellerText.reversed : card.fortuneTellerText.upright;
    const orientation = isReversed ? '逆位' : '正位';

    lines.push(`【${label}】${card.name}（${orientation}）`);
    lines.push(text);
    lines.push('');
  });

  lines.push('——');
  lines.push('');

  const majorCount = drawnCards.filter((d) => d.card.arcana === 'major').length;
  const reversedCount = drawnCards.filter((d) => d.isReversed).length;

  if (spreadType === 'single') {
    lines.push('这一张牌，是宇宙此刻最想对你说的话。不要急于寻找答案，让它在你心中慢慢沉淀，像茶在水中舒展。当你准备好时，行动自会浮现。');
  } else if (spreadType === 'three') {
    const [past, present, future] = drawnCards;
    lines.push('过去、现在与未来，像三条交织的河流，最终汇入同一片海洋。');
    if (past?.isReversed) {
      lines.push('过去的伤痛正在释放它的 grip，你已经在疗愈的路上。');
    } else if (past && !past.isReversed) {
      lines.push('过去的根基坚实，它们是你此刻站立的土壤。');
    }
    if (present?.isReversed) {
      lines.push('此刻的你或许感到迷雾重重，但请相信，这雾不会永远不散。');
    } else if (present && !present.isReversed) {
      lines.push('当下的能量正在流动，抓住它，不要犹豫。');
    }
    if (future?.isReversed) {
      lines.push('未来的路并非一成不变，你的每一个选择都在重写结局。');
    } else if (future && !future.isReversed) {
      lines.push('前方的光已经亮起，顺着它走，你会抵达应许之地。');
    }
  } else if (spreadType === 'celtic') {
    lines.push('这是一个完整的灵魂地图——从根基到顶点，从自我到环境，从希望到结果。');
    if (majorCount >= 4) {
      lines.push('大阿卡纳如此密集地出现，说明此刻是你命运中的关键转折。宇宙正在用力推你一把，请不要抗拒这股洪流。');
    } else if (majorCount <= 1) {
      lines.push('小阿卡纳主导了这次牌阵，说明命运的方向盘正握在你自己手中。日常的选择将塑造你的道路，请谨慎而勇敢地驾驭它们。');
    }
    if (reversedCount >= 4) {
      lines.push('逆位牌数量较多，提示你有一些被压抑的能量正在寻求释放。不必恐惧，逆位不是惩罚，而是被忽视之事的温柔敲门。');
    }
  }

  lines.push('');
  lines.push('记住，牌只是镜子，映照出你内心已有的答案。愿星辰指引你的道路，愿你的灵魂始终向着光生长。');

  return lines.join('\n');
}

/* ============================================================
   Reducer for typewriter state
   ============================================================ */

type FTAction =
  | { type: 'RESET' }
  | { type: 'START' }
  | { type: 'TYPE'; text: string }
  | { type: 'END' }
  | { type: 'SKIP'; text: string };

interface FTState {
  displayedText: string;
  isTyping: boolean;
}

function ftReducer(state: FTState, action: FTAction): FTState {
  switch (action.type) {
    case 'RESET':
      return { displayedText: '', isTyping: false };
    case 'START':
      return { displayedText: '', isTyping: true };
    case 'TYPE':
      return { ...state, displayedText: action.text };
    case 'END':
      return { ...state, isTyping: false };
    case 'SKIP':
      return { displayedText: action.text, isTyping: false };
    default:
      return state;
  }
}

/* ============================================================
   FortuneTeller
   ============================================================ */

export default function FortuneTeller({
  drawnCards,
  spreadType,
  isVisible,
}: FortuneTellerProps) {
  const [state, dispatch] = useReducer(ftReducer, { displayedText: '', isTyping: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const delaysRef = useRef<gsap.core.Tween[]>([]);

  const fullText = useMemo(
    () => generateReading(drawnCards, spreadType),
    [drawnCards, spreadType]
  );

  /* ---------- slide in / out ---------- */

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (isVisible) {
        gsap.set(containerRef.current, { display: 'block' });
        gsap.fromTo(
          containerRef.current,
          { y: 100, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.4)' }
        );
      } else {
        gsap.to(containerRef.current, {
          y: 100,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, { display: 'none' });
            }
          },
        });
      }
    },
    { scope: containerRef, dependencies: [isVisible], revertOnUpdate: true }
  );

  /* ---------- typewriter (GSAP delayedCall) ---------- */
  /* Note: delayedCall recursion lives outside useGSAP context, 
     so manual cleanup via useEffect remains necessary here. */

  useEffect(() => {
    if (!isVisible || !fullText) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'START' });
    let index = 0;
    const delays: gsap.core.Tween[] = [];

    const typeNext = () => {
      if (index < fullText.length) {
        dispatch({ type: 'TYPE', text: fullText.slice(0, index + 1) });
        index++;

        const char = fullText[index - 1];
        let delay = 0.03;

        if ('，。！？；：,.!?;:"'.includes(char)) {
          delay = 0.12;
        }
        if (char === '\n') {
          delay = 0.3;
        }
        if (index < fullText.length && '。！？\n'.includes(fullText[index - 1])) {
          delay = 0.3;
        }

        delays.push(gsap.delayedCall(delay, typeNext));
      } else {
        dispatch({ type: 'END' });
      }
    };

    delays.push(gsap.delayedCall(0.7, typeNext));
    delaysRef.current = delays;

    return () => {
      delays.forEach((d) => d.kill());
    };
  }, [isVisible, fullText]);

  /* ---------- auto-scroll ---------- */

  useEffect(() => {
    if (textBoxRef.current) {
      textBoxRef.current.scrollTop = textBoxRef.current.scrollHeight;
    }
  }, [state.displayedText]);

  /* ---------- skip ---------- */

  const handleSkip = useCallback(() => {
    delaysRef.current.forEach((d) => d.kill());
    dispatch({ type: 'SKIP', text: fullText });
  }, [fullText]);

  /* ---------- paragraphs ---------- */

  const paragraphs = useMemo(() => {
    return state.displayedText.split('\n').map((p, i) => ({ text: p, key: i }));
  }, [state.displayedText]);

  const showCursor = state.isTyping && state.displayedText.length < fullText.length;

  return (
    <div
      ref={containerRef}
      className="relative w-full z-10"
      style={{ display: 'none', visibility: 'hidden' }}
    >
      {/* Gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          height: '140%',
          top: '-40%',
          background:
            'linear-gradient(to top, #060612 0%, #0c0c1a 60%, transparent 100%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto pb-6 pt-10 px-4">
        {/* Skip button — Island Button */}
        {state.isTyping && (
          <button
            onClick={handleSkip}
            className="absolute top-2 right-4 z-10 island-button"
            style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}
          >
            跳过动画
          </button>
        )}

        <div className="flex gap-4 items-end">
          {/* Avatar — mystical hood silhouette */}
          <div className="hidden sm:flex flex-shrink-0 flex-col items-center gap-2">
            <div className="relative w-14 h-14 rounded-full p-[2px]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5, #c9a227)',
                boxShadow: '0 0 25px rgba(124,58,237,0.35)',
              }}
            >
              <div className="w-full h-full rounded-full bg-[#080810] flex items-center justify-center overflow-hidden relative">
                {/* Hood */}
                <div
                  className="absolute bottom-1 rounded-t-full"
                  style={{
                    width: '28px',
                    height: '32px',
                    background: 'linear-gradient(to top, rgba(124,58,237,0.35), rgba(99,102,241,0.2), transparent)',
                  }}
                />
                {/* Face glow */}
                <div
                  className="absolute rounded-full"
                  style={{
                    bottom: '22px',
                    width: '14px',
                    height: '14px',
                    background: 'rgba(201,162,39,0.15)',
                    filter: 'blur(5px)',
                  }}
                />
                {/* Eyes */}
                <div className="absolute flex gap-2" style={{ bottom: '18px' }}>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{
                      background: '#c9a227',
                      boxShadow: '0 0 4px rgba(201,162,39,0.9), 0 0 8px rgba(201,162,39,0.5)',
                    }}
                  />
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{
                      background: '#c9a227',
                      boxShadow: '0 0 4px rgba(201,162,39,0.9), 0 0 8px rgba(201,162,39,0.5)',
                    }}
                  />
                </div>
              </div>
            </div>
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ color: 'rgba(124,58,237,0.5)' }}
            >
              Oracle
            </span>
          </div>

          {/* Dialog — Double-Bezel */}
          <div className="flex-1 min-w-0">
            <div className="card-outer">
              <div className="card-inner p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  {/* Mobile avatar */}
                  <div
                    className="sm:hidden w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #c9a227)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                  </div>
                  <span
                    className="text-[11px] font-medium tracking-[0.15em] uppercase"
                    style={{ color: 'rgba(167,139,250,0.7)' }}
                  >
                    占卜师 · MysticDraw
                  </span>
                </div>

                <div
                  ref={textBoxRef}
                  className="space-y-3 max-h-[35vh] overflow-y-auto pr-1"
                >
                  {paragraphs.map((paragraph) =>
                    paragraph.text ? (
                      <p
                        key={paragraph.key}
                        className="text-[15px] leading-[1.85] font-light tracking-wide"
                        style={{ color: 'rgba(232,230,227,0.85)', fontFamily: 'var(--font-body)' }}
                      >
                        {paragraph.text}
                        {paragraph.key === paragraphs.length - 1 && showCursor && (
                          <span
                            className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5"
                            style={{
                              background: '#c9a227',
                              animation: 'ft-cursor-blink 1s step-end infinite',
                            }}
                          />
                        )}
                      </p>
                    ) : (
                      <div key={paragraph.key} className="h-2" />
                    )
                  )}

                  {!state.isTyping && state.displayedText.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-amber-400/50" />
                      <span className="inline-block w-1 h-1 rounded-full bg-purple-400/50" />
                      <span className="inline-block w-1 h-1 rounded-full bg-indigo-400/50" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ft-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
