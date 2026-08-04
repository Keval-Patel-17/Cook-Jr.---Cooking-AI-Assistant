import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, ArrowRight, UtensilsCrossed, Dumbbell, CalendarDays, ShieldCheck, Sun, Moon, LogIn } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300 select-none">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tl from-orange-600/20 to-amber-300/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-orange-500/5 blur-[120px]" />
      </div>
      
      {/* Floating Kitchen Badges in Background */}
      <div className="absolute inset-0 pointer-events-none hidden md:block z-0 opacity-80">
        {/* Floating Badge 1 - Left Top */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[10%] p-3.5 rounded-2xl glass-panel shadow-xl border border-orange-500/20 flex items-center gap-3 backdrop-blur-md bg-white/70 dark:bg-stone-900/70"
        >
          <div className="p-2 rounded-xl bg-orange-500 text-white">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono">Pantry Magic AI</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400">Zero Food Waste Recipes</div>
          </div>
        </motion.div>

        {/* Floating Badge 2 - Right Top */}
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/4 right-[10%] p-3.5 rounded-2xl glass-panel shadow-xl border border-amber-500/20 flex items-center gap-3 backdrop-blur-md bg-white/70 dark:bg-stone-900/70"
        >
          <div className="p-2 rounded-xl bg-amber-500 text-white">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono">Gym & Macro Coach</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400">Tailored Workout & Meal Plans</div>
          </div>
        </motion.div>

        {/* Floating Badge 3 - Left Bottom */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 left-[8%] p-3.5 rounded-2xl glass-panel shadow-xl border border-orange-500/20 flex items-center gap-3 backdrop-blur-md bg-white/70 dark:bg-stone-900/70"
        >
          <div className="p-2 rounded-xl bg-orange-600 text-white">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono">Smart Meal Timetables</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400">Weekly Chef Schedules</div>
          </div>
        </motion.div>

        {/* Floating Badge 4 - Right Bottom */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-1/3 right-[8%] p-3.5 rounded-2xl glass-panel shadow-xl border border-emerald-500/20 flex items-center gap-3 backdrop-blur-md bg-white/70 dark:bg-stone-900/70"
        >
          <div className="p-2 rounded-xl bg-emerald-500 text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono">Kitchen Safety Guard</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400">Storage & Hygiene Expert</div>
          </div>
        </motion.div>
      </div>
      
      {/* Header Bar */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-900 via-orange-600 to-amber-600 dark:from-white dark:via-orange-400 dark:to-amber-400">
            Cook Jr.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl glass-panel hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition cursor-pointer text-stone-700 dark:text-stone-300"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-700" />}
          </button>

        </div>
      </header>

      {/* CENTERED HERO CONTENT SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center my-auto max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-POWERED KITCHEN INTELLIGENCE</span>
          </div>

          {/* MAIN TITLE: COOK JUNIOR (Using Gondens / Luxury Display Serif style typography) */}
          <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider uppercase mb-6 leading-none"
            style={{
              fontFamily: "'Bodoni Moda', 'Cinzel Decorative', 'Playfair Display', serif",
              background: 'linear-gradient(135deg, #1c1917 0%, #ea580c 37%, #d97706 75%, #ca8a04 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 10px 20px rgba(249, 115, 22, 0.15))',
            }}
          >
            COOK JUNIOR
          </h1>

          {/* DESCRIPTION PARAGRAPH (3-4 lines centered & responsive) */}
          <p className="max-w-3xl text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 font-serif leading-relaxed sm:leading-loose mb-10 px-2">
            Your intelligent cooking companion that helps you create personalized recipes, discover delicious meals from leftover ingredients, manage your kitchen efficiently, and achieve your health goals with AI-powered guidance. Cook Junior makes every meal smarter, easier, and more enjoyable.
          </p>

          {/* GET STARTED BUTTON */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <button
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="px-10 py-4 sm:px-12 sm:py-5 rounded-2xl btn-skeuo text-base sm:text-lg font-bold flex items-center justify-center gap-3 shadow-2xl hover:shadow-orange-500/40 cursor-pointer group transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-stone-400 dark:text-stone-500">
        <p>© 2026 Cook Junior • Smart Culinary & Nutrition Intelligence</p>
      </footer>
    </div>
  );
}
