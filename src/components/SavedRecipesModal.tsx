import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, X, Search, Trash2, Clock, Flame, Utensils, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface SavedRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({ isOpen, onClose }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSavedRecipes();
    }
  }, [isOpen]);

  const fetchSavedRecipes = async () => {
    try {
      const res = await fetch('/api/user/saved-recipes');
      const json = await res.json();
      setRecipes(json.recipes || []);
    } catch (err) {
      console.error('Failed to load saved recipes:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/user/saved-recipes/${id}`, { method: 'DELETE' });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecipe?.id === id) setSelectedRecipe(null);
    } catch (err) {
      alert('Could not delete recipe');
    }
  };

  if (!isOpen) return null;

  const filtered = recipes.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 bg-white/95 dark:bg-stone-900/95 shadow-2xl space-y-6 max-h-[90vh] overflow-hidden flex flex-col text-stone-800 dark:text-stone-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-50">My Saved Cookbook</h3>
              <p className="text-xs text-stone-500">Access your saved custom AI recipes anytime</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search saved recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60 text-xs focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center p-12 text-stone-400 text-xs italic">
              No saved recipes found. Generate a custom recipe or pantry match and tap "Save Recipe"!
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl glass-panel border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-3 bg-stone-50/50 dark:bg-stone-800/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                      {r.cuisine || 'Chef Special'}
                    </span>
                    <button
                      onClick={() => r.id && handleDelete(r.id)}
                      className="text-stone-400 hover:text-red-500 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 mt-2">{r.title}</h4>

                  <div className="flex items-center gap-3 text-xs font-bold text-stone-500 mt-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {r.cookTime}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> {r.calories} kcal</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecipe(r)}
                  className="w-full py-2 btn-skeuo-secondary text-xs font-bold hover:border-orange-500 transition cursor-pointer"
                >
                  View Full Recipe
                </button>
              </div>
            ))
          )}
        </div>

        {/* Full Recipe Details Modal Overlay */}
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="relative w-full max-w-xl p-6 rounded-3xl glass-panel bg-white dark:bg-stone-900 space-y-4 max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-black">{selectedRecipe.title}</h3>
              <p className="text-xs text-stone-500 italic">{selectedRecipe.tagline}</p>

              <div>
                <h5 className="text-xs font-extrabold uppercase text-orange-500 mb-1">Ingredients</h5>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {selectedRecipe.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-extrabold uppercase text-orange-500 mb-1">Steps</h5>
                <ol className="text-xs space-y-1.5 list-decimal list-inside">
                  {selectedRecipe.steps.map((s) => (
                    <li key={s.stepNumber}>{s.text}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
