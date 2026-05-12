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
  return (
    <div className="flex gap-4 justify-between">
      {tableau.map((column, colIdx) => (
        <div
          key={colIdx}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(`tableau-${colIdx}`)}
          className="flex flex-col gap-2 min-h-96"
        >
          {column.length === 0 ? (
            <CardComponent faceDown={false} />
          ) : (
            column.map((card, cardIdx) => (
              <div
                key={card.id}
                className={cardIdx < column.length - 1 ? '-mt-20' : ''}
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
