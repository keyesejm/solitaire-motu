interface WinScreenProps {
  moves: number;
}

export default function WinScreen({ moves }: WinScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-pulse">
      <div className="bg-gradient-to-b from-yellow-400 via-red-500 to-purple-600 border-4 border-yellow-300 p-8 max-w-md text-center rounded-lg shadow-2xl">
        <h1 className="text-5xl font-black mb-4 text-white drop-shadow-lg">
          🎉 VICTORY! 🎉
        </h1>
        <p className="text-2xl font-bold text-white mb-2">YOU HAVE CONQUERED!</p>
        <p className="text-lg text-white mb-6">Moves: {moves}</p>
        <div className="flex gap-2 justify-center text-4xl mb-4">
          ⚔️ 🐉 ⚔️ 💪 ⚔️ 🔥 ⚔️
        </div>
        <p className="text-white text-sm font-bold">
          By the power of Grayskull... You Win!
        </p>
      </div>
    </div>
  );
}
