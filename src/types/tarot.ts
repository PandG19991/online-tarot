export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  number: number;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  upright: string;
  reversed: string;
  fortuneTellerText: {
    upright: string;
    reversed: string;
  };
  symbolism: string;
  element?: 'fire' | 'water' | 'air' | 'earth';
}

export type SpreadType = 'single' | 'three' | 'celtic';

export interface SpreadPosition {
  index: number;
  label: string;
  meaning: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: number;
  positionLabel?: string;
}

export type Scene = 'landing' | 'spread-select' | 'shuffling' | 'drawing' | 'reading';

export interface GameState {
  scene: Scene;
  spreadType: SpreadType;
  deck: TarotCard[];
  drawnCards: DrawnCard[];
  isShuffling: boolean;
  selectedCardIndex: number | null;
}
