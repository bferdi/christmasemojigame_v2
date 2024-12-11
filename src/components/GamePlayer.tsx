import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { GameResult } from './game/GameResult';
import { decodeGameData } from '../utils/gameEncoding';
import type { Game } from '../types/game';

interface GamePlayerProps {
  gameId: string;
}

export function GamePlayer({ gameId }: GamePlayerProps) {
  const [gameData, setGameData] = useState<Game | null>(null);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGame = () => {
      try {
        setIsLoading(true);
        const game = decodeGameData(gameId);
        if (game) {
          setGameData(game);
          setError(null);
        } else {
          setError('Game not found. Please check the link and try again.');
        }
      } catch (err) {
        setError('Failed to load game. Please try again.');
        console.error('Error loading game:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGame();
  }, [gameId]);

  const checkGuess = () => {
    if (!gameData || !guess.trim()) return;
    
    if (guess.trim().toLowerCase() === gameData.title.toLowerCase()) {
      setResult('🎉 Correct! You got it!');
    } else {
      setResult('❌ Not quite right. Try again!');
    }
    setGuess('');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-red-600 text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center text-gray-600">
          <p>Game not found. Please check the link and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">Guess the Christmas Title!</h2>
      
      <div className="text-4xl text-center py-6">
        {gameData.emojis}
      </div>

      <Input
        label="Your Guess"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess"
        onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
      />

      <Button onClick={checkGuess} className="w-full">
        Submit Guess
      </Button>

      <GameResult result={result} />
    </div>
  );
}