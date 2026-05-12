import { Card, Rank, Suit } from './types';

export const RANKS: Rank[] = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
];
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const rankValue = (rank: Rank): number => {
  if (rank === 'A') return 1;
  if (rank === 'K') return 13;
  if (rank === 'Q') return 12;
  if (rank === 'J') return 11;
  return parseInt(rank);
};

export const suitColor = (suit: Suit): 'red' | 'black' => {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
};

export const createDeck = (): Card[] => {
  const cards: Card[] = [];
  let id = 0;
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ suit, rank, id: `${suit}-${rank}-${id}` });
      id++;
    }
  }
  return shuffleDeck(cards);
};

export const shuffleDeck = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const canPlaceOnTableau = (card: Card, target: Card[]): boolean => {
  if (target.length === 0) {
    return card.rank === 'K';
  }
  const topCard = target[target.length - 1];
  const canPlace =
    rankValue(card.rank) === rankValue(topCard.rank) - 1 &&
    suitColor(card.suit) !== suitColor(topCard.suit);
  return canPlace;
};

export const canPlaceOnFoundation = (
  card: Card,
  foundation: Card[]
): boolean => {
  if (foundation.length === 0) {
    return card.rank === 'A';
  }
  const topCard = foundation[foundation.length - 1];
  return (
    card.suit === topCard.suit &&
    rankValue(card.rank) === rankValue(topCard.rank) + 1
  );
};

export const suitSymbol = (suit: Suit): string => {
  switch (suit) {
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    case 'spades':
      return '♠';
  }
};
