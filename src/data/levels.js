export const LEVELS = [
  { min: 1000, label: 'Lvl 5 Climate Hero', shortName: 'Climate Hero', lvl: 5, xpMax: 2000 },
  { min: 600, label: 'Lvl 4 Green Guardian', shortName: 'Green Guardian', lvl: 4, xpMax: 1000 },
  { min: 300, label: 'Lvl 3 Active Sapling', shortName: 'Active Sapling', lvl: 3, xpMax: 600 },
  { min: 100, label: 'Lvl 2 Green Sprout', shortName: 'Green Sprout', lvl: 2, xpMax: 300 },
  { min: 0, label: 'Lvl 1 Eco Seed', shortName: 'Eco Seed', lvl: 1, xpMax: 100 }
];

export function getLevel(points) {
  const safePoints = Number.isFinite(points) ? points : 0;
  const level = LEVELS.find(item => safePoints >= item.min) || LEVELS.at(-1);

  return {
    ...level,
    xpMin: level.min,
    currentLevelXp: safePoints - level.min,
    xpToNext: Math.max(0, level.xpMax - safePoints),
    xpPercent: Math.min(100, ((safePoints - level.min) / (level.xpMax - level.min)) * 100)
  };
}
