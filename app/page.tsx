'use client';

import { useState, useEffect } from 'react';
import Game from '@/components/Game';
import Settings from '@/components/Settings';

type Theme = 'motu' | 'dark-fantasy' | 'neon';

interface GameSettings {
  volume: number;
  drawMode: 1 | 3;
  theme: Theme;
}

export default function Home() {
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    volume: 0.5,
    drawMode: 3,
    theme: 'motu',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('solitaire-settings');
    if (saved) {
      try {
        setGameSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  const handleSettingsChange = (settings: GameSettings) => {
    setGameSettings(settings);
    localStorage.setItem('solitaire-settings', JSON.stringify(settings));
  };

  const handleNewGame = () => {
    setGameKey((k) => k + 1);
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        gameSettings.theme === 'motu'
          ? 'bg-gradient-to-b from-purple-900 via-red-900 to-black'
          : gameSettings.theme === 'dark-fantasy'
            ? 'bg-gradient-to-b from-slate-900 via-emerald-900 to-black'
            : 'bg-gradient-to-b from-cyan-900 via-purple-900 to-black'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-yellow-600">
        <h1 className="text-3xl font-bold pixel-text">
          ⚔️ SOLITAIRE ⚔️
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleNewGame}
            className="px-4 py-2 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors"
          >
            NEW GAME
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
          >
            SETTINGS
          </button>
        </div>
      </div>

      {showSettings && (
        <Settings
          settings={gameSettings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Game key={gameKey} settings={gameSettings} />
    </main>
  );
}
