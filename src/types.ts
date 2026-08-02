export type AppTab = 'landing' | 'dashboard' | 'custom-recipe' | 'ingredient-recipe' | 'gym' | 'scheduler' | 'kitchen-safety' | 'games';

export interface User {
  id: string;
  email: string;
  name: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  badges: string[];
}

export interface RecipeStep {
  stepNumber: number;
  text: string;
  timerMinutes?: number;
}

export interface Recipe {
  id?: string;
  title: string;
  tagline?: string;
  prepTime: string;
  cookTime: string;
  totalTime?: string;
  servings?: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  difficulty?: string;
  ingredients: string[];
  steps: RecipeStep[];
  shoppingList: string[];
  chefTip?: string;
  isVeg?: boolean;
  cuisine?: string;
  savedAt?: string;
}

export interface IngredientRecipe {
  title: string;
  category: string;
  prepTime: string;
  cookTime: string;
  calories: number;
  difficulty: string;
  matchedIngredients: string[];
  extraPantryNeeded: string[];
  steps: RecipeStep[];
  proTips: {
    tasteEnhancement: string;
    storageIdeas: string;
    substitutions: string;
  };
}

export interface GymPlan {
  summary: string;
  dailyCalories: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    proteinPct?: number;
    carbsPct?: number;
    fatPct?: number;
  };
  waterTargetLiters: number;
  mealSchedule: {
    timeSlot: string;
    mealName: string;
    calories: number;
    proteinGrams: number;
    description: string;
    keyBenefits?: string;
  }[];
  workoutNutritionSupport?: {
    preWorkout: string;
    postWorkout: string;
    hydrationStrategy: string;
  };
  supplements?: {
    name: string;
    timing: string;
    purpose: string;
  }[];
  checkinQuestions: string[];
}

export interface MealSlot {
  type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  title: string;
  time: string;
  calories: number;
  prepNote: string;
}

export interface DaySchedule {
  day: string;
  meals: MealSlot[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
