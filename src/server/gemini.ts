import { GoogleGenAI, Type } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variables.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface CustomRecipeRequest {
  isVeg: boolean;
  cuisine: string;
  tastePriority: string;
  keyword: string;
}

export async function generateCustomRecipe(req: CustomRecipeRequest) {
  const ai = getAIClient();
  const prompt = `Create a detailed, delicious recipe based on the following preferences:
- Dietary Preference: ${req.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
- Cuisine Type: ${req.cuisine}
- Taste Priority / Flavor Profile: ${req.tastePriority}
- Recipe Keyword / Dish Name: ${req.keyword || 'Chef Special'}

Generate a structured JSON response with precise measurements, step-by-step cooking instructions with estimated time in minutes per step, calorie counts, macronutrients, and a complete categorized shopping list.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      systemInstruction:
        'You are an expert culinary master and nutritionist at Cook Jr. Generate child-friendly, clear, foolproof recipes with exact nutritional breakdown and step-by-step guidance.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Dish name' },
          tagline: { type: Type.STRING, description: 'Catchy short description' },
          prepTime: { type: Type.STRING, description: 'e.g. 15 mins' },
          cookTime: { type: Type.STRING, description: 'e.g. 25 mins' },
          totalTime: { type: Type.STRING, description: 'e.g. 40 mins' },
          servings: { type: Type.INTEGER, description: 'Number of servings' },
          calories: { type: Type.INTEGER, description: 'Total calories per serving' },
          protein: { type: Type.STRING, description: 'Protein e.g. 24g' },
          carbs: { type: Type.STRING, description: 'Carbs e.g. 45g' },
          fat: { type: Type.STRING, description: 'Fat e.g. 12g' },
          difficulty: { type: Type.STRING, description: 'Easy, Medium, or Hard' },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of ingredients with quantities',
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                text: { type: Type.STRING },
                timerMinutes: { type: Type.INTEGER, description: 'Timer in minutes if applicable (or 0)' },
              },
              required: ['stepNumber', 'text'],
            },
          },
          shoppingList: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Categorized items to buy e.g. Produce, Dairy, Spices',
          },
          chefTip: { type: Type.STRING, description: 'Pro secret tip for extra flavor' },
        },
        required: [
          'title',
          'prepTime',
          'cookTime',
          'calories',
          'protein',
          'carbs',
          'fat',
          'ingredients',
          'steps',
          'shoppingList',
        ],
      },
    },
  });

  const text = response.text || '{}';
  return JSON.parse(text);
}

export async function generateRecipeFromIngredients(ingredients: string[]) {
  const ai = getAIClient();
  const prompt = `Available ingredients in pantry: ${ingredients.join(', ')}.
Generate 3 distinct, practical, and creative recipe alternatives that maximize these ingredients.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      systemInstruction:
        'You are an inventive zero-waste chef at Cook Jr. Provide 3 unique recipes with steps and mandatory tips for taste enhancement, storage ideas, and ingredient substitutions.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING, description: 'e.g. Quick Meal, Gourmet, Comfort Food' },
                prepTime: { type: Type.STRING },
                cookTime: { type: Type.STRING },
                calories: { type: Type.INTEGER },
                difficulty: { type: Type.STRING },
                matchedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                extraPantryNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      text: { type: Type.STRING },
                      timerMinutes: { type: Type.INTEGER },
                    },
                  },
                },
                proTips: {
                  type: Type.OBJECT,
                  properties: {
                    tasteEnhancement: { type: Type.STRING, description: 'How to make it taste incredible' },
                    storageIdeas: { type: Type.STRING, description: 'How to store leftovers' },
                    substitutions: { type: Type.STRING, description: 'Swaps if missing an item' },
                  },
                  required: ['tasteEnhancement', 'storageIdeas', 'substitutions'],
                },
              },
              required: ['title', 'prepTime', 'cookTime', 'calories', 'steps', 'proTips'],
            },
          },
        },
      },
    },
  });

  const text = response.text || '{"recipes":[]}';
  return JSON.parse(text);
}

export interface GymOnboardingRequest {
  age: number;
  gender: string;
  weight: number;
  height: number;
  fitnessGoal: string;
  vegPreference: string;
  activityLevel: string;
  gymDays: number;
}

export async function generateGymPlan(req: GymOnboardingRequest) {
  const ai = getAIClient();
  const prompt = `Generate a customized fitness diet & workout nutrition plan for:
- Age: ${req.age}, Gender: ${req.gender}
- Weight: ${req.weight} kg, Height: ${req.height} cm
- Fitness Goal: ${req.fitnessGoal}
- Dietary Preference: ${req.vegPreference}
- Activity Level: ${req.activityLevel}
- Gym Training Frequency: ${req.gymDays} days/week

Produce exact daily calorie target, protein/carbs/fat macronutrient breakdown, daily water intake goal in Liters, a meal timing schedule (Breakfast, Pre-workout, Post-workout, Lunch, Evening Snack, Dinner), workout nutrition advice, supplement recommendations if appropriate, and 3 periodic check-in questions for progress monitoring.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      systemInstruction:
        'You are an elite sports nutritionist and fitness chef at Cook Jr. Create actionable, science-based, delicious meal plans tailored to athletic goals.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'Motivational summary' },
          dailyCalories: { type: Type.INTEGER },
          macros: {
            type: Type.OBJECT,
            properties: {
              proteinGrams: { type: Type.INTEGER },
              carbsGrams: { type: Type.INTEGER },
              fatGrams: { type: Type.INTEGER },
              proteinPct: { type: Type.INTEGER },
              carbsPct: { type: Type.INTEGER },
              fatPct: { type: Type.INTEGER },
            },
            required: ['proteinGrams', 'carbsGrams', 'fatGrams'],
          },
          waterTargetLiters: { type: Type.NUMBER },
          mealSchedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeSlot: { type: Type.STRING, description: 'e.g. 8:00 AM - Breakfast' },
                mealName: { type: Type.STRING },
                calories: { type: Type.INTEGER },
                proteinGrams: { type: Type.INTEGER },
                description: { type: Type.STRING },
                keyBenefits: { type: Type.STRING },
              },
            },
          },
          workoutNutritionSupport: {
            type: Type.OBJECT,
            properties: {
              preWorkout: { type: Type.STRING },
              postWorkout: { type: Type.STRING },
              hydrationStrategy: { type: Type.STRING },
            },
          },
          supplements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                timing: { type: Type.STRING },
                purpose: { type: Type.STRING },
              },
            },
          },
          checkinQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['summary', 'dailyCalories', 'macros', 'waterTargetLiters', 'mealSchedule', 'checkinQuestions'],
      },
    },
  });

  const text = response.text || '{}';
  return JSON.parse(text);
}

export interface SmartScheduleRequest {
  breakfastTime: string;
  lunchTime: string;
  snacksTime: string;
  dinnerTime: string;
  foodItems: string;
  durationWeeks: number;
}

export async function generateSmartSchedule(req: SmartScheduleRequest) {
  const ai = getAIClient();
  const prompt = `Create a smart meal timetable for a ${req.durationWeeks}-week plan with exact timings:
Breakfast at ${req.breakfastTime}, Lunch at ${req.lunchTime}, Evening Snacks at ${req.snacksTime}, Dinner at ${req.dinnerTime}.
Favorite food items / dietary notes: ${req.foodItems || 'Balanced wholesome meals'}.
Generate a color-coded 7-day schedule (Monday to Sunday) containing meals for each time slot with calorie counts and prep notes.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are a master kitchen planner. Return structured weekly meal grids.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: 'e.g. Monday' },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: 'Breakfast, Lunch, Snacks, or Dinner' },
                      title: { type: Type.STRING },
                      time: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      prepNote: { type: Type.STRING },
                    },
                    required: ['type', 'title', 'time', 'calories'],
                  },
                },
              },
              required: ['day', 'meals'],
            },
          },
        },
      },
    },
  });

  const text = response.text || '{"days":[]}';
  return JSON.parse(text);
}

export async function generateChefChatResponse(messages: { role: 'user' | 'assistant'; content: string }[], language: 'en' | 'hi' = 'en') {
  const ai = getAIClient();
  const langPrompt =
    language === 'hi'
      ? 'Respond in clear, friendly Hindi (using Devanagari script or clean easy Hindi/Hinglish if requested) for culinary help.'
      : 'Respond in clear, encouraging English for kitchen and culinary help.';

  const formattedHistory = messages.map((m) => `${m.role === 'user' ? 'User' : 'Chef Jr'}: ${m.content}`).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: `Conversation history:\n${formattedHistory}\n\nProvide the next response from Chef Jr.`,
    config: {
      systemInstruction: `You are "Chef Jr.", a world-class, friendly 3D animated master chef mascot for Cook Jr.
You STRICTLY assist with cooking, recipes, kitchen safety, ingredient swaps, timing fixes, and nutrition.
Rules:
- Keep responses CONCISE, MINIMAL, and EASY TO READ.
- Use short bullet points or numbered steps.
- NEVER output long dense paragraphs.
- ${langPrompt}`,
      temperature: 0.7,
    },
  });

  return response.text || 'Bonjour! How can I help you in the kitchen today?';
}
