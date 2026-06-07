'use client';

import { useState, useCallback } from 'react';
import {
  TarotCard,
  SpreadType,
  DrawnCard,
  Scene,
  GameState,
} from '@/types/tarot';
import { getAllCards, SPREADS } from '@/data/tarot';

const SPREAD_CARD_COUNTS: Record<SpreadType, number> = {
  single: 1,
  three: 3,
  celtic: 10,
};

const INITIAL_SCENE: Scene = 'landing';

function createInitialDeck(): TarotCard[] {
  const cards = getAllCards();
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export interface TarotGameReturn extends GameState {
  revealedIndices: number[];
  selectSpread: (type: SpreadType) => void;
  shuffle: () => void;
  draw: () => void;
  revealCard: (index: number) => void;
  selectCard: (index: number) => void;
  reset: () => void;
  getFortuneTellerReading: () => string;
}

export function useTarotGame(): TarotGameReturn {
  const [scene, setScene] = useState<Scene>(INITIAL_SCENE);
  const [spreadType, setSpreadType] = useState<SpreadType>('single');
  const [deck, setDeck] = useState<TarotCard[]>(createInitialDeck);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  const selectSpread = useCallback((type: SpreadType) => {
    setSpreadType(type);
    setScene('spread-select');
  }, []);

  const shuffle = useCallback(() => {
    setIsShuffling(true);
    setScene('shuffling');
    setDrawnCards([]);
    setRevealedIndices([]);
    setSelectedCardIndex(null);

    // Simulate shuffle animation time
    setTimeout(() => {
      setDeck(createInitialDeck());
      setIsShuffling(false);
      setScene('drawing');
    }, 1200);
  }, []);

  const draw = useCallback(() => {
    const count = SPREAD_CARD_COUNTS[spreadType];
    const positions = SPREADS[spreadType];
    const drawn: DrawnCard[] = [];

    for (let i = 0; i < count; i++) {
      const card = deck[i];
      const isReversed = Math.random() < 0.15;
      const position = positions[i];
      drawn.push({
        card,
        isReversed,
        position: i,
        positionLabel: position?.label,
      });
    }

    setDrawnCards(drawn);
    setRevealedIndices([]);
    setSelectedCardIndex(null);
    setScene('drawing');
  }, [deck, spreadType]);

  const revealCard = useCallback((index: number) => {
    setRevealedIndices((prev) => {
      if (prev.includes(index)) return prev;
      const next = [...prev, index];
      // Transition to reading scene when all cards are revealed
      const total = SPREAD_CARD_COUNTS[spreadType];
      if (next.length >= total) {
        setScene('reading');
      }
      return next;
    });
  }, [spreadType]);

  const selectCard = useCallback((index: number) => {
    setSelectedCardIndex(index);
  }, []);

  const reset = useCallback(() => {
    setScene(INITIAL_SCENE);
    setSpreadType('single');
    setDeck(createInitialDeck());
    setDrawnCards([]);
    setIsShuffling(false);
    setSelectedCardIndex(null);
    setRevealedIndices([]);
  }, []);

  const getFortuneTellerReading = useCallback((): string => {
    if (drawnCards.length === 0) {
      return '牌阵尚未展开，请让星辰引导你的双手……';
    }

    const lines: string[] = [];
    lines.push('—— 我闭上双眼，让指尖轻抚过这些牌的纹路。空气中弥漫着乳香与月光的气息，星辰的低语正缓缓流入我的耳中……');
    lines.push('');

    const positions = SPREADS[spreadType];

    drawnCards.forEach((drawn, idx) => {
      const { card, isReversed, positionLabel } = drawn;
      const label = positionLabel || `位置 ${idx + 1}`;
      const text = isReversed ? card.fortuneTellerText.reversed : card.fortuneTellerText.upright;
      const orientation = isReversed ? '逆位' : '正位';

      lines.push(`【${label}】${card.name}（${orientation}）`);
      lines.push(text);
      lines.push('');
    });

    // Synthesize a closing based on the overall spread energy
    const majorCount = drawnCards.filter((d) => d.card.arcana === 'major').length;
    const reversedCount = drawnCards.filter((d) => d.isReversed).length;

    lines.push('——');
    lines.push('');

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
  }, [drawnCards, spreadType]);

  const gameState: GameState = {
    scene,
    spreadType,
    deck,
    drawnCards,
    isShuffling,
    selectedCardIndex,
  };

  return {
    ...gameState,
    revealedIndices,
    selectSpread,
    shuffle,
    draw,
    revealCard,
    selectCard,
    reset,
    getFortuneTellerReading,
  };
}
