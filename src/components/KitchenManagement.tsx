import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Search, ChevronRight, X, Flame, AlertTriangle, BookOpen, Utensils, HeartHandshake, Thermometer, Layers, CheckCircle2 } from 'lucide-react';

interface SafetyCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  summary: string;
  keyRules: string[];
  proTip: string;
}

const safetyTopics: SafetyCard[] = [
  {
    id: 'hygiene',
    title: 'Kitchen Hygiene & Sanitization',
    subtitle: 'Preventing cross-contamination & foodborne bacteria',
    icon: '🧼',
    badge: 'Hygiene',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    summary: 'Essential handwashing protocols and raw meat isolation standards to keep your cooking zone sterile.',
    keyRules: [
      'Wash hands with soap & warm water for at least 20 seconds before & after handling food.',
      'Use separate color-coded cutting boards: Red for raw meats, Green for produce, Blue for seafood.',
      'Sanitize kitchen sponges daily by microwaving damp sponge for 1 minute or running through dishwasher.',
      'Never rinse raw chicken under tap water — it splashes bacteria up to 3 feet around sink!',
    ],
    proTip: 'Wipe countertops with 1 tsp bleach per quart water solution for a 100% food-safe disinfectant.',
  },
  {
    id: 'food-storage',
    title: 'Food Storage & Shelf-Life Rules',
    subtitle: 'Optimal fridge zones & FIFO pantry rotation',
    icon: '🧊',
    badge: 'Storage',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
    summary: 'Master refrigerator temperature zoning and airtight container practices to maximize food freshness.',
    keyRules: [
      'Maintain fridge temperature below 4°C (39°F) and freezer at -18°C (0°F).',
      'Store raw meat on the lowest fridge shelf inside leak-proof containers to prevent drip contamination.',
      'Follow FIFO (First-In, First-Out): Place newer groceries behind older items to reduce waste.',
      'Cool hot cooked food to room temperature within 2 hours before refrigerating to prevent mold growth.',
    ],
    proTip: 'Wrap herbs in damp paper towels and store in airtight glass jars for 3+ weeks of crisp freshness!',
  },
  {
    id: 'knife-safety',
    title: 'Knife Safety & Cutting Techniques',
    subtitle: 'The claw grip, proper grip & sharp blade control',
    icon: '🔪',
    badge: 'Safety',
    badgeColor: 'bg-red-500/10 text-red-600 border-red-500/30',
    summary: 'Professional blade handling methods that prevent slips and cut preparation time in half.',
    keyRules: [
      'Always use "The Claw Grip": Curl fingertips inward toward palm like a bear claw while holding produce.',
      'A sharp knife is safer than a dull knife — dull blades require excess force and slip easily.',
      'Anchor your cutting board by placing a damp cloth or silicone mat underneath to prevent movement.',
      'If a knife falls, step back and let it drop. Never try to catch a falling blade!',
    ],
    proTip: 'Hone your knife blade with a honing steel at a 20-degree angle before every major chopping session.',
  },
  {
    id: 'cleaning',
    title: 'Daily & Weekly Cleaning Routines',
    subtitle: 'Habitual station resetting & deep appliance care',
    icon: '🧹',
    badge: 'Routine',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    summary: 'Systematic clean-as-you-go methodology used by executive Michelin-star restaurant kitchen brigades.',
    keyRules: [
      'Practice "Clean-As-You-Go": Wipe prep stations during simmer times to leave a spotless kitchen at the end.',
      'Scrub sink basin with baking soda and dish soap nightly to prevent grease buildup.',
      'Soak hood exhaust filters in boiling water with baking soda monthly to eliminate trap grease fire hazard.',
      'Descale electric kettle and coffee maker using equal parts water and white vinegar monthly.',
    ],
    proTip: 'Keep a bench scraper at your board to scoop prep waste directly into compost in one second.',
  },
  {
    id: 'gas-safety',
    title: 'Gas & Fire Safety Checklist',
    subtitle: 'Valves, grease fire smothering & leak detection',
    icon: '🔥',
    badge: 'Critical',
    badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    summary: 'Crucial emergency protocol for gas stoves, regulator switches, and stovetop pan flare-ups.',
    keyRules: [
      'NEVER throw water on a grease fire! Water vaporizes instantly and explodes boiling oil everywhere.',
      'To extinguish a pan fire: Turn off burner, cover pan with a metal lid, or smother with baking soda.',
      'Turn off main gas cylinder regulator valve whenever leaving home or going to sleep.',
      'If you smell gas: Do NOT turn light switches on/off. Open windows immediately and turn off gas valve.',
    ],
    proTip: 'Keep a Class K / Multi-purpose ABC fire extinguisher within 10 feet of your cooking line.',
  },
  {
    id: 'utensil-care',
    title: 'Utensil & Cookware Care Guide',
    subtitle: 'Cast iron seasoning, non-stick & stainless steel',
    icon: '🍳',
    badge: 'Equipment',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    summary: 'Maintain cookware non-stick coatings, cast iron patina, and wooden spoon integrity for decades.',
    keyRules: [
      'Never put non-stick pans in dishwasher or use metal utensils — wooden or silicone spatulas only!',
      'Season cast iron skillets with thin coat of high-smoke oil (canola/grapeseed) after hot water rinse.',
      'Pre-heat stainless steel pans until water droplets form dancing beads ("Leidenfrost Effect") before adding oil.',
      'Oil wooden cutting boards & spoons monthly with food-grade mineral oil to prevent cracking.',
    ],
    proTip: 'Deglaze stuck brown bits (fond) in stainless steel with wine or broth to build instant pan sauces!',
  },
  {
    id: 'meal-prep',
    title: 'Meal-Prep Efficiency Hacks',
    subtitle: 'Batch cooking & smart portioning strategies',
    icon: '🍱',
    badge: 'Efficiency',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    summary: 'Save 5+ hours weekly by batching grain bases, pre-slicing aromatics, and flash-freezing portions.',
    keyRules: [
      'Cook grains (brown rice, quinoa) and legumes in bulk on Sunday for 5 days of instant meal assembly.',
      'Freeze fresh herbs in olive oil inside silicone ice cube trays for instant aromatic flavor starters.',
      'Store cut carrots & celery submerged in cold water jars in the fridge to keep them ultra-crisp.',
      'Use glass meal prep containers — they don’t stain from turmeric/tomato sauce and microwave safely.',
    ],
    proTip: 'Slice chicken breasts while semi-frozen (15 mins in freezer) for micro-thin restaurant cuts.',
  },
  {
    id: 'emergency',
    title: 'Kitchen Emergency First Aid Guide',
    subtitle: 'Minor burns, steam scalds & knife cuts',
    icon: '🚨',
    badge: 'Emergency',
    badgeColor: 'bg-red-600/10 text-red-600 border-red-600/30',
    summary: 'Immediate, clear steps to handle minor burns, scalds, and cuts before seeking medical attention.',
    keyRules: [
      'For minor First-Degree Burns: Hold under cool running tap water for 10-15 minutes immediately. Never apply ice directly!',
      'Never apply butter, oil, or toothpaste to burns — they trap heat in tissues and exacerbate damage.',
      'For minor cuts: Apply firm pressure with clean gauze or cloth for 5 minutes, elevate above heart, and apply bandage.',
      'Steam burns are hotter than boiling water — open pot lids away from your face to vent steam safely.',
    ],
    proTip: 'Keep a clean First-Aid kit mounted on the pantry wall stocked with burn gel and sterile gauze.',
  },
  {
    id: 'culinary-facts',
    title: 'Fun Culinary Science Facts',
    subtitle: 'The Maillard reaction, onions & taste science',
    icon: '💡',
    badge: 'Science',
    badgeColor: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    summary: 'Fascinating scientific principles behind why food browns, smells incredible, and tastes rich.',
    keyRules: [
      'The Maillard Reaction: Browning at 140°C-165°C creates over 600 complex new flavor compounds in steaks & bread.',
      'Why onions make you cry: Cutting releases syn-propanethial-S-oxide gas. Chill onions 30 mins prior to prevent it!',
      'Salt isn’t just salty: It suppresses bitterness and enhances natural sweetness in caramel and chocolate.',
      'Spicy heat is a pain signal: Capsaicin triggers pain receptors, causing brain to release pleasurable endorphins!',
    ],
    proTip: 'Add a pinch of baking soda when caramelizing onions to speed up browning in half the time!',
  },
  {
    id: 'books-chefs',
    title: 'Notable Books & Master Chefs',
    subtitle: 'Culinary classics & world-renowned masters',
    icon: '📚',
    badge: 'Inspiration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    summary: 'Essential reading list and iconic chefs who revolutionized gastronomy and home cooking worldwide.',
    keyRules: [
      'Salt, Fat, Acid, Heat by Samin Nosrat: The definitive guide to mastering the 4 elements of good cooking.',
      'Mastering the Art of French Cooking by Julia Child: Brought classic French technique into home kitchens.',
      'The Professional Chef by CIA: The bible used by culinary academy students around the world.',
      'Iconic Culinary Icons: Auguste Escoffier, Gordon Ramsay, Vikas Khanna, Sanjeev Kapoor, Alice Waters.',
    ],
    proTip: 'Read the entire recipe from start to finish BEFORE picking up your knife or lighting the burner!',
  },
];

export const KitchenManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<SafetyCard | null>(null);

  const filteredTopics = safetyTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()) ||
      t.badge.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Kitchen Management & Safety Guide</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50">
          Master Kitchen Safety & Hygiene
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
          Static informational library covering hygiene, knife handling, gas safety, food storage, cookware care, emergency first aid, and culinary facts.
        </p>
      </div>

      {/* Search Filter Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search safety topic (e.g. Knife, Gas, Burns, Storage)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl glass-panel border border-orange-500/30 text-sm focus:outline-none focus:border-orange-500 font-medium"
        />
      </div>

      {/* 10 Visually Distinct Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <motion.div
            key={topic.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedTopic(topic)}
            className="p-6 rounded-3xl glass-panel border border-orange-500/20 flex flex-col justify-between space-y-4 cursor-pointer hover:border-orange-500/50 transition-all shadow-lg bg-white/80 dark:bg-stone-900/80"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{topic.icon}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${topic.badgeColor}`}>
                  {topic.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-50">{topic.title}</h3>
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-0.5">{topic.subtitle}</p>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{topic.summary}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-orange-500 pt-2 border-t border-stone-200/50 dark:border-stone-800">
              <span>Read 4 Core Rules</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 bg-white/95 dark:bg-stone-900/95 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-stone-800 dark:text-stone-100"
            >
              <button
                onClick={() => setSelectedTopic(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedTopic.icon}</span>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${selectedTopic.badgeColor}`}>
                    {selectedTopic.badge}
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 mt-1">{selectedTopic.title}</h3>
                  <p className="text-xs text-stone-500 font-medium">{selectedTopic.subtitle}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                {selectedTopic.summary}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  4 Mandatory Guidelines:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {selectedTopic.keyRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-stone-700 dark:text-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                <div className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pro Tip</div>
                <p className="text-stone-800 dark:text-stone-200">{selectedTopic.proTip}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
