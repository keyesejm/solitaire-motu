import { Card } from '@/lib/types';
import CardComponent from './CardComponent';

interface DeckProps {
  deck: Card[];
  waste: Card[];
  onDraw: () => void;
  onDragStart: (card: Card, source: string) => void;
  onDrop: () => void;
}

export default function Deck({
  deck,
  waste,
  onDraw,
  onDragStart,
  onDrop,
}: DeckProps) {
  const topWaste = waste.length > 0 ? waste[waste.length - 1] : null;

  return (
    <div className="flex gap-2 md:gap-4">
      {/* Draw Pile */}
      <div>
        <button
          onClick={onDraw}
          className="hover:opacity-80 transition-opacity"
        >
          {deck.length > 0 ? (
            <CardComponent faceDown />
          ) : (
            <div className="w-20 h-28 border-2 border-dashed border-gray-600 rounded flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 cursor-pointer hover:border-gray-400 transition-colors">
              <span className="text-2xl opacity-50">↻</span>
            </div>
          )}
        </button>
        <div className="text-xs text-center mt-1 opacity-70">{deck.length}</div>
      </div>

      {/* Waste Pile */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {topWaste ? (
          <CardComponent
            card={topWaste}
            draggable
            onDragStart={(card) => onDragStart(card, 'waste')}
            source="waste"
          />
        ) : (
          <div className="w-20 h-28 border-2 border-dashed border-gray-600 rounded flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900">
            <span className="text-2xl opacity-30">∅</span>
          </div>
        )}
      </div>
    </div>
  );
}
