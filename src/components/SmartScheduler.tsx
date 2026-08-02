import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Sparkles, Clock, Utensils, Printer, Download, RefreshCw, ChefHat, CheckCircle } from 'lucide-react';
import { DaySchedule, MealSlot } from '../types';

interface SmartSchedulerProps {
  language: 'en' | 'hi';
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({ language }) => {
  const [breakfastTime, setBreakfastTime] = useState('08:30 AM');
  const [lunchTime, setLunchTime] = useState('01:30 PM');
  const [snacksTime, setSnacksTime] = useState('05:30 PM');
  const [dinnerTime, setDinnerTime] = useState('08:30 PM');
  const [foodItems, setFoodItems] = useState('Oats, Eggs, Chicken Salad, Paneer Tikka, Brown Rice, Fruit Bowl');
  const [durationWeeks, setDurationWeeks] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<DaySchedule[] | null>(null);

  const handleGenerateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/smart-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          breakfastTime,
          lunchTime,
          snacksTime,
          dinnerTime,
          foodItems,
          durationWeeks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Schedule generation failed');

      setScheduleData(data.schedule?.days || []);
    } catch (err: any) {
      alert(err.message || 'Error generating meal schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getMealBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'lunch':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
      case 'snacks':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'dinner':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30';
      default:
        return 'bg-stone-500/10 text-stone-600 border-stone-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 print:p-0 print:max-w-full">
      {/* Header */}
      <div className="text-center space-y-2 print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
          <Calendar className="w-3.5 h-3.5" />
          <span>AI Timetable Generator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50">
          {language === 'hi' ? 'स्मार्ट मील टाइमटेबल' : 'Smart Weekly Meal Timetable'}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
          Customize your daily meal times and preferences. AI builds a color-coded day × meal-time grid for balanced nutrition.
        </p>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleGenerateSchedule} className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6 print:hidden">
        
        {/* Custom Timings Grid */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-3">
            Custom Daily Meal Timings
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs font-semibold text-stone-500">Breakfast</span>
              <input
                type="text"
                value={breakfastTime}
                onChange={(e) => setBreakfastTime(e.target.value)}
                className="w-full p-2.5 mt-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-xs font-bold"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-500">Lunch</span>
              <input
                type="text"
                value={lunchTime}
                onChange={(e) => setLunchTime(e.target.value)}
                className="w-full p-2.5 mt-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-xs font-bold"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-500">Evening Snacks</span>
              <input
                type="text"
                value={snacksTime}
                onChange={(e) => setSnacksTime(e.target.value)}
                className="w-full p-2.5 mt-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-xs font-bold"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-500">Dinner</span>
              <input
                type="text"
                value={dinnerTime}
                onChange={(e) => setDinnerTime(e.target.value)}
                className="w-full p-2.5 mt-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Preferred Foods & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
              Preferred Foods / Dietary Notes
            </label>
            <textarea
              rows={2}
              value={foodItems}
              onChange={(e) => setFoodItems(e.target.value)}
              placeholder="e.g. Oats, Egg whites, Rajma Chawal, Grilled Salmon, Salad..."
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-xs font-medium focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
              Plan Duration
            </label>
            <select
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-bold focus:outline-none focus:border-orange-500"
            >
              <option value={1}>1 Week Plan (Repeats)</option>
              <option value={2}>2 Weeks Variety Plan</option>
              <option value={3}>3 Weeks Master Plan</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 btn-skeuo font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <ChefHat className="w-5 h-5 animate-spin" />
              <span>Building smart weekly meal grid...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Meal Timetable</span>
            </>
          )}
        </button>
      </form>

      {/* Timetable Display Grid */}
      {scheduleData && scheduleData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6 bg-white/95 dark:bg-stone-900/95 shadow-2xl"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50">Weekly Meal Timetable</h3>
              <p className="text-xs text-stone-500 font-medium">Color-coded daily meal grid ({durationWeeks} Week Duration)</p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl btn-skeuo-secondary text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-orange-500" />
                <span>Print Timetable</span>
              </button>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap gap-3 text-xs font-bold">
            <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Breakfast ({breakfastTime})
            </span>
            <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-500/20">
              Lunch ({lunchTime})
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Snacks ({snacksTime})
            </span>
            <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              Dinner ({dinnerTime})
            </span>
          </div>

          {/* Grid Layout (Day × Meal Slots) */}
          <div className="space-y-4">
            {scheduleData.map((dayObj, dIdx) => (
              <div
                key={dIdx}
                className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-3"
              >
                <div className="text-sm font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>{dayObj.day}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {dayObj.meals?.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1 ${getMealBadgeStyle(m.type)}`}
                    >
                      <div className="flex items-center justify-between font-extrabold">
                        <span>{m.type}</span>
                        <span className="text-[10px] opacity-80">{m.time}</span>
                      </div>
                      <div className="font-extrabold text-stone-900 dark:text-stone-100 text-sm leading-tight">
                        {m.title}
                      </div>
                      <div className="text-[10px] opacity-90 font-medium">
                        {m.calories} kcal • {m.prepNote}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
