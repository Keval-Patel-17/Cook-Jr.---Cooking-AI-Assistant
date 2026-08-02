import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Trophy, Coins, Zap, Award, Sparkles, Clock, CheckCircle2, XCircle, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';

interface GameSectionProps {
  user: User | null;
  onUpdateGameStats: (addXp: number, addCoins: number, newBadge?: string) => void;
  language: 'en' | 'hi';
}

export const GameSection: React.FC<GameSectionProps> = ({ user, onUpdateGameStats, language }) => {
  const [activeGame, setActiveGame] = useState<'quiz' | 'rush' | 'memory'>('quiz');

  // GAME 1: QUIZ STATE
  const [quizMode, setQuizMode] = useState<'ingredient' | 'recipe' | 'country' | 'timed'>('ingredient');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState(30);
  const [quizActive, setQuizActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const quizQuestions = {
    ingredient: [
      { q: 'What herb gives Italian Pesto sauce its signature green color & aroma?', options: ['Parsley', 'Fresh Basil', 'Cilantro', 'Mint'], answer: 1 },
      { q: 'What main ingredient thickens authentic Hummus?', options: ['Lentils', 'Chickpeas (Garbanzo)', 'White Beans', 'Potatoes'], answer: 1 },
      { q: 'Which spice gives Indian Turmeric Curry its golden yellow color?', options: ['Cumin', 'Turmeric (Haldi)', 'Saffron', 'Mustard'], answer: 1 },
      { q: 'What is the key base liquid in traditional Japanese Miso Soup?', options: ['Chicken Broth', 'Dashi (Kelp & Bonito)', 'Coconut Milk', 'Soy Milk'], answer: 1 },
    ],
    recipe: [
      { q: 'Tomato sauce + Mozzarella + Fresh Basil on baked dough = ?', options: ['Calzone', 'Margherita Pizza', 'Bruschetta', 'Lasagna'], answer: 1 },
      { q: 'Avocado + Lime juice + Cilantro + Chopped Onion = ?', options: ['Pesto', 'Salsa Verde', 'Guacamole', 'Tzatziki'], answer: 2 },
      { q: 'Paneer cubes + Spiced Tomato Cream Gravy = ?', options: ['Palak Paneer', 'Paneer Butter Masala', 'Kadai Paneer', 'Matar Paneer'], answer: 1 },
      { q: 'Arborio Rice + Broth + Parmesan + Mushrooms cooked slowly = ?', options: ['Paella', 'Risotto', 'Fried Rice', 'Pilaf'], answer: 1 },
    ],
    country: [
      { q: 'From which country did Sushi originate?', options: ['China', 'Japan', 'South Korea', 'Vietnam'], answer: 1 },
      { q: 'Which country is famous for Tacos and Guacamole?', options: ['Spain', 'Colombia', 'Mexico', 'Argentina'], answer: 2 },
      { q: 'Where did Croissants and Soufflé originate?', options: ['Italy', 'France', 'Belgium', 'Switzerland'], answer: 1 },
      { q: 'Which country is known as the birthplace of Biryani and Butter Chicken?', options: ['India', 'Turkey', 'Iran', 'Pakistan'], answer: 0 },
    ],
    timed: [
      { q: 'What vitamin is oranges famously rich in?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], answer: 1 },
      { q: 'Is a tomato scientifically a fruit or vegetable?', options: ['Botanical Fruit', 'Vegetable', 'Herb', 'Root'], answer: 0 },
      { q: 'What ingredient makes bread rise?', options: ['Salt', 'Yeast', 'Baking Powder', 'Cornstarch'], answer: 1 },
    ],
  };

  // GAME 2: KITCHEN RUSH STATE
  const rushItems = [
    { name: 'Mozzarella Cheese', target: 'pizza' },
    { name: 'Fresh Lettuce', target: 'salad' },
    { name: 'Chicken Broth', target: 'soup' },
    { name: 'Sliced Bell Peppers', target: 'stirfry' },
    { name: 'Pepperoni Slices', target: 'pizza' },
    { name: 'Cherry Tomatoes', target: 'salad' },
    { name: 'Rice Noodles', target: 'stirfry' },
  ];
  const [rushIndex, setRushIndex] = useState(0);
  const [rushScore, setRushScore] = useState(0);
  const [rushFeedback, setRushFeedback] = useState<string | null>(null);

  // GAME 3: MEMORY MATCH STATE
  const initialMemoryCards = [
    { id: 1, symbol: '🍔', matched: false, flipped: false },
    { id: 2, symbol: '🍔', matched: false, flipped: false },
    { id: 3, symbol: '🍕', matched: false, flipped: false },
    { id: 4, symbol: '🍕', matched: false, flipped: false },
    { id: 5, symbol: '🥑', matched: false, flipped: false },
    { id: 6, symbol: '🥑', matched: false, flipped: false },
    { id: 7, symbol: '🍣', matched: false, flipped: false },
    { id: 8, symbol: '🍣', matched: false, flipped: false },
    { id: 9, symbol: '🍲', matched: false, flipped: false },
    { id: 10, symbol: '🍲', matched: false, flipped: false },
    { id: 11, symbol: '🍰', matched: false, flipped: false },
    { id: 12, symbol: '🍰', matched: false, flipped: false },
  ];
  const [cards, setCards] = useState(initialMemoryCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Shuffle memory cards on start
  const resetMemoryGame = () => {
    const shuffled = [...initialMemoryCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMemoryMoves(0);
  };

  useEffect(() => {
    resetMemoryGame();
  }, []);

  const handleQuizAnswer = (optIndex: number) => {
    const currentList = quizQuestions[quizMode];
    const currentQ = currentList[quizIndex % currentList.length];
    setSelectedAnswer(optIndex);

    if (optIndex === currentQ.answer) {
      setQuizScore((s) => s + 1);
      onUpdateGameStats(25, 10, 'Quiz Master');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      if (quizIndex + 1 < currentList.length) {
        setQuizIndex((i) => i + 1);
      } else {
        alert(`Quiz Complete! Final Score: ${quizScore + (optIndex === currentQ.answer ? 1 : 0)} / ${currentList.length}`);
        setQuizIndex(0);
        setQuizScore(0);
      }
    }, 1200);
  };

  const handleRushAssign = (target: string) => {
    const currentItem = rushItems[rushIndex];
    if (currentItem.target === target) {
      setRushScore((s) => s + 1);
      setRushFeedback('Correct! Great chef speed!');
      onUpdateGameStats(15, 5, 'Kitchen Rush Champ');
    } else {
      setRushFeedback('Oops! Wrong pot for this ingredient.');
    }

    setTimeout(() => {
      setRushFeedback(null);
      setRushIndex((i) => (i + 1) % rushItems.length);
    }, 1000);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        onUpdateGameStats(30, 15, 'Memory Master');

        if (newCards.every((c) => c.matched)) {
          confetti({ particleCount: 100, spread: 100 });
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Interactive Culinary Games</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50">
          {language === 'hi' ? 'कुकिंग गेम्स और पुरस्कार' : 'Play Cooking Games & Win XP'}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
          Test your culinary knowledge, rush kitchen orders, and match ingredient memory cards to earn coins, level up, and unlock chef badges!
        </p>
      </div>

      {/* Persistent Player Profile Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-inner border border-white/30">
            Lvl {user?.level || 1}
          </div>
          <div>
            <div className="text-lg font-black">{user?.name || 'Chef Junior'}</div>
            <div className="text-xs text-amber-100 font-semibold">Total XP: {user?.xp || 0} / {(user?.level || 1) * 150}</div>
            
            {/* Progress Bar */}
            <div className="w-48 bg-black/20 h-2.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-amber-300 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (((user?.xp || 0) % 150) / 150) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-bold">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
            <Coins className="w-5 h-5 fill-amber-300 text-amber-300" />
            <span>{user?.coins || 0} Coins</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
            <Zap className="w-5 h-5 fill-red-300 text-red-300" />
            <span>{user?.streak || 1}d Streak</span>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-center gap-3 max-w-md mx-auto p-1.5 rounded-2xl glass-panel border border-orange-500/20 bg-stone-100/70 dark:bg-stone-800/70">
        <button
          onClick={() => setActiveGame('quiz')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeGame === 'quiz' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Quiz</span>
        </button>
        <button
          onClick={() => setActiveGame('rush')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeGame === 'rush' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>2. Kitchen Rush</span>
        </button>
        <button
          onClick={() => setActiveGame('memory')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeGame === 'memory' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>3. Memory Match</span>
        </button>
      </div>

      {/* GAME 1: COOKING QUIZ */}
      {activeGame === 'quiz' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6 bg-white/90 dark:bg-stone-900/90 shadow-xl max-w-2xl mx-auto">
          
          {/* Sub-modes selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'ingredient', label: 'Guess Ingredient' },
              { id: 'recipe', label: 'Guess Recipe' },
              { id: 'country', label: 'Country Cuisine' },
              { id: 'timed', label: '30s Challenge' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setQuizMode(m.id as any);
                  setQuizIndex(0);
                  setQuizScore(0);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  quizMode === m.id ? 'bg-amber-500 text-white shadow' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Question Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500">
              <span>Question {quizIndex + 1} of {quizQuestions[quizMode].length}</span>
              <span className="text-orange-500">Score: {quizScore}</span>
            </div>

            <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 leading-snug">
              {quizQuestions[quizMode][quizIndex]?.q}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {quizQuestions[quizMode][quizIndex]?.options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === oIdx;
                const isCorrect = oIdx === quizQuestions[quizMode][quizIndex].answer;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizAnswer(oIdx)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-2xl font-extrabold text-sm border text-left transition cursor-pointer ${
                      selectedAnswer !== null
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : isSelected
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-orange-500'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GAME 2: KITCHEN RUSH */}
      {activeGame === 'rush' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6 bg-white/90 dark:bg-stone-900/90 shadow-xl max-w-2xl mx-auto text-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-black">Kitchen Rush: Assign Ingredients</h3>
            <p className="text-xs text-stone-500">Tap the correct cooking vessel before time runs out!</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-500/30 space-y-2">
            <div className="text-xs font-bold text-stone-400 uppercase">Incoming Ingredient Order</div>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
              {rushItems[rushIndex].name}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'pizza', name: '🍕 Pizza Oven' },
              { id: 'soup', name: '🍲 Soup Pot' },
              { id: 'salad', name: '🥗 Salad Bowl' },
              { id: 'stirfry', name: '🍳 Stir-fry Pan' },
            ].map((pot) => (
              <button
                key={pot.id}
                onClick={() => handleRushAssign(pot.id)}
                className="p-4 rounded-2xl btn-skeuo-secondary text-xs font-bold hover:border-orange-500 cursor-pointer transition"
              >
                {pot.name}
              </button>
            ))}
          </div>

          {rushFeedback && (
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold">
              {rushFeedback}
            </div>
          )}
        </div>
      )}

      {/* GAME 3: MEMORY MATCH */}
      {activeGame === 'memory' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6 bg-white/90 dark:bg-stone-900/90 shadow-xl max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>Moves: {memoryMoves}</span>
            <button
              onClick={resetMemoryGame}
              className="px-3 py-1.5 rounded-xl btn-skeuo-secondary text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {cards.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`h-20 rounded-2xl text-3xl flex items-center justify-center font-bold border transition cursor-pointer ${
                  card.flipped || card.matched
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 hover:border-orange-400'
                }`}
              >
                {card.flipped || card.matched ? card.symbol : '❓'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
