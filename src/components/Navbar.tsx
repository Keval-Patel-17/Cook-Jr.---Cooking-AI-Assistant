import React, { useState } from 'react';
import { Flame, ChefHat, BookOpen, Utensils, Dumbbell, Calendar, ShieldCheck, Gamepad2, Bookmark, Globe, LogOut, Menu, X, Coins, Trophy, Zap } from 'lucide-react';
import { AppTab, User } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  user: User | null;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onOpenSavedRecipes: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  language,
  onToggleLanguage,
  onOpenSavedRecipes,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { tab: AppTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', icon: <ChefHat className="w-4 h-4" /> },
    { tab: 'custom-recipe', label: language === 'hi' ? 'एआई रेसिपी' : 'AI Recipe', icon: <Utensils className="w-4 h-4" /> },
    { tab: 'ingredient-recipe', label: language === 'hi' ? 'सामग्री से' : 'Pantry Match', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'gym', label: language === 'hi' ? 'जिम और आहार' : 'Gym & Diet', icon: <Dumbbell className="w-4 h-4" /> },
    { tab: 'scheduler', label: language === 'hi' ? 'स्मार्ट टाइमटेबल' : 'Scheduler', icon: <Calendar className="w-4 h-4" /> },
    { tab: 'kitchen-safety', label: language === 'hi' ? 'रसोई सुरक्षा' : 'Kitchen Safety', icon: <ShieldCheck className="w-4 h-4" /> },
    { tab: 'games', label: language === 'hi' ? 'गेम्स' : 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-orange-500/20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 flex items-center gap-1">
              Cook <span className="text-orange-500">Jr.</span>
            </div>
            <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest -mt-1">
              Smart Companion
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-stone-100/60 dark:bg-stone-800/60 p-1.5 rounded-2xl border border-stone-200/50 dark:border-stone-700/50">
          {navItems.map((item) => {
            const active = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/50 dark:hover:bg-stone-700/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User XP & Level Chip */}
          {user && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-bold text-stone-700 dark:text-stone-200 border border-orange-500/20">
              <div className="flex items-center gap-1 text-amber-500">
                <Trophy className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Lvl {user.level || 1}</span>
              </div>
              <div className="w-px h-3 bg-stone-300 dark:bg-stone-700" />
              <div className="flex items-center gap-1 text-orange-500">
                <Coins className="w-4 h-4 fill-orange-400" />
                <span>{user.coins || 0}</span>
              </div>
              <div className="w-px h-3 bg-stone-300 dark:bg-stone-700" />
              <div className="flex items-center gap-1 text-red-500" title="Daily Streak">
                <Zap className="w-4 h-4 fill-red-500" />
                <span>{user.streak || 1}d</span>
              </div>
            </div>
          )}

          {/* Saved Recipes Trigger */}
          <button
            onClick={onOpenSavedRecipes}
            className="p-2.5 rounded-xl btn-skeuo-secondary flex items-center justify-center text-stone-700 dark:text-stone-200 cursor-pointer"
            title="Saved Recipes"
          >
            <Bookmark className="w-5 h-5 text-orange-500" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-3 py-2 rounded-xl btn-skeuo-secondary flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Switch Language (English / Hindi)"
          >
            <Globe className="w-4 h-4 text-orange-500" />
            <span>{language === 'en' ? 'EN' : 'HI'}</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Button / User Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl btn-skeuo-secondary text-stone-500 hover:text-red-500 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-skeuo px-4 py-2 text-xs font-bold rounded-xl cursor-pointer"
            >
              Log In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl btn-skeuo-secondary text-stone-700 dark:text-stone-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 glass-panel border-t border-orange-500/20 bg-white/95 dark:bg-stone-900/95 space-y-2">
          {navItems.map((item) => {
            const active = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
