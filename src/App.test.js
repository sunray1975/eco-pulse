import test from 'node:test';
import assert from 'node:assert/strict';
import { computeActiveFootprint } from './data/footprintUtils.js';

const base = {
  home: 1000,
  travel: 2000,
  diet: 1500,
  consumption: 600,
  total: 5100
};

const actions = [
  { id: 'home_a', category: 'home', carbonSavings: 300 },
  { id: 'travel_a', category: 'travel', carbonSavings: 2500 },
  { id: 'diet_a', category: 'diet', carbonSavings: 250 },
  { id: 'bad_category', category: 'unknown', carbonSavings: 999 }
];

test('computeActiveFootprint subtracts committed action savings by category', () => {
  const active = computeActiveFootprint(base, ['home_a', 'diet_a'], actions);

  assert.equal(active.home, 700);
  assert.equal(active.travel, 2000);
  assert.equal(active.diet, 1250);
  assert.equal(active.consumption, 600);
  assert.equal(active.total, 4550);
});

test('computeActiveFootprint clamps category reductions at zero', () => {
  const active = computeActiveFootprint(base, ['travel_a'], actions);

  assert.equal(active.travel, 0);
  assert.equal(active.total, base.home + base.diet + base.consumption);
});

test('computeActiveFootprint ignores malformed or unknown action lists', () => {
  assert.deepEqual(computeActiveFootprint(base, null, actions), base);
  assert.deepEqual(computeActiveFootprint(base, ['missing', 'bad_category'], actions), base);
});
