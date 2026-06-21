/**
 * EcoPulse Sustainability Actions Database
 * All carbonSavings are in kg CO2e saved per year.
 */

export const ECO_ACTIONS = [
  // HOME CATEGORY
  {
    id: 'led_bulbs',
    title: 'Switch to LED Light Bulbs',
    description: 'Replace standard incandescent bulbs with energy-efficient LED bulbs.',
    category: 'home',
    carbonSavings: 90,
    difficulty: 'easy',
    cost: 'low',
    impact: 'medium',
    points: 15,
    tip: 'LEDs consume up to 85% less energy and last 25 times longer than regular light bulbs.',
    keywords: ['led', 'light', 'lighting', 'bulbs', 'electricity', 'energy saving', 'home power']
  },
  {
    id: 'unplug_standby',
    title: 'Unplug Standby Devices',
    description: 'Turn off power strips and unplug chargers, TVs, and computers when not in use.',
    category: 'home',
    carbonSavings: 120,
    difficulty: 'easy',
    cost: 'free',
    impact: 'medium',
    points: 20,
    tip: 'Idle devices (phantom load) account for up to 10% of household electricity bills.',
    keywords: ['standby', 'unplug', 'vampire', 'phantom', 'electricity', 'chargers', 'idle', 'turn off']
  },
  {
    id: 'ac_temp_24',
    title: 'Set AC Temperature to 24°C',
    description: 'Keep your air conditioner set at 24°C or higher instead of chilly settings like 18°C.',
    category: 'home',
    carbonSavings: 310,
    difficulty: 'easy',
    cost: 'free',
    impact: 'high',
    points: 25,
    tip: 'Every 1°C increase in AC temperature settings saves roughly 6% of the cooling electricity.',
    keywords: ['ac', 'air conditioner', 'cooling', 'temperature', 'summer', 'electricity', 'thermostat']
  },
  {
    id: 'solar_install',
    title: 'Install Solar Rooftop Panels',
    description: 'Generate clean energy by setting up rooftop solar PV panels.',
    category: 'home',
    carbonSavings: 1800,
    difficulty: 'hard',
    cost: 'high',
    impact: 'high',
    points: 150,
    tip: 'Rooftop solar can wipe out up to 90% of electricity bills and pays for itself in 4-5 years in India.',
    keywords: ['solar', 'rooftop', 'pv panel', 'clean energy', 'electricity', 'renewable', 'generation']
  },
  {
    id: 'star_appliances',
    title: 'Buy BEE 5-Star Appliances',
    description: 'Choose BEE 5-star rated energy-efficient refrigerators, ACs, and washing machines.',
    category: 'home',
    carbonSavings: 250,
    difficulty: 'medium',
    cost: 'high',
    impact: 'high',
    points: 40,
    tip: '5-star appliances save substantial energy over their lifetime compared to lower-rated models.',
    keywords: ['star rating', 'bee rating', 'appliance', 'fridge', 'refrigerator', 'efficient', 'washing machine']
  },
  {
    id: 'wash_cold',
    title: 'Wash Clothes in Cold Water',
    description: 'Use the cold water cycle for laundry instead of hot or warm water.',
    category: 'home',
    carbonSavings: 75,
    difficulty: 'easy',
    cost: 'free',
    impact: 'low',
    points: 15,
    tip: 'About 75% to 90% of a washing machine\'s energy is spent heating water. Cold washing protects fabrics too.',
    keywords: ['washing', 'laundry', 'clothes', 'water', 'cold water', 'hot water', 'heating']
  },

  // TRAVEL CATEGORY
  {
    id: 'carpool_weekly',
    title: 'Carpool once a week',
    description: 'Share your commute ride with colleagues or neighbors at least once a week.',
    category: 'travel',
    carbonSavings: 280,
    difficulty: 'easy',
    cost: 'free',
    impact: 'medium',
    points: 25,
    tip: 'Sharing a ride instantly cuts commuting carbon footprint by 50% for that day and splits fuel costs.',
    keywords: ['carpool', 'share ride', 'commuting', 'travel', 'driving', 'car sharing']
  },
  {
    id: 'public_transit_commute',
    title: 'Use Metro or Bus for Commute',
    description: 'Switch from driving a car or bike to using local metro or bus systems.',
    category: 'travel',
    carbonSavings: 1100,
    difficulty: 'medium',
    cost: 'low',
    impact: 'high',
    points: 50,
    tip: 'Public transit is one of the most effective ways to lower transport emissions and avoid traffic stress.',
    keywords: ['metro', 'bus', 'train', 'public transport', 'transit', 'commute', 'driving']
  },
  {
    id: 'ev_transition',
    title: 'Transition to Electric Vehicle',
    description: 'Upgrade your petrol/diesel car or scooter to an electric vehicle (EV).',
    category: 'travel',
    carbonSavings: 2200,
    difficulty: 'hard',
    cost: 'high',
    impact: 'high',
    points: 200,
    tip: 'Even on coal-heavy grids, EVs are significantly cleaner than internal combustion engines, and emission-free locally.',
    keywords: ['ev', 'electric vehicle', 'electric car', 'electric scooter', 'tesla', 'tata nexon', 'ola', 'ather']
  },
  {
    id: 'walk_short_trips',
    title: 'Walk or Cycle for Short Trips',
    description: 'Walk or ride a bicycle for trips under 2 km instead of driving.',
    category: 'travel',
    carbonSavings: 150,
    difficulty: 'easy',
    cost: 'free',
    impact: 'medium',
    points: 30,
    tip: 'Trips under 2km account for a large portion of vehicle wear and tear and high fuel burning.',
    keywords: ['walk', 'cycle', 'bicycle', 'short trips', 'groceries', 'local', 'running', 'active travel']
  },
  {
    id: 'eco_driving',
    title: 'Practice Eco-Driving',
    description: 'Avoid rapid acceleration, maintain correct tire pressure, and limit idling.',
    category: 'travel',
    carbonSavings: 180,
    difficulty: 'easy',
    cost: 'free',
    impact: 'medium',
    points: 20,
    tip: 'Aggressive driving can increase fuel consumption by 30%. Proper tire pressure improves fuel efficiency by 3%.',
    keywords: ['eco-driving', 'acceleration', 'tire pressure', 'idling', 'fuel efficiency', 'driving tips']
  },
  {
    id: 'reduce_flights',
    title: 'Reduce Domestic Flights by 1',
    description: 'Substitute one flight with train travel or a virtual meeting.',
    category: 'travel',
    carbonSavings: 250,
    difficulty: 'medium',
    cost: 'free',
    impact: 'high',
    points: 40,
    tip: 'A single flight produces more emissions than some people generate in a year. Train travel creates 85% less CO2e.',
    keywords: ['flight', 'airplane', 'travel', 'train journey', 'zoom', 'meeting', 'vacation', 'holiday']
  },

  // DIET CATEGORY
  {
    id: 'meatless_monday',
    title: 'Adopt Meatless Mondays',
    description: 'Go fully vegetarian or vegan for at least one day a week.',
    category: 'diet',
    carbonSavings: 240,
    difficulty: 'easy',
    cost: 'free',
    impact: 'medium',
    points: 25,
    tip: 'Skipping meat one day a week reduces your diet footprint by 15% and saves thousands of liters of water.',
    keywords: ['meatless monday', 'vegetarian', 'vegan', 'meat-free', 'plant based', 'diet', 'eating']
  },
  {
    id: 'plant_based_diet',
    title: 'Transition to Plant-Based Diet',
    description: 'Adopt a fully vegetarian or vegan diet as your primary eating style.',
    category: 'diet',
    carbonSavings: 850,
    difficulty: 'hard',
    cost: 'free',
    impact: 'high',
    points: 80,
    tip: 'Livestock farming produces vast amounts of methane. Going plant-based is the single biggest individual food action.',
    keywords: ['veganism', 'vegetarianism', 'plant-based', 'vegan diet', 'vegetarian diet', 'no meat', 'dairy-free']
  },
  {
    id: 'zero_food_waste',
    title: 'Zero Food Waste Goal',
    description: 'Plan meals, store food properly, and eat leftovers to eliminate food waste.',
    category: 'diet',
    carbonSavings: 380,
    difficulty: 'medium',
    cost: 'free',
    impact: 'high',
    points: 35,
    tip: 'One-third of all food produced globally is wasted. If food waste were a country, it would be the third-largest emitter.',
    keywords: ['food waste', 'leftovers', 'compost', 'meal planning', 'groceries', 'kitchen', 'fridge']
  },
  {
    id: 'local_seasonal',
    title: 'Eat Local and Seasonal Food',
    description: 'Purchase fresh produce grown locally and in-season to minimize transport distance.',
    category: 'diet',
    carbonSavings: 160,
    difficulty: 'easy',
    cost: 'free',
    impact: 'medium',
    points: 20,
    tip: 'Out-of-season produce often relies on high-energy greenhouses or air-freight transport (food miles).',
    keywords: ['local food', 'seasonal', 'organic', 'farmers market', 'food miles', 'grocery shopping']
  },
  {
    id: 'compost_scraps',
    title: 'Compost Organic Scraps',
    description: 'Set up a home composting bin for fruit peels, vegetable scraps, and coffee grounds.',
    category: 'diet',
    carbonSavings: 110,
    difficulty: 'medium',
    cost: 'low',
    impact: 'medium',
    points: 30,
    tip: 'Food in landfills decomposes anaerobically to produce toxic methane gas. Composting creates rich soil instead.',
    keywords: ['compost', 'organic waste', 'recycling', 'garbage', 'fertilizer', 'garden', 'wet waste']
  },

  // CONSUMPTION CATEGORY
  {
    id: 'buy_secondhand',
    title: 'Buy Secondhand First',
    description: 'Look for books, clothes, furniture, and electronics on pre-owned markets before buying new.',
    category: 'consumption',
    carbonSavings: 290,
    difficulty: 'easy',
    cost: 'free',
    impact: 'medium',
    points: 30,
    tip: 'Reusing extends product lifespans and completely avoids manufacturing, raw extraction, and shipping emissions.',
    keywords: ['secondhand', 'pre-owned', 'used', 'thrifting', 'olx', 'vintage', 'thrift', 'furniture']
  },
  {
    id: 'decline_single_use',
    title: 'Ban Single-Use Plastics',
    description: 'Always carry a reusable water bottle, coffee cup, and shopping bag with you.',
    category: 'consumption',
    carbonSavings: 60,
    difficulty: 'easy',
    cost: 'low',
    impact: 'low',
    points: 15,
    tip: 'Plastic is refined from crude oil. Carrying canvas bags and steel bottles stops this cycle and prevents landfill clutter.',
    keywords: ['plastic', 'single-use', 'bags', 'reusable', 'bottle', 'straws', 'cup', 'eco bag']
  },
  {
    id: 'repair_appliances',
    title: 'Repair Instead of Replacing',
    description: 'Fix torn clothes, repair shoes, and mend electronics rather than throwing them out.',
    category: 'consumption',
    carbonSavings: 210,
    difficulty: 'medium',
    cost: 'low',
    impact: 'medium',
    points: 35,
    tip: 'The "Right to Repair" helps extend the lifespan of electronics, saving massive amounts of mining and fabrication carbon.',
    keywords: ['repair', 'mend', 'fix', 'sewing', 'electronics repair', 'maintenance', 'circular economy']
  },
  {
    id: 'digital_minimalism',
    title: 'Adopt Digital Minimalism',
    description: 'Clean up cloud storage, delete old emails, and use devices longer.',
    category: 'consumption',
    carbonSavings: 45,
    difficulty: 'easy',
    cost: 'free',
    impact: 'low',
    points: 15,
    tip: 'Data centers consume massive electricity. Storing terabytes of unneeded photos/emails fuels server farms.',
    keywords: ['digital', 'emails', 'cloud storage', 'server', 'data center', 'minimalism', 'files']
  },
  {
    id: 'refurbished_tech',
    title: 'Buy Refurbished Electronics',
    description: 'Purchase certified refurbished smartphones or laptops instead of brand new devices.',
    category: 'consumption',
    carbonSavings: 350,
    difficulty: 'medium',
    cost: 'low',
    impact: 'high',
    points: 50,
    tip: 'Manufacturing a single laptop generates about 300kg CO2e. Refurbished tech saves ~80% of these startup emissions.',
    keywords: ['refurbished', 'laptop', 'smartphone', 'renewed', 'used tech', 'gadget', 'mining']
  }
];

/**
 * Perform a keyword-based semantic match search against actions
 */
export function queryEcoActions(queryText) {
  if (!queryText || typeof queryText !== 'string') return [];
  const normalizedQuery = queryText.toLowerCase().trim();
  const searchWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
  
  if (searchWords.length === 0) {
    // fallback search for short words
    return ECO_ACTIONS.filter(action => 
      action.title.toLowerCase().includes(normalizedQuery) ||
      action.category.toLowerCase().includes(normalizedQuery) ||
      action.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery))
    );
  }

  const results = ECO_ACTIONS.map(action => {
    let score = 0;
    
    searchWords.forEach(word => {
      // Direct matches
      if (action.title.toLowerCase().includes(word)) score += 10;
      if (action.description.toLowerCase().includes(word)) score += 5;
      if (action.category.toLowerCase() === word) score += 8;
      
      // Keyword matches
      const keywordMatches = action.keywords.filter(keyword => 
        keyword.includes(word) || word.includes(keyword)
      );
      score += keywordMatches.length * 6;
    });

    return { action, score };
  });

  // Filter actions with score > 0 and sort by score descending
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.action);
}
