import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveDate?: string;
  badges: string[];
}

export interface SavedRecipe {
  id: string;
  userId: string;
  title: string;
  cuisine: string;
  isVeg: boolean;
  prepTime: string;
  cookTime: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  steps: { stepNumber: number; text: string; timerMinutes?: number }[];
  shoppingList: string[];
  savedAt: string;
}

export interface GymData {
  userId: string;
  onboardingProfile?: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    fitnessGoal: string;
    vegPreference: string;
    activityLevel: string;
    gymDays: number;
  };
  generatedPlan?: any;
  weightLogs: { date: string; weightKg: number }[];
  dailyLogs: { date: string; proteinGrams: number; waterLiters: number; completedWorkout: boolean }[];
  checkins: { date: string; question: string; answer: string; feedback?: string }[];
}

export interface UserSchedule {
  id: string;
  userId: string;
  durationWeeks: number;
  timing: { breakfast: string; lunch: string; snacks: string; dinner: string };
  grid: { day: string; meals: { type: string; title: string; time: string; calories: number; prepNote: string }[] }[];
  createdAt: string;
}

export interface DBData {
  users: User[];
  recipes: SavedRecipe[];
  gymData: Record<string, GymData>;
  schedules: UserSchedule[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultData: DBData = {
  users: [
    {
      id: 'demo-user-1',
      email: 'demo@cookjr.com',
      name: 'Chef Junior',
      passwordHash: '$2a$10$e7I1Jb7d6vI0dJqgZ0J2.e.m8pQ.5J8P6F1g0K.2N.8P2M8P2M8P2', // hashed password "cookjr123"
      createdAt: new Date().toISOString(),
      xp: 250,
      level: 2,
      coins: 120,
      streak: 3,
      badges: ['First Dish Cooked', 'Quiz Novice', 'Kitchen Rush Champ'],
    },
  ],
  recipes: [],
  gymData: {},
  schedules: [],
};

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readDB(): DBData {
  try {
    ensureDir();
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB file, using fallback in-memory state:', err);
    return defaultData;
  }
}

export function writeDB(data: DBData): void {
  try {
    ensureDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}
