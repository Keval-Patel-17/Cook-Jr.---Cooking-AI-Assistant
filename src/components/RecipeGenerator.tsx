import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Sparkles, Clock, Flame, Utensils, CheckCircle, Save, Timer, ShoppingBag, ArrowRight, Share2, Play, Pause, RotateCcw } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeGeneratorProps {
  onSaveRecipe: (recipe: Recipe) => void;
  language: 'en' | 'hi';
}

export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onSaveRecipe, language }) => {
  const [isVeg, setIsVeg] = useState(true);
  const [cuisine, setCuisine] = useState('Indian');
  const [tastePriority, setTastePriority] = useState('Spicy & Savory');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Step Timers
  const [activeTimerStep, setActiveTimerStep] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  const cuisines = [
    'Indian',
    'Italian',
    'Mexican',
    'Asian',
    'Mediterranean',
    'American',
    'Thai',
    'French',
    'Middle Eastern',
  ];

  const tasteOptions = [
    'Spicy & Savory',
    'Sweet & Creamy',
    'Tangy & Zesty',
    'Rich Umami',
    'Mild & Subtle',
    'Smoky Grill',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecipe(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/ai/recipe-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVeg, cuisine, tastePriority, keyword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Recipe creation failed');

      setRecipe(data.recipe);
    } catch (err: any) {
      alert(err.message || 'Could not generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!recipe) return;
    onSaveRecipe({ ...recipe, isVeg, cuisine });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleShoppingItem = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  // Timer logic
  const startTimer = (stepNum: number, minutes: number) => {
    setActiveTimerStep(stepNum);
    setTimerSecondsLeft(minutes * 60);
    setTimerRunning(true);
  };

  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => setTimerSecondsLeft((sec) => sec - 1), 1000);
    } else if (timerSecondsLeft === 0 && timerRunning) {
      setTimerRunning(false);
      alert('⏰ Timer finished! Time to check your cooking step.');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSecondsLeft]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Custom Recipe Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50">
          {language === 'hi' ? 'अपनी मनपसंद रेसिपी बनाएं' : 'Craft Your Custom AI Recipe'}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
          Choose dietary preferences, cuisine style, flavor profile, or dish keywords to generate precise step-by-step master recipes.
        </p>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Veg / Non-Veg Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
              Dietary Preference
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setIsVeg(true)}
                className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  isVeg ? 'bg-emerald-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 border border-white" />
                <span>Vegetarian</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVeg(false)}
                className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  !isVeg ? 'bg-red-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-300 border border-white" />
                <span>Non-Vegetarian</span>
              </button>
            </div>
          </div>

          {/* Cuisine Dropdown */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
              Cuisine Style
            </label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold focus:outline-none focus:border-orange-500"
            >
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c} Cuisine
                </option>
              ))}
            </select>
          </div>

          {/* Taste Priority */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
              Taste Priority / Flavor Profile
            </label>
            <div className="flex flex-wrap gap-2">
              {tasteOptions.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTastePriority(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    tastePriority === t
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white/50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-orange-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Keyword / Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
              Dish Keyword or Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paneer Butter Masala, Creamy Pasta, Tacos..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold focus:outline-none focus:border-orange-500"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 btn-skeuo text-base font-extrabold flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-xl"
        >
          {loading ? (
            <>
              <ChefHat className="w-5 h-5 animate-spin" />
              <span>Chef Jr. is crafting your recipe...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate AI Recipe</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Recipe Display Card */}
      {recipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-3xl glass-panel border border-orange-500/30 space-y-8 bg-white/90 dark:bg-stone-900/90 shadow-2xl"
        >
          {/* Top Title & Save Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/60 dark:border-stone-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${recipe.isVeg ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                  {recipe.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 text-[11px] font-extrabold">
                  {recipe.cuisine || cuisine}
                </span>
              </div>
              <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50">{recipe.title}</h3>
              {recipe.tagline && <p className="text-sm text-stone-500 italic mt-1">{recipe.tagline}</p>}
            </div>

            <button
              onClick={handleSave}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-md ${
                savedSuccess ? 'bg-emerald-500 text-white' : 'btn-skeuo'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Saved to Cookbook!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Recipe</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <div className="text-[10px] uppercase font-bold text-stone-500">Total Time</div>
              <div className="text-lg font-black text-stone-800 dark:text-stone-100">{recipe.totalTime || recipe.cookTime}</div>
            </div>
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="text-[10px] uppercase font-bold text-stone-500">Calories</div>
              <div className="text-lg font-black text-stone-800 dark:text-stone-100">{recipe.calories} kcal</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <Utensils className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-[10px] uppercase font-bold text-stone-500">Protein</div>
              <div className="text-lg font-black text-stone-800 dark:text-stone-100">{recipe.protein}</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <ShoppingBag className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-[10px] uppercase font-bold text-stone-500">Carbs / Fat</div>
              <div className="text-sm font-black text-stone-800 dark:text-stone-100">{recipe.carbs} / {recipe.fat}</div>
            </div>
          </div>

          {/* Ingredients & Shopping List Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Ingredients */}
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
              <h4 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                <span>Ingredients</span>
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-700 dark:text-stone-200">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shopping List with Checkboxes */}
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
              <h4 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span>Shopping List</span>
              </h4>
              <div className="space-y-2 text-sm">
                {recipe.shoppingList.map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700/50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item]}
                      onChange={() => toggleShoppingItem(item)}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className={checkedItems[item] ? 'line-through text-stone-400' : 'text-stone-700 dark:text-stone-200'}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Step-by-Step Cooking Instructions */}
          <div className="space-y-4">
            <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-orange-500" />
              <span>Step-by-Step Instructions</span>
            </h4>

            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 rounded-2xl glass-panel border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center shrink-0 shadow-md">
                      {step.stepNumber}
                    </div>
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed">
                      {step.text}
                    </p>
                  </div>

                  {step.timerMinutes && step.timerMinutes > 0 && (
                    <button
                      onClick={() => startTimer(step.stepNumber, step.timerMinutes!)}
                      className="px-3.5 py-2 rounded-xl btn-skeuo-secondary text-xs font-bold flex items-center gap-1.5 shrink-0 hover:border-orange-500 cursor-pointer"
                    >
                      <Timer className="w-4 h-4 text-orange-500" />
                      <span>Start {step.timerMinutes}m Timer</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Timer Overlay Banner */}
          {activeTimerStep !== null && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <Timer className="w-6 h-6 animate-pulse" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Step {activeTimerStep} Timer</div>
                  <div className="text-2xl font-black">
                    {Math.floor(timerSecondsLeft / 60)}:{String(timerSecondsLeft % 60).padStart(2, '0')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                >
                  {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    setActiveTimerStep(null);
                    setTimerRunning(false);
                  }}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Chef Secret Tip */}
          {recipe.chefTip && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-800 dark:text-stone-200 text-sm flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-600 dark:text-amber-400">Pro Chef Secret: </span>
                <span>{recipe.chefTip}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
