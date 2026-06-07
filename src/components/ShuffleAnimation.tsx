'use client';

import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import CardBack from './CardBack';

interface ShuffleAnimationProps {
  onComplete?: () => void;
}

const CARD_COUNT = 8;

export default function ShuffleAnimation({ onComplete }: ShuffleAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cards = useMemo(() => {
    return Array.from({ length: CARD_COUNT }, (_, i) => ({
      id: i,
      stackX: (Math.random() - 0.5) * 4,
      stackY: i * 0.8,
      stackRotate: i * 1.5,
      scatterX: (Math.random() - 0.5) * 320,
      scatterY: (Math.random() - 0.5) * 240,
      scatterRotate: (Math.random() - 0.5) * 70,
      swapX: (Math.random() - 0.5) * 260,
      swapY: (Math.random() - 0.5) * 200,
      swapRotate: (Math.random() - 0.5) * 100,
    }));
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onComplete?.(),
      });

      const elements = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      // Initial stack state
      elements.forEach((el, i) => {
        gsap.set(el, {
          x: cards[i].stackX,
          y: cards[i].stackY,
          rotation: cards[i].stackRotate,
        });
      });

      // Phase 1: Shake (0.0s – 0.3s)
      tl.to(elements, {
        x: '+=5',
        y: '-=3',
        rotation: '+=2',
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.01,
      });

      // Phase 2: Scatter (0.3s – 1.1s)
      tl.to(elements, {
        x: (i) => cards[i].scatterX,
        y: (i) => cards[i].scatterY,
        rotation: (i) => cards[i].scatterRotate,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.02,
      });

      // Phase 3: Swap (1.1s – 1.7s)
      tl.to(elements, {
        x: (i) => cards[i].swapX,
        y: (i) => cards[i].swapY,
        rotation: (i) => cards[i].swapRotate,
        duration: 0.6,
        ease: 'power1.inOut',
        stagger: 0.02,
      });

      // Phase 4: Gather (1.7s – 2.5s)
      tl.to(elements, {
        x: (i) => cards[i].stackX,
        y: (i) => cards[i].stackY,
        rotation: (i) => cards[i].stackRotate,
        duration: 0.8,
        ease: 'power2.inOut',
        stagger: 0.02,
      });

      // Phase 5: Glow pulse (2.5s – 3.0s)
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1.4, duration: 0.25, ease: 'power1.out' },
          '+=0'
        );
        tl.to(glowRef.current, {
          opacity: 0,
          scale: 1.8,
          duration: 0.25,
          ease: 'power1.in',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [cards, onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: 600, height: 420 }}
    >
      {/* Glow pulse layer */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div
          className="rounded-full"
          style={{
            width: 220,
            height: 220,
            background:
              'radial-gradient(circle, rgba(201, 162, 39, 0.25) 0%, transparent 70%)',
          }}
        />
      </div>

      {cards.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: -60,
            marginTop: -95,
            zIndex: CARD_COUNT - i,
            willChange: 'transform',
          }}
        >
          <CardBack size="sm" />
        </div>
      ))}
    </div>
  );
}
