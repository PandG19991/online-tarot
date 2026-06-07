'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import CardBack from './CardBack';

interface ShuffleAnimationProps {
  onComplete?: () => void;
}

export default function ShuffleAnimation({ onComplete }: ShuffleAnimationProps) {
  const cardCount = 8;

  const cards = useMemo(() => {
    return Array.from({ length: cardCount }, (_, i) => ({
      id: i,
      scatterX: (Math.random() - 0.5) * 320,
      scatterY: (Math.random() - 0.5) * 240,
      scatterRotate: (Math.random() - 0.5) * 70,
      shuffleX: (Math.random() - 0.5) * 260,
      shuffleY: (Math.random() - 0.5) * 200,
      shuffleRotate: (Math.random() - 0.5) * 100,
    }));
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 600, height: 420 }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.id}
          className="absolute"
          style={{ zIndex: cardCount - i }}
          initial={{ x: 0, y: i * 0.8, rotate: i * 1.5 }}
          animate={{
            x: [0, card.scatterX, card.shuffleX, 0],
            y: [i * 0.8, card.scatterY + i * 0.8, card.shuffleY + i * 0.8, i * 0.8],
            rotate: [i * 1.5, card.scatterRotate + i * 1.5, card.shuffleRotate + i * 1.5, i * 1.5],
          }}
          transition={{
            duration: 2.6,
            times: [0, 0.28, 0.58, 1],
            delay: i * 0.06,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
        >
          <CardBack size="sm" />
        </motion.div>
      ))}
    </div>
  );
}
