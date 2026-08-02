import React from 'react';
import { motion } from 'motion/react';

const floatingFoodItems = [
  { emoji: '🍔', title: 'Gourmet Burger', cal: '520 kcal', position: 'top-12 left-6 md:left-12', animation: 'animate-float' },
  { emoji: '🍕', title: 'Artisan Pizza', cal: '380 kcal', position: 'top-28 right-8 md:right-16', animation: 'animate-float-delayed' },
  { emoji: '🥗', title: 'Protein Bowl', cal: '310 kcal', position: 'top-1/2 left-4 md:left-10', animation: 'animate-float-reverse' },
  { emoji: '🥑', title: 'Avocado Toast', cal: '240 kcal', position: 'top-2/3 right-6 md:right-14', animation: 'animate-float' },
  { emoji: '🍲', title: 'Ramen Delight', cal: '450 kcal', position: 'bottom-20 left-12 md:left-24', animation: 'animate-float-delayed' },
  { emoji: '🍣', title: 'Sushi Selection', cal: '290 kcal', position: 'bottom-16 right-10 md:right-28', animation: 'animate-float-reverse' },
];

export const Background3DFood: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Soft warm orange ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl dark:bg-orange-600/10" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl dark:bg-amber-600/10" />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl dark:bg-orange-500/10" />

      {/* Floating Glassmorphic 3D Food Illustration Cards */}
      {floatingFoodItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.82, scale: 1 }}
          transition={{ duration: 1, delay: index * 0.15 }}
          className={`absolute hidden sm:flex items-center gap-3 p-3 rounded-2xl glass-panel ${item.position} ${item.animation} shadow-lg border border-orange-500/20 backdrop-blur-md bg-white/40 dark:bg-stone-900/40`}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md transform -rotate-3 hover:rotate-0 transition-transform">
            {item.emoji}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">{item.title}</div>
            <div className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">{item.cal}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
