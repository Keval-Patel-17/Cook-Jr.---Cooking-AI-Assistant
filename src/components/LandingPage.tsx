import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, ChefHat, ArrowRight, Utensils, Heart, ShieldCheck, Dumbbell, Calendar, Gamepad2 } from 'lucide-react';

interface LandingPageProps {
  onContinue: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onContinue }) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Flame Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-semibold mb-6 shadow-md bg-amber-500/10">
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
          <span>Your Smart AI Kitchen Companion</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        {/* Large Centered Headline */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-stone-900 dark:text-stone-50 mb-6 drop-shadow-sm">
          Cook <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">Jr.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl font-medium text-stone-600 dark:text-stone-300 max-w-2xl mb-8 leading-relaxed">
          AI-powered cooking made effortless, delicious, and fun. Craft custom recipes, turn leftover ingredients into feasts, reach fitness goals, and master kitchen safety!
        </p>

        {/* Feature Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl mb-10 text-xs sm:text-sm font-medium">
          <div className="p-3 rounded-xl glass-panel flex items-center justify-center gap-2 text-stone-700 dark:text-stone-200">
            <ChefHat className="w-4 h-4 text-orange-500" /> AI Recipe Studio
          </div>
          <div className="p-3 rounded-xl glass-panel flex items-center justify-center gap-2 text-stone-700 dark:text-stone-200">
            <Utensils className="w-4 h-4 text-amber-500" /> Pantry Cook
          </div>
          <div className="p-3 rounded-xl glass-panel flex items-center justify-center gap-2 text-stone-700 dark:text-stone-200">
            <Dumbbell className="w-4 h-4 text-orange-500" /> Fitness Nutrition
          </div>
          <div className="p-3 rounded-xl glass-panel flex items-center justify-center gap-2 text-stone-700 dark:text-stone-200">
            <Calendar className="w-4 h-4 text-amber-500" /> Smart Scheduler
          </div>
          <div className="p-3 rounded-xl glass-panel flex items-center justify-center gap-2 text-stone-700 dark:text-stone-200">
            <ShieldCheck className="w-4 h-4 text-orange-500" /> Kitchen Safety
          </div>
          <div className="p-3 rounded-xl glass-panel flex items-center justify-center gap-2 text-stone-700 dark:text-stone-200">
            <Gamepad2 className="w-4 h-4 text-amber-500" /> Culinary Games
          </div>
        </div>

        {/* Prominent Continue Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="btn-skeuo px-10 py-5 text-xl font-bold rounded-2xl flex items-center gap-3 cursor-pointer group shadow-2xl"
        >
          <span>Continue to Kitchen</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};
