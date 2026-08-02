import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Sparkles, Flame, Droplet, Clock, Award, TrendingUp, CheckCircle, Plus, Activity, Zap, RefreshCw, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { GymPlan } from '../types';

interface GymSectionProps {
  language: 'en' | 'hi';
}

export const GymSection: React.FC<GymSectionProps> = ({ language }) => {
  const [activeSubTab, setActiveSubTab] = useState<'onboarding' | 'plan' | 'dashboard'>('plan');
  
  // Onboarding Form State
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<string>('Male');
  const [weight, setWeight] = useState<number>(72);
  const [height, setHeight] = useState<number>(178);
  const [fitnessGoal, setFitnessGoal] = useState<string>('Muscle Gain');
  const [vegPreference, setVegPreference] = useState<string>('Non-Vegetarian');
  const [activityLevel, setActivityLevel] = useState<string>('Moderate');
  const [gymDays, setGymDays] = useState<number>(4);

  const [loading, setLoading] = useState(false);
  const [gymPlan, setGymPlan] = useState<GymPlan | null>(null);

  // User Gym Data state for graph and logs
  const [gymData, setGymData] = useState<any>(null);
  const [newWeightInput, setNewWeightInput] = useState<string>('');
  const [todayGlasses, setTodayGlasses] = useState<number>(6); // Water glasses

  // Checkin Modal
  const [checkinAnswers, setCheckinAnswers] = useState<Record<number, string>>({});
  const [checkinFeedback, setCheckinFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchGymData();
  }, []);

  const fetchGymData = async () => {
    try {
      const res = await fetch('/api/user/gym-data');
      const json = await res.json();
      if (json.data) {
        setGymData(json.data);
        if (json.data.generatedPlan) {
          setGymPlan(json.data.generatedPlan);
        }
      }
    } catch (err) {
      console.error('Error fetching gym data:', err);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/gym-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          gender,
          weight,
          height,
          fitnessGoal,
          vegPreference,
          activityLevel,
          gymDays,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate gym plan');

      setGymPlan(data.plan);
      setActiveSubTab('plan');
      fetchGymData();
    } catch (err: any) {
      alert(err.message || 'Error generating fitness plan');
    } finally {
      setLoading(false);
    }
  };

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeightInput) return;
    try {
      const res = await fetch('/api/user/gym-log-weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weightKg: Number(newWeightInput) }),
      });
      const data = await res.json();
      if (res.ok) {
        setGymData(data.gymData);
        setNewWeightInput('');
        alert('Weight logged successfully!');
      }
    } catch (err) {
      alert('Could not log weight');
    }
  };

  const submitCheckin = () => {
    setCheckinFeedback('Great job checking in! AI recommends staying consistent with hydration and maintaining protein intake.');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Smart AI Fitness & Nutrition Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50">
          {language === 'hi' ? 'जिम और पोषण योजना' : 'Gym Diet, Workout & Progress Tracker'}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
          Tailored macro breakdown, workout meal timing, supplement guidance, and monthly progress report with interactive graphs.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 rounded-2xl glass-panel border border-orange-500/20 bg-stone-100/70 dark:bg-stone-800/70">
        <button
          onClick={() => setActiveSubTab('plan')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === 'plan' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>My AI Diet Plan</span>
        </button>
        <button
          onClick={() => setActiveSubTab('onboarding')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === 'onboarding' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Setup Profile</span>
        </button>
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === 'dashboard' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Monthly Report</span>
        </button>
      </div>

      {/* SUB-TAB 1: ONBOARDING FORM */}
      {activeSubTab === 'onboarding' && (
        <form onSubmit={handleGeneratePlan} className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-orange-500" />
            <span>Fitness Profile Onboarding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Fitness Goal</label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              >
                <option value="Muscle Gain">Muscle Gain / Hypertrophy</option>
                <option value="Fat Loss">Fat Loss & Toning</option>
                <option value="Body Recomposition">Body Recomposition</option>
                <option value="Athletic Performance">Athletic Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Dietary Preference</label>
              <select
                value={vegPreference}
                onChange={(e) => setVegPreference(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              >
                <option value="Vegetarian">Vegetarian (High Protein Veg)</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              >
                <option value="Sedentary">Sedentary (Desk Job)</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderate">Moderate (Active daily)</option>
                <option value="Very Active">Very Active (Heavy training)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Gym Days / Week</label>
              <input
                type="number"
                min="1"
                max="7"
                value={gymDays}
                onChange={(e) => setGymDays(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 btn-skeuo font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <span>AI is calculating your macros & diet...</span> : <span>Generate AI Fitness Diet Plan</span>}
          </button>
        </form>
      )}

      {/* SUB-TAB 2: AI FITNESS DIET PLAN VIEW */}
      {activeSubTab === 'plan' && (
        <div className="space-y-8">
          {!gymPlan ? (
            <div className="p-12 text-center rounded-3xl glass-panel space-y-4">
              <Dumbbell className="w-12 h-12 text-orange-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black">No Fitness Plan Created Yet</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                Fill out your fitness profile in the setup tab to unlock your customized macronutrient targets and workout support schedule!
              </p>
              <button onClick={() => setActiveSubTab('onboarding')} className="px-6 py-3 btn-skeuo font-bold text-sm cursor-pointer">
                Setup Fitness Profile Now
              </button>
            </div>
          ) : (
            <>
              {/* Summary Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Personalized Plan
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">{gymPlan.summary}</h3>
                <p className="text-xs sm:text-sm text-amber-100 font-medium">Target Calories: {gymPlan.dailyCalories} kcal / day</p>
              </div>

              {/* Infographics Grid: Macros & Water Target */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl glass-panel border border-orange-500/30 bg-white/80 dark:bg-stone-900/80">
                  <div className="text-xs font-extrabold text-stone-500 uppercase">Daily Protein Target</div>
                  <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">
                    {gymPlan.macros?.proteinGrams}g
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{ width: `${gymPlan.macros?.proteinPct || 35}%` }} />
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 font-semibold">{gymPlan.macros?.proteinPct || 35}% of total calories</div>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-white/80 dark:bg-stone-900/80">
                  <div className="text-xs font-extrabold text-stone-500 uppercase">Carbohydrates Target</div>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                    {gymPlan.macros?.carbsGrams}g
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${gymPlan.macros?.carbsPct || 45}%` }} />
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 font-semibold">{gymPlan.macros?.carbsPct || 45}% of total calories</div>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-white/80 dark:bg-stone-900/80">
                  <div className="text-xs font-extrabold text-stone-500 uppercase">Healthy Fats Target</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {gymPlan.macros?.fatGrams}g
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${gymPlan.macros?.fatPct || 20}%` }} />
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 font-semibold">{gymPlan.macros?.fatPct || 20}% of total calories</div>
                </div>

                {/* Interactive Water Bottle Tracker */}
                <div className="p-5 rounded-2xl glass-panel border border-blue-500/30 bg-blue-500/10 text-stone-800 dark:text-stone-100 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase flex items-center justify-between">
                      <span>Water Target</span>
                      <Droplet className="w-4 h-4 fill-blue-500 text-blue-500" />
                    </div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-300 mt-1">
                      {gymPlan.waterTargetLiters} Liters
                    </div>
                    <div className="text-xs font-semibold text-stone-500 mt-1">Logged Today: {todayGlasses * 0.25}L ({todayGlasses} glasses)</div>
                  </div>
                  <button
                    onClick={() => setTodayGlasses((g) => g + 1)}
                    className="mt-3 py-2 px-3 rounded-xl bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-600 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> +1 Glass (250ml)
                  </button>
                </div>
              </div>

              {/* Meal Timing Schedule Table */}
              <div className="p-6 rounded-3xl glass-panel border border-orange-500/30 space-y-4">
                <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>Meal Timing & Nutrition Schedule</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gymPlan.mealSchedule?.map((meal, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-orange-500">{meal.timeSlot}</span>
                        <span className="text-xs font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">
                          {meal.calories} kcal | {meal.proteinGrams}g Protein
                        </span>
                      </div>
                      <div className="text-sm font-black text-stone-900 dark:text-stone-100">{meal.mealName}</div>
                      <p className="text-xs text-stone-600 dark:text-stone-300">{meal.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplements Guidance */}
              {gymPlan.supplements && gymPlan.supplements.length > 0 && (
                <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-4">
                  <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Supplement Advice & Timing</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {gymPlan.supplements.map((supp, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                        <div className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">{supp.name}</div>
                        <div className="text-amber-600 dark:text-amber-400 font-bold">{supp.timing}</div>
                        <p className="text-stone-600 dark:text-stone-300">{supp.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Periodic Check-In Modal / Box */}
              <div className="p-6 rounded-3xl glass-panel border border-orange-500/30 space-y-4 bg-gradient-to-r from-orange-500/5 to-amber-500/5">
                <h4 className="text-lg font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span>AI Weekly Progress Check-in</span>
                </h4>

                <div className="space-y-3">
                  {gymPlan.checkinQuestions?.map((q, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300">{q}</label>
                      <input
                        type="text"
                        placeholder="Type your feedback (e.g. Energy is great, protein was hit!)"
                        value={checkinAnswers[idx] || ''}
                        onChange={(e) => setCheckinAnswers({ ...checkinAnswers, [idx]: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                      />
                    </div>
                  ))}

                  <button onClick={submitCheckin} className="px-5 py-2.5 btn-skeuo font-bold text-xs cursor-pointer">
                    Submit Check-In
                  </button>

                  {checkinFeedback && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      {checkinFeedback}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SUB-TAB 3: MONTHLY REPORT DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-orange-500/30 text-center">
              <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <div className="text-xs font-bold text-stone-400 uppercase">Current Weight</div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {gymData?.weightLogs?.[gymData.weightLogs.length - 1]?.weightKg || 71.0} kg
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 text-center">
              <Flame className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <div className="text-xs font-bold text-stone-400 uppercase">Avg Protein Intake</div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">122g / day</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 text-center">
              <Award className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <div className="text-xs font-bold text-stone-400 uppercase">Consistency Score</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92%</div>
            </div>
          </div>

          {/* Interactive Weight History Line Chart (Recharts) */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 space-y-4 bg-white/90 dark:bg-stone-900/90 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-50">Weight Progress Trend</h3>
                <p className="text-xs text-stone-500">Track your body weight trajectory over the past weeks</p>
              </div>

              {/* Log New Weight Form */}
              <form onSubmit={handleLogWeight} className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="New weight (kg)"
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800 text-xs w-32 focus:outline-none"
                />
                <button type="submit" className="px-3 py-1.5 btn-skeuo text-xs font-bold cursor-pointer">
                  Log Weight
                </button>
              </form>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gymData?.weightLogs || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#88888822" />
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f1e1d',
                      borderColor: '#f97316',
                      borderRadius: '0.75rem',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weightKg"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Unlocked Badges & Achievements */}
          <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-4">
            <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Unlocked Fitness Badges & Milestones</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                <div className="text-3xl">🔥</div>
                <div className="font-extrabold text-xs text-stone-800 dark:text-stone-100">Macro Master</div>
                <div className="text-[10px] text-amber-600">Hit protein 5 days in a row</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
                <div className="text-3xl">💧</div>
                <div className="font-extrabold text-xs text-stone-800 dark:text-stone-100">Hydration Hero</div>
                <div className="text-[10px] text-blue-600">Reached 3L water daily</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                <div className="text-3xl">🏋️‍♂️</div>
                <div className="font-extrabold text-xs text-stone-800 dark:text-stone-100">Gym Consistency</div>
                <div className="text-[10px] text-emerald-600">Completed 4 workout weeks</div>
              </div>
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center space-y-1">
                <div className="text-3xl">🥗</div>
                <div className="font-extrabold text-xs text-stone-800 dark:text-stone-100">Clean Eater</div>
                <div className="text-[10px] text-orange-600">Logged 20 clean meals</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
