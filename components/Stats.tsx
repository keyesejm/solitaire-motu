interface StatsProps {
  moves: number;
}

export default function Stats({ moves }: StatsProps) {
  return (
    <div className="mt-8 text-center text-sm opacity-70">
      <p>Moves: {moves}</p>
    </div>
  );
}
