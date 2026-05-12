import { Card, Suit } from '@/lib/types';
import CardComponent from './CardComponent';
import { suitSymbol } from '@/lib/utils';

interface FoundationsProps {
  foundations: {
    hearts: Card[];
    diamonds: Card[];
    clubs: Card[];
    spades: Card[];
  };
  onDragStart: (card: Card, source: string) => void;
  onDrop: (target: string) => void;
}

export default function Foundations({
  foundations,
  onDragStart,
  onDrop,
}: FoundationsProps) {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  return (
    <div className="flex gap-4">
      {suits.map((suit) => {
        const topCard = foundations[suit][foundations[suit].length - 1];
        return (
          <div
            key={suit}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(`foundation-${suit}`)}
          >
            {topCard ? (
              <div>
                <CardComponent
                  card={topCard}
                  draggable
                  onDragStart={(card) =>
                    onDragStart(card, `foundation-${suit}`)
                  }
                  source={`foundation-${suit}`}
                />
                <div className="text-xs text-center mt-1 opacity-70">
                  {suitSymbol(suit)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-28 border-2 border-dashed border-gray-600 rounded flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900">
                  <span className="text-3xl opacity-40">{suitSymbol(suit)}</span>
                </div>
                <div className="text-xs text-center mt-1 opacity-70">
                  {suitSymbol(suit)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
