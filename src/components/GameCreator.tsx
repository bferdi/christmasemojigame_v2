import { useState } from 'react';
import { Smile } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { GameLink } from './game/GameLink';
import { encodeGameData } from '../utils/gameEncoding';

export function GameCreator() {
  const [title, setTitle] = useState('');
  const [emojis, setEmojis] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [gameLink, setGameLink] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateGameLink = () => {
    try {
      if (!title.trim() || !emojis.trim()) {
        setError('Please enter both title and emojis');
        return;
      }

      const token = encodeGameData(title.trim(), emojis.trim());
      const link = `${window.location.origin}${window.location.pathname}?game=${encodeURIComponent(token)}`;
      setGameLink(link);
      setError(null);
    } catch (err) {
      setError('Failed to create game. Please try again.');
      console.error('Error creating game:', err);
    }
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">Player 1: Create the Game</h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <Input
        label="Christmas-themed Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a Christmas-themed title (book, movie, etc.)"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Emoji Description
        </label>
        <div className="relative">
          <textarea
            value={emojis}
            readOnly
            placeholder="Click the emoji button to add emojis"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="absolute right-2 top-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <Smile className="w-5 h-5" />
          </button>
          <EmojiPicker
            isOpen={isEmojiPickerOpen}
            onClose={() => setIsEmojiPickerOpen(false)}
            onEmojiSelect={(emoji) => setEmojis(emojis + emoji)}
          />
        </div>
      </div>

      <Button onClick={generateGameLink} className="w-full">
        Generate Game Link
      </Button>

      <GameLink link={gameLink} />
    </div>
  );
}