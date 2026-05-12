import { Card } from '@/lib/types';
import CardComponent from './CardComponent';

interface TableauProps {
  tableau: Card[][];
  onDragStart: (card: Card, source: string) => void;
  onDrop: (target: string) => void;
}

export default function Tableau({
  tableau,
  onDragStart,
  onDrop,
}: TableauProps) {
  const CARD_OVERLAP = 56; // pixels of overlap between cards

  return (
    <div className="flex gap-4 justify-between">
      {tableau.map((column, colIdx) => (
        <div
          key={colIdx}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(`tableau-${colIdx}`)}
          className="relative"
          style={{
            minHeight: `${Math.max(24, column.length * CARD_OVERLAP + 112)}px`,
          }}
        >
          {column.length === 0 ? (
            <div className="absolute top-0 left-0">
              <CardComponent faceDown={false} />
            </div>
          ) : (
            column.map((card, cardIdx) => (
              <div
                key={card.id}
                className="absolute left-0 cursor-grab active:cursor-grabbing"
                style={{
                  top: `${cardIdx * CARD_OVERLAP}px`,
                  zIndex: cardIdx,
                }}
              >
                <CardComponent
                  card={card}
                  draggable={cardIdx === column.length - 1}
                  onDragStart={(card) =>
                    onDragStart(card, `tableau-${colIdx}`)
                  }
                  source={`tableau-${colIdx}`}
                />
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
