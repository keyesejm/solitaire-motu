'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Card } from '@/lib/types';
import {
  createDeck,
  canPlaceOnTableau,
  canPlaceOnFoundation,
} from '@/lib/utils';
import Deck from './Deck';
import Tableau from './Tableau';
import Foundations from './Foundations';
import Stats from './Stats';
import WinScreen from './WinScreen';

interface GameProps {
  settings: {
    volume: number;
    drawMode: 1 | 3;
    theme: 'motu' | 'dark-fantasy' | 'neon';
  };
}

export default function Game({ settings }: GameProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = createDeck();
    const tableau: Card[][] = [[], [], [], [], [], [], []];

    // Deal cards to tableau
    let deckIndex = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = col; row < 7; row++) {
        tableau[row].push(deck[deckIndex++]);
      }
    }

    const waste = deck.slice(deckIndex);

    const newState: GameState = {
      deck: [],
      waste,
      foundations: {
        hearts: [],
        diamonds: [],
        clubs: [],
        spades: [],
      },
      tableau,
      selectedCard: null,
      selectedPileIndex: -1,
      moves: 0,
      won: false,
      undo: [],
    };

    setGameState(newState);
    setDraggedCard(null);
  };

  const saveUndoState = useCallback(() => {
    if (!gameState) return;
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        undo: [
          ...prev.undo.slice(-20),
          { gameState: JSON.parse(JSON.stringify(prev)), timestamp: Date.now() },
        ],
      };
    });
  }, [gameState]);

  const handleDrawCard = () => {
    if (!gameState) return;

    saveUndoState();

    const newState = { ...gameState };
    const cardsToMove = settings.drawMode === 1 ? 1 : 3;

    for (let i = 0; i < cardsToMove; i++) {
      if (newState.waste.length === 0) {
        // Reshuffle deck from waste
        newState.waste = [...newState.deck].reverse();
        newState.deck = [];
      } else {
        const card = newState.waste.shift();
        if (card) {
          newState.deck.push(card);
        }
      }
    }

    newState.moves++;
    setGameState(newState);
    playSound('flip');
  };

  const handleDragStart = (card: Card, source: string) => {
    setDraggedCard(card);
    setDragSource(source);
  };

  const handleDrop = (target: string) => {
    if (!gameState || !draggedCard) return;

    saveUndoState();

    const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
    let canMove = false;

    // Remove from source
    if (dragSource === 'deck') {
      const idx = newState.deck.findIndex((c) => c.id === draggedCard.id);
      if (idx !== -1) newState.deck.splice(idx, 1);
    } else if (dragSource === 'waste') {
      const idx = newState.waste.findIndex((c) => c.id === draggedCard.id);
      if (idx !== -1) newState.waste.splice(idx, 1);
    } else if (dragSource.startsWith('tableau-')) {
      const colIdx = parseInt(dragSource.split('-')[1]);
      const idx = newState.tableau[colIdx].findIndex(
        (c) => c.id === draggedCard.id
      );
      if (idx !== -1) {
        newState.tableau[colIdx].splice(idx, 1);
      }
    } else if (dragSource.startsWith('foundation-')) {
      const suit = dragSource.split('-')[1] as any;
      const idx = newState.foundations[suit].findIndex(
        (c) => c.id === draggedCard.id
      );
      if (idx !== -1) {
        newState.foundations[suit].splice(idx, 1);
      }
    }

    // Try to place on target
    if (target.startsWith('tableau-')) {
      const colIdx = parseInt(target.split('-')[1]);
      if (canPlaceOnTableau(draggedCard, newState.tableau[colIdx])) {
        newState.tableau[colIdx].push(draggedCard);
        canMove = true;
      }
    } else if (target.startsWith('foundation-')) {
      const suit = target.split('-')[1] as any;
      if (canPlaceOnFoundation(draggedCard, newState.foundations[suit])) {
        newState.foundations[suit].push(draggedCard);
        canMove = true;
      }
    }

    if (canMove) {
      newState.moves++;
      setGameState(newState);
      playSound('place');
      checkWin(newState);
    } else {
      // Return card to original position
      if (dragSource === 'deck') {
        newState.deck.push(draggedCard);
      } else if (dragSource === 'waste') {
        newState.waste.unshift(draggedCard);
      } else if (dragSource.startsWith('tableau-')) {
        const colIdx = parseInt(dragSource.split('-')[1]);
        newState.tableau[colIdx].push(draggedCard);
      } else if (dragSource.startsWith('foundation-')) {
        const suit = dragSource.split('-')[1] as any;
        newState.foundations[suit].push(draggedCard);
      }
      setGameState(newState);
      playSound('error');
    }

    setDraggedCard(null);
    setDragSource(null);
  };

  const checkWin = (state: GameState) => {
    const allFound =
      state.foundations.hearts.length === 13 &&
      state.foundations.diamonds.length === 13 &&
      state.foundations.clubs.length === 13 &&
      state.foundations.spades.length === 13;

    if (allFound) {
      state.won = true;
      playSound('win');
    }
  };

  const playSound = (type: string) => {
    if (settings.volume === 0) return;

    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(settings.volume * 0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

    switch (type) {
      case 'flip':
        osc.frequency.setValueAtTime(400, context.currentTime);
        osc.frequency.linearRampToValueAtTime(500, context.currentTime + 0.1);
        break;
      case 'place':
        osc.frequency.setValueAtTime(600, context.currentTime);
        osc.frequency.linearRampToValueAtTime(400, context.currentTime + 0.15);
        break;
      case 'error':
        osc.frequency.setValueAtTime(200, context.currentTime);
        osc.frequency.linearRampToValueAtTime(100, context.currentTime + 0.15);
        break;
      case 'win':
        osc.frequency.setValueAtTime(800, context.currentTime);
        osc.frequency.linearRampToValueAtTime(1000, context.currentTime + 0.3);
        break;
    }

    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.3);
  };

  const handleUndo = () => {
    if (!gameState || gameState.undo.length === 0) return;
    const lastUndo = gameState.undo[gameState.undo.length - 1];
    const newState = { ...lastUndo.gameState };
    newState.undo = gameState.undo.slice(0, -1);
    setGameState(newState);
    playSound('flip');
  };

  if (!gameState) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 pb-16">
      {gameState.won && <WinScreen moves={gameState.moves} />}

      <div className="max-w-6xl mx-auto">
        {/* Top Section: Deck and Foundations */}
        <div className="flex justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold mb-2 opacity-70">DECK</h3>
            <Deck
              deck={gameState.deck}
              waste={gameState.waste}
              onDraw={handleDrawCard}
              onDragStart={handleDragStart}
              onDrop={() => handleDrop('waste')}
            />
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 opacity-70">FOUNDATIONS</h3>
            <Foundations
              foundations={gameState.foundations}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          </div>

          <div className="flex gap-4 items-end">
            <button
              onClick={handleUndo}
              disabled={gameState.undo.length === 0}
              className="px-4 py-2 bg-green-600 text-white font-bold hover:bg-green-500 disabled:opacity-50 transition-colors"
            >
              ↶ UNDO
            </button>
            <button
              onClick={initializeGame}
              className="px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-500 transition-colors"
            >
              RESTART
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2 opacity-70">TABLEAU</h3>
          <Tableau
            tableau={gameState.tableau}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        </div>

        {/* Stats */}
        <Stats moves={gameState.moves} />
      </div>
    </div>
  );
}
