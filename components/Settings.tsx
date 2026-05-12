type Theme = 'motu' | 'dark-fantasy' | 'neon';

interface GameSettings {
  volume: number;
  drawMode: 1 | 3;
  theme: Theme;
}

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

export default function Settings({
  settings,
  onSettingsChange,
  onClose,
}: SettingsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-yellow-500 p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-6">SETTINGS</h2>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-lg font-bold mb-2">THEME</label>
            <div className="space-y-2">
              {(['motu', 'dark-fantasy', 'neon'] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() =>
                    onSettingsChange({ ...settings, theme })
                  }
                  className={`w-full text-left px-4 py-2 border-2 transition-colors ${
                    settings.theme === theme
                      ? 'border-yellow-500 bg-yellow-600'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  {theme === 'motu' && '⚔️ Masters of the Universe'}
                  {theme === 'dark-fantasy' && '🐉 Dark Fantasy'}
                  {theme === 'neon' && '🌐 Neon Synthwave'}
                </button>
              ))}
            </div>
          </div>

          {/* Draw Mode */}
          <div>
            <label className="block text-lg font-bold mb-2">DRAW MODE</label>
            <div className="flex gap-2">
              {[1, 3].map((mode) => (
                <button
                  key={mode}
                  onClick={() =>
                    onSettingsChange({ ...settings, drawMode: mode as 1 | 3 })
                  }
                  className={`flex-1 py-2 border-2 font-bold transition-colors ${
                    settings.drawMode === mode
                      ? 'border-yellow-500 bg-yellow-600'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  Draw {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="block text-lg font-bold mb-2">
              VOLUME: {Math.round(settings.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(settings.volume * 100)}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  volume: parseInt(e.target.value) / 100,
                })
              }
              className="w-full"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
