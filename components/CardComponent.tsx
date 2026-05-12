import { Card } from '@/lib/types';
import { suitSymbol, suitColor } from '@/lib/utils';

interface CardComponentProps {
  card: Card | null;
  onClick?: () => void;
  onDragStart?: (card: Card, source: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  draggable?: boolean;
  faceDown?: boolean;
  source?: string;
}

export default function CardComponent({
  card,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  draggable,
  faceDown,
  source = '',
}: CardComponentProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (card && onDragStart && draggable) {
      onDragStart(card, source);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  if (!card && faceDown === false) {
    return (
      <div
        className="w-20 h-28 border-2 border-dashed border-gray-600 rounded flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={onDrop}
      >
        <span className="text-2xl opacity-50">+</span>
      </div>
    );
  }

  if (faceDown || !card) {
    return (
      <div
        className="w-20 h-28 bg-gradient-to-br from-blue-600 to-blue-900 border-2 border-blue-800 rounded shadow-lg flex items-center justify-center cursor-pointer hover:from-blue-500 hover:to-blue-800 transition-colors"
        onClick={onClick}
      >
        <span className="text-3xl">🛡️</span>
      </div>
    );
  }

  const color = suitColor(card.suit);
  const symbol = suitSymbol(card.suit);

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className={`w-20 h-28 bg-white rounded shadow-lg border-2 border-gray-300 p-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-transform hover:scale-105 ${
        color === 'red' ? 'text-red-600' : 'text-black'
      }`}
    >
      <div className="text-xs font-bold">{card.rank}</div>
      <div className="text-xl my-auto">{symbol}</div>
      <div className="text-xs font-bold">{card.rank}</div>
    </div>
  );
}
