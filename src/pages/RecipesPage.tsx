import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, BookOpen, Sparkles } from 'lucide-react';
import { RecipeGenerator } from '../components/RecipeGenerator';
import { IngredientRecipeGenerator } from '../components/IngredientRecipeGenerator';
import { useAuth } from '@/lib/AuthContext';
import { Recipe } from '../types';

export function RecipesPage() {
  const [activeSubTab, setActiveSubTab] = useState<'custom' | 'pantry'>('custom');
  const { language } = useAuth();

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      const token = localStorage.getItem('cookjr_token');
      await fetch('/api/user/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ recipe }),
      });
    } catch (err) {
      console.error('Failed to save recipe:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation for Recipes */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl glass-panel max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTab('custom')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'custom'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>{language === 'hi' ? 'एआई रेसिपी' : 'Custom AI Recipe'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pantry')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'pantry'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'hi' ? 'सामग्री से' : 'Pantry Match AI'}</span>
        </button>
      </div>

      {/* Render Active Recipe Generator */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSubTab === 'custom' ? (
          <RecipeGenerator onSaveRecipe={handleSaveRecipe} language={language || 'en'} />
        ) : (
          <IngredientRecipeGenerator onSaveRecipe={handleSaveRecipe} language={language || 'en'} />
        )}
      </motion.div>
    </div>
  );
}
