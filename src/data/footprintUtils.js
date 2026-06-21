import { ECO_ACTIONS } from './ecoActions.js';

export function computeActiveFootprint(base, actionsList, ecoActions = ECO_ACTIONS) {
  const reductions = { home: 0, travel: 0, diet: 0, consumption: 0 };
  const safeActions = Array.isArray(actionsList) ? actionsList : [];

  safeActions.forEach(actionId => {
    const action = ecoActions.find(a => a.id === actionId);
    if (action && Object.hasOwn(reductions, action.category)) {
      reductions[action.category] += action.carbonSavings;
    }
  });

  const home = Math.max(0, base.home - reductions.home);
  const travel = Math.max(0, base.travel - reductions.travel);
  const diet = Math.max(0, base.diet - reductions.diet);
  const consumption = Math.max(0, base.consumption - reductions.consumption);

  return {
    home,
    travel,
    diet,
    consumption,
    total: home + travel + diet + consumption
  };
}
