'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { DrawnCard, SpreadType } from '@/types/tarot';

interface FortuneTellerProps {
  drawnCards: DrawnCard[];
  spreadType: SpreadType;
  isVisible: boolean;
}

function generateReading(drawnCards: DrawnCard[], spreadType: SpreadType): string {
  if (drawnCards.length === 0) return '';

  const cardLines = drawnCards.map((dc) => {
    const text = dc.isReversed
      ? dc.card.fortuneTellerText.reversed
      : dc.card.fortuneTellerText.upright;
    return `${dc.card.name}${dc.isReversed ? '（逆位）' : ''}：${text}`;
  });

  let reading = '';

  // Opening
  reading += '让我感受这些牌传递的能量...\n\n';
  reading += '宇宙的低语在耳边回响，星辰的轨迹在牌面上流转。让我为你揭开命运的薄纱...\n\n';

  // Card by card interpretation
  if (spreadType === 'single') {
    const card = drawnCards[0];
    reading += `你抽到了${card.card.name}${card.isReversed ? '，逆位' : ''}。\n\n`;
    reading += `${cardLines[0]}\n\n`;
    reading +=
      '这一张牌，是此刻宇宙想要传递给你的核心讯息。它像一面镜子，映照出你内心最深处的渴望与恐惧。请静心聆听它的指引，答案早已在你心中。\n\n';
  } else if (spreadType === 'three') {
    const labels = ['过去', '现在', '未来'];
    reading += '三张牌，串联起时间的长河...\n\n';
    drawnCards.forEach((_, i) => {
      reading += `【${labels[i]}之牌】${cardLines[i]}\n\n`;
    });
    reading +=
      '过去塑造了现在的你，现在孕育着未来的种子。这三张牌编织成一条流动的命运之河，请在其中找到属于你的方向。时间从未真正流逝，它只是以不同的形态陪伴着你。\n\n';
  } else if (spreadType === 'celtic') {
    reading += '凯尔特十字，十张牌的深邃交响...\n\n';
    drawnCards.forEach((_, i) => {
      reading += `第${i + 1}张牌：${cardLines[i]}\n\n`;
    });
    reading +=
      '这十张牌构成了一个完整的宇宙图景，每一张都是拼图的一部分，共同揭示了你生命课题的全貌。看似独立的命运线索，在此刻交汇成网。\n\n';
  }

  // Closing
  reading +=
    '记住，塔罗不是预言，而是一面映照内心的镜子。牌面所示，皆是你内心已然知晓的答案。愿你带着这份觉知，在迷雾中找到属于自己的星光。✨';

  return reading;
}

export default function FortuneTeller({
  drawnCards,
  spreadType,
  isVisible,
}: FortuneTellerProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const fullText = useMemo(
    () => generateReading(drawnCards, spreadType),
    [drawnCards, spreadType]
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    if (!isVisible || !fullText) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    let index = 0;
    const typeNext = () => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
        const char = fullText[index - 1];
        // Variable speed: slower on punctuation, faster on spaces
        let delay: number;
        if (char === '\n') {
          delay = 350;
        } else if (char === ' ') {
          delay = 40;
        } else if ('，。！？；：'.includes(char)) {
          delay = 180;
        } else {
          delay = Math.random() * 28 + 22;
        }
        timeoutRef.current = setTimeout(typeNext, delay);
      } else {
        setIsTyping(false);
      }
    };

    timeoutRef.current = setTimeout(typeNext, 700);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, fullText]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 520);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText]);

  const paragraphs = useMemo(() => {
    return displayedText.split('\n').map((p, i) => ({ text: p, key: i }));
  }, [displayedText]);

  const handleSkip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayedText(fullText);
    setIsTyping(false);
  }, [fullText]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060612] via-[#0c0c1a] to-transparent h-[140%] -top-[40%] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto pb-6 pt-10 px-4">
            {/* Skip button */}
            <AnimatePresence>
              {isTyping && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleSkip}
                  className="absolute top-2 right-4 text-[11px] text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
                >
                  跳过动画
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex gap-4 items-end">
              {/* Avatar - mystical silhouette */}
              <div className="hidden sm:flex flex-shrink-0 flex-col items-center gap-2">
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-indigo-500 to-amber-500 p-[2px] shadow-[0_0_25px_rgba(147,51,234,0.35)]">
                  <div className="w-full h-full rounded-full bg-[#080810] flex items-center justify-center overflow-hidden relative">
                    {/* Hood silhouette */}
                    <div className="absolute bottom-1 w-7 h-8 bg-gradient-to-t from-purple-400/40 via-indigo-300/30 to-transparent rounded-t-full" />
                    {/* Face glow */}
                    <div className="absolute bottom-6 w-4 h-4 bg-amber-200/20 rounded-full blur-[6px]" />
                    {/* Eyes */}
                    <div className="absolute bottom-5 flex gap-2">
                      <div className="w-1 h-1 bg-amber-300/60 rounded-full" />
                      <div className="w-1 h-1 bg-amber-300/60 rounded-full" />
                    </div>
                    <Sparkles
                      size={12}
                      className="absolute top-2 right-2 text-amber-200/40"
                    />
                  </div>
                </div>
                <span className="text-[9px] text-purple-400/50 tracking-widest uppercase">
                  Oracle
                </span>
              </div>

              {/* Speech bubble */}
              <div className="flex-1 min-w-0">
                <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl rounded-bl-sm p-5 shadow-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    {/* Mobile avatar */}
                    <div className="sm:hidden w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={11} className="text-white/80" />
                    </div>
                    <span className="text-[11px] font-medium text-purple-300/70 tracking-[0.15em] uppercase">
                      占卜师 · MysticDraw
                    </span>
                  </div>

                  <div
                    ref={containerRef}
                    className="space-y-3 max-h-[35vh] overflow-y-auto pr-1"
                  >
                    {paragraphs.map((paragraph) =>
                      paragraph.text ? (
                        <motion.p
                          key={paragraph.key}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-[15px] leading-[1.85] text-white/80 font-light tracking-wide"
                        >
                          {paragraph.text}
                          {paragraph.key === paragraphs.length - 1 && isTyping && (
                            <span
                              className={`inline-block w-[2px] h-[1.1em] bg-amber-400 ml-0.5 align-middle transition-opacity duration-75 ${
                                showCursor ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          )}
                        </motion.p>
                      ) : (
                        <div key={paragraph.key} className="h-2" />
                      )
                    )}

                    {!isTyping && displayedText.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 pt-1"
                      >
                        <span className="inline-block w-1 h-1 rounded-full bg-amber-400/50" />
                        <span className="inline-block w-1 h-1 rounded-full bg-purple-400/50" />
                        <span className="inline-block w-1 h-1 rounded-full bg-indigo-400/50" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
