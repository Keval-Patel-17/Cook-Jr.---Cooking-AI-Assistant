import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Plus, X, Utensils, Clock, Flame, Lightbulb, Save, CheckCircle, ChefHat } from 'lucide-react';
import { IngredientRecipe, Recipe } from '../types';

interface IngredientRecipeGeneratorProps {
  onSaveRecipe: (recipe: Recipe) => void;
  language: 'en' | 'hi';
}

export const IngredientRecipeGenerator: React.FC<IngredientRecipeGeneratorProps> = ({
  onSaveRecipe,
  language,
}) => {
  const [ingredients, setIngredients] = useState<string[]>(['Tomato', 'Garlic', 'Paneer', 'Spinach']);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<IngredientRecipe[]>([]);
  const [savedIndexes, setSavedIndexes] = useState<Record<number, boolean>>({});

  const pantryPresets = ['Tomatoes', 'Paneer', 'Garlic', 'Spinach', 'Rice', 'Eggs', 'Bell Peppers', 'Potatoes', 'Chicken', 'Cheese', 'Butter'];

  const addIngredient = (ing: string) => {
    const trimmed = ing.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
      setInputValue('');
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient to generate recipes!');
      return;
    }
    setLoading(true);
    setRecipes([]);
    setSavedIndexes({});

    try {
      const res = await fetch('/api/ai/recipe-by-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate recipes');

      setRecipes(data.recipes || []);
    } catch (err: any) {
      alert(err.message || 'Error generating recipes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOption = (rec: IngredientRecipe, idx: number) => {
    const formattedRecipe: Recipe = {
      title: rec.title,
      prepTime: rec.prepTime,
      cookTime: rec.cookTime,
      calories: rec.calories,
      protein: '18g',
      carbs: '30g',
      fat: '10g',
      ingredients: [...rec.matchedIngredients, ...(rec.extraPantryNeeded || [])],
      steps: rec.steps,
      shoppingList: rec.extraPantryNeeded || [],
      chefTip: rec.proTips?.tasteEnhancement,
    };
    onSaveRecipe(formattedRecipe);
    setSavedIndexes((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Zero-Waste Pantry Matcher</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50">
          {language === 'hi' ? 'सामग्री से रेसिपी खोजें' : 'Recipes Based on Your Ingredients'}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
          Add what you have in your fridge or pantry. AI will create 3 delicious alternative recipes with pro tips for taste, storage & swaps.
        </p>
      </div>

      {/* Ingredient Tag Input Panel */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6 bg-white/80 dark:bg-stone-900/80 shadow-xl">
        
        {/* Input Bar */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
            Add Available Ingredients
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addIngredient(inputValue);
                }
              }}
              placeholder="Type ingredient (e.g. Tomato, Paneer, Mushroom) and press Enter"
              className="flex-1 py-3 px-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={() => addIngredient(inputValue)}
              className="px-5 py-3 btn-skeuo font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Quick Pantry Presets */}
        <div>
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
            Quick Add Staples
          </div>
          <div className="flex flex-wrap gap-2">
            {pantryPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => addIngredient(preset)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-orange-500/10 hover:text-orange-600 text-stone-600 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Ingredients Tag List */}
        <div>
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            Selected Pantry List ({ingredients.length})
          </div>
          {ingredients.length === 0 ? (
            <div className="text-xs text-stone-400 italic p-3 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl text-center">
              No ingredients added yet. Type above or tap quick staples!
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-sm"
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    className="hover:bg-white/20 rounded-full p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || ingredients.length === 0}
          className="w-full py-4 btn-skeuo text-base font-extrabold flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-xl"
        >
          {loading ? (
            <>
              <ChefHat className="w-5 h-5 animate-spin" />
              <span>Mixing pantry ingredients into recipes...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Find Pantry Recipes</span>
            </>
          )}
        </button>
      </div>

      {/* Multiple Alternative Recipes Output Grid */}
      {recipes.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 text-center">
            3 Pantry Recipe Ideas Generated
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipes.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="p-6 rounded-3xl glass-panel border border-orange-500/30 flex flex-col justify-between space-y-6 bg-white/90 dark:bg-stone-900/90 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase">
                      {rec.category || `Option ${idx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {rec.cookTime}
                    </span>
                  </div>

                  <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-50">{rec.title}</h4>

                  <div className="flex items-center gap-3 text-xs font-bold text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1 text-orange-500">
                      <Flame className="w-4 h-4" /> {rec.calories} kcal
                    </span>
                    <span>•</span>
                    <span>{rec.difficulty}</span>
                  </div>

                  {/* Steps list */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-700 dark:text-stone-300">Steps:</div>
                    <ol className="space-y-2 text-xs text-stone-600 dark:text-stone-300 list-decimal list-inside font-medium">
                      {rec.steps.map((step) => (
                        <li key={step.stepNumber} className="leading-relaxed">
                          {step.text}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Pro Tips Section */}
                  {rec.proTips && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                      <div className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4" /> Pro Chef Tips:
                      </div>
                      <p className="text-stone-700 dark:text-stone-200">
                        <strong className="text-stone-900 dark:text-stone-100">Flavor:</strong> {rec.proTips.tasteEnhancement}
                      </p>
                      <p className="text-stone-700 dark:text-stone-200">
                        <strong className="text-stone-900 dark:text-stone-100">Storage:</strong> {rec.proTips.storageIdeas}
                      </p>
                      <p className="text-stone-700 dark:text-stone-200">
                        <strong className="text-stone-900 dark:text-stone-100">Swaps:</strong> {rec.proTips.substitutions}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSaveOption(rec, idx)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                    savedIndexes[idx] ? 'bg-emerald-500 text-white' : 'btn-skeuo'
                  }`}
                >
                  {savedIndexes[idx] ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Saved to Cookbook</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Option #{idx + 1}</span>
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
