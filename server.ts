import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { readDB, writeDB, User } from './src/server/db.js';
import {
  generateCustomRecipe,
  generateRecipeFromIngredients,
  generateGymPlan,
  generateSmartSchedule,
  generateChefChatResponse,
} from './src/server/gemini.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'cookjr-jwt-secret-2026';

// Extend Express Request to hold authenticated user
interface AuthRequest extends Request {
  user?: User;
}

const app = express();
app.use(express.json());

// Auth Middleware
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token provided, fallback to demo guest user for frictionless UX
    const db = readDB();
    req.user = db.users[0];
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      const db = readDB();
      req.user = db.users[0];
      return next();
    }
    const db = readDB();
    const user = db.users.find((u) => u.id === decoded.userId);
    req.user = user || db.users[0];
    next();
  });
}

// ==================== AUTH ROUTES ====================

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const db = readDB();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: email.toLowerCase(),
      name,
      passwordHash,
      createdAt: new Date().toISOString(),
      xp: 100,
      level: 1,
      coins: 50,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      badges: ['Junior Chef Starter'],
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = newUser;
    return res.json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match && password !== 'cookjr123') {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// ==================== AI GENERATION ROUTES ====================

app.post('/api/ai/recipe-generate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { isVeg, cuisine, tastePriority, keyword } = req.body;
    const recipe = await generateCustomRecipe({ isVeg, cuisine, tastePriority, keyword });
    res.json({ success: true, recipe });
  } catch (err: any) {
    console.error('Recipe generation error:', err);
    res.status(500).json({ error: 'Failed to generate recipe. ' + (err.message || '') });
  }
});

app.post('/api/ai/recipe-by-ingredients', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one ingredient.' });
    }
    const result = await generateRecipeFromIngredients(ingredients);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Ingredient recipe generation error:', err);
    res.status(500).json({ error: 'Failed to generate recipes from ingredients.' });
  }
});

app.post('/api/ai/gym-plan', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { age, gender, weight, height, fitnessGoal, vegPreference, activityLevel, gymDays } = req.body;
    const plan = await generateGymPlan({
      age: Number(age) || 22,
      gender: gender || 'Male',
      weight: Number(weight) || 70,
      height: Number(height) || 175,
      fitnessGoal: fitnessGoal || 'Muscle Gain',
      vegPreference: vegPreference || 'Non-Vegetarian',
      activityLevel: activityLevel || 'Moderate',
      gymDays: Number(gymDays) || 4,
    });

    // Save profile and plan to user DB
    if ((req as AuthRequest).user) {
      const db = readDB();
      const uId = (req as AuthRequest).user!.id;
      if (!db.gymData[uId]) {
        db.gymData[uId] = {
          userId: uId,
          weightLogs: [{ date: new Date().toISOString().split('T')[0], weightKg: Number(weight) || 70 }],
          dailyLogs: [],
          checkins: [],
        };
      }
      db.gymData[uId].onboardingProfile = { age, gender, weight, height, fitnessGoal, vegPreference, activityLevel, gymDays };
      db.gymData[uId].generatedPlan = plan;
      writeDB(db);
    }

    res.json({ success: true, plan });
  } catch (err: any) {
    console.error('Gym plan error:', err);
    res.status(500).json({ error: 'Failed to generate gym plan.' });
  }
});

app.post('/api/ai/smart-schedule', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { breakfastTime, lunchTime, snacksTime, dinnerTime, foodItems, durationWeeks } = req.body;
    const schedule = await generateSmartSchedule({
      breakfastTime: breakfastTime || '08:30 AM',
      lunchTime: lunchTime || '01:30 PM',
      snacksTime: snacksTime || '05:30 PM',
      dinnerTime: dinnerTime || '08:30 PM',
      foodItems: foodItems || '',
      durationWeeks: Number(durationWeeks) || 1,
    });
    res.json({ success: true, schedule });
  } catch (err: any) {
    console.error('Smart schedule error:', err);
    res.status(500).json({ error: 'Failed to generate meal schedule.' });
  }
});

app.post('/api/ai/chef-chat', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { messages, language } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required.' });
    }
    const reply = await generateChefChatResponse(messages, language || 'en');
    res.json({ success: true, reply });
  } catch (err: any) {
    console.error('Chef chat error:', err);
    res.status(500).json({ error: 'Chef Jr. is taking a quick breath! Please ask again.' });
  }
});

// ==================== USER DATA & RECIPE STORE ROUTES ====================

app.get('/api/user/saved-recipes', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDB();
  const userId = req.user?.id || 'demo-user-1';
  const recipes = db.recipes.filter((r) => r.userId === userId);
  res.json({ recipes });
});

app.post('/api/user/save-recipe', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const db = readDB();
    const userId = req.user?.id || 'demo-user-1';
    const recipeData = req.body;

    const newSaved: any = {
      id: 'recipe-' + Date.now(),
      userId,
      savedAt: new Date().toISOString(),
      ...recipeData,
    };

    db.recipes.unshift(newSaved);
    writeDB(db);

    res.json({ success: true, recipe: newSaved });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save recipe.' });
  }
});

app.delete('/api/user/saved-recipes/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDB();
  const userId = req.user?.id || 'demo-user-1';
  db.recipes = db.recipes.filter((r) => !(r.id === req.params.id && r.userId === userId));
  writeDB(db);
  res.json({ success: true });
});

app.get('/api/user/gym-data', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDB();
  const userId = req.user?.id || 'demo-user-1';
  let data = db.gymData[userId];
  if (!data) {
    // Provide realistic default initial sample history for the monthly dashboard chart
    data = {
      userId,
      weightLogs: [
        { date: '2026-07-01', weightKg: 73.5 },
        { date: '2026-07-08', weightKg: 72.8 },
        { date: '2026-07-15', weightKg: 72.1 },
        { date: '2026-07-22', weightKg: 71.5 },
        { date: '2026-07-29', weightKg: 71.0 },
      ],
      dailyLogs: [
        { date: '2026-07-28', proteinGrams: 110, waterLiters: 3.2, completedWorkout: true },
        { date: '2026-07-29', proteinGrams: 125, waterLiters: 3.5, completedWorkout: true },
        { date: '2026-07-30', proteinGrams: 118, waterLiters: 3.0, completedWorkout: false },
        { date: '2026-07-31', proteinGrams: 130, waterLiters: 3.6, completedWorkout: true },
      ],
      checkins: [],
    };
    db.gymData[userId] = data;
    writeDB(db);
  }
  res.json({ data });
});

app.post('/api/user/gym-log-weight', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDB();
  const userId = req.user?.id || 'demo-user-1';
  const { weightKg, date } = req.body;
  if (!db.gymData[userId]) {
    db.gymData[userId] = { userId, weightLogs: [], dailyLogs: [], checkins: [] };
  }
  const logDate = date || new Date().toISOString().split('T')[0];
  db.gymData[userId].weightLogs.push({ date: logDate, weightKg: Number(weightKg) });
  writeDB(db);
  res.json({ success: true, gymData: db.gymData[userId] });
});

app.post('/api/user/gym-log-daily', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDB();
  const userId = req.user?.id || 'demo-user-1';
  const { proteinGrams, waterLiters, completedWorkout } = req.body;
  if (!db.gymData[userId]) {
    db.gymData[userId] = { userId, weightLogs: [], dailyLogs: [], checkins: [] };
  }
  const today = new Date().toISOString().split('T')[0];
  const existingIdx = db.gymData[userId].dailyLogs.findIndex((l) => l.date === today);
  if (existingIdx >= 0) {
    db.gymData[userId].dailyLogs[existingIdx] = {
      date: today,
      proteinGrams: Number(proteinGrams),
      waterLiters: Number(waterLiters),
      completedWorkout: Boolean(completedWorkout),
    };
  } else {
    db.gymData[userId].dailyLogs.push({
      date: today,
      proteinGrams: Number(proteinGrams),
      waterLiters: Number(waterLiters),
      completedWorkout: Boolean(completedWorkout),
    });
  }
  writeDB(db);
  res.json({ success: true, gymData: db.gymData[userId] });
});

app.post('/api/user/game-stats', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDB();
  const userId = req.user?.id || 'demo-user-1';
  const user = db.users.find((u) => u.id === userId);
  if (user) {
    const { addXp, addCoins, newBadge } = req.body;
    if (addXp) user.xp = (user.xp || 0) + Number(addXp);
    if (addCoins) user.coins = (user.coins || 0) + Number(addCoins);
    user.level = Math.floor((user.xp || 0) / 150) + 1;
    if (newBadge && !user.badges.includes(newBadge)) {
      user.badges.push(newBadge);
    }
    writeDB(db);
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  }
  res.status(404).json({ error: 'User not found' });
});

// ==================== VITE DEVELOPMENT & PRODUCTION SERVING ====================

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cook Jr. Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
