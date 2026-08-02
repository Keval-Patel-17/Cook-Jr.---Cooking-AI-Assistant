import React from 'react';
import { motion } from 'motion/react';
import { Utensils, BookOpen, Dumbbell, Calendar, ShieldCheck, Gamepad2, ArrowRight, Flame, Sparkles, ChefHat } from 'lucide-react';
import { AppTab, User } from '../types';

interface DashboardViewProps {
  onSelectTab: (tab: AppTab) => void;
  user: User | null;
  language: 'en' | 'hi';
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab, user, language }) => {
  const cards = [
    {
      tab: 'custom-recipe' as AppTab,
      title: language === 'hi' ? 'कस्टम एआई रेसिपी' : 'Customized Recipe Generation (AI)',
      desc: 'Specify dietary preference, cuisine, flavor priority, or dish name to generate a complete step-by-step master recipe.',
      icon: <Utensils className="w-7 h-7 text-orange-500" />,
      badge: 'AI Powered',
      gradient: 'from-orange-500/10 to-amber-500/10',
      border: 'border-orange-500/30',
    },
    {
      tab: 'ingredient-recipe' as AppTab,
      title: language === 'hi' ? 'सामग्री आधारित रेसिपी' : 'Recipe Based on Ingredients (AI)',
      desc: 'Input available pantry ingredients to generate 3 alternative recipes complete with taste, storage & swap pro tips.',
      icon: <BookOpen className="w-7 h-7 text-amber-500" />,
      badge: 'Zero Waste AI',
      gradient: 'from-amber-500/10 to-yellow-500/10',
      border: 'border-amber-500/30',
    },
    {
      tab: 'gym' as AppTab,
      title: language === 'hi' ? 'जिम और पोषण सेक्शन' : 'Gym Section & Fitness Nutrition (AI)',
      desc: 'Customized diet & workout schedule, macronutrient breakdown, meal timing, hydration tracker, and monthly report graphs.',
      icon: <Dumbbell className="w-7 h-7 text-emerald-500" />,
      badge: 'Fitness AI',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-500/30',
    },
    {
      tab: 'scheduler' as AppTab,
      title: language === 'hi' ? 'स्मार्ट मील शेड्यूलर' : 'Smart Scheduler (AI)',
      desc: 'Set custom breakfast, lunch, snacks, and dinner times to generate a color-coded 7-day meal timetable grid.',
      icon: <Calendar className="w-7 h-7 text-blue-500" />,
      badge: 'Timetable AI',
      gradient: 'from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-500/30',
    },
    {
      tab: 'kitchen-safety' as AppTab,
      title: language === 'hi' ? 'रसोई प्रबंधन एवं सुरक्षा' : 'Kitchen Management & Safety',
      desc: 'Information-only cards for kitchen hygiene, food storage, knife safety, cleaning, gas safety, and emergency first aid.',
      icon: <ShieldCheck className="w-7 h-7 text-purple-500" />,
      badge: 'Safety Library',
      gradient: 'from-purple-500/10 to-pink-500/10',
      border: 'border-purple-500/30',
    },
    {
      tab: 'games' as AppTab,
      title: language === 'hi' ? 'कुकिंग गेम्स' : 'Culinary Games & Rewards',
      desc: 'Cooking Quiz, Kitchen Rush order matching, and Memory Match card flips. Earn XP, coins, levels, and badges!',
      icon: <Gamepad2 className="w-7 h-7 text-rose-500" />,
      badge: 'Earn Rewards',
      gradient: 'from-rose-500/10 to-red-500/10',
      border: 'border-rose-500/30',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl space-y-3 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 opacity-20 text-9xl pointer-events-none select-none">
          🍳
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100">
          <ChefHat className="w-4 h-4" />
          <span>Welcome back, {user?.name || 'Chef Junior'}!</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black">Your Smart Kitchen Control Center</h2>
        <p className="text-sm text-amber-100 max-w-xl font-medium">
          Choose a section below or ask Chef Jr. in the floating voice assistant for instant kitchen guidance.
        </p>
      </div>

      {/* Main Grid of 6 Vertical Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            onClick={() => onSelectTab(card.tab)}
            className={`p-6 rounded-3xl glass-panel border ${card.border} bg-gradient-to-br ${card.gradient} flex flex-col justify-between space-y-6 cursor-pointer hover:shadow-2xl transition-all shadow-lg`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 shadow-md">
                  {card.icon}
                </div>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-stone-800/80 text-stone-800 dark:text-stone-100 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 leading-snug">{card.title}</h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed font-medium">{card.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200/50 dark:border-stone-800 text-xs font-black text-orange-600 dark:text-orange-400">
              <span>Open Studio</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
