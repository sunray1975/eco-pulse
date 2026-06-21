import test from 'node:test';
import assert from 'node:assert/strict';
import { getLevel } from './levels.js';

test('getLevel returns correct labels and progress bands', () => {
  assert.equal(getLevel(0).label, 'Lvl 1 Eco Seed');
  assert.equal(getLevel(100).label, 'Lvl 2 Green Sprout');
  assert.equal(getLevel(600).shortName, 'Green Guardian');
  assert.equal(getLevel(1200).label, 'Lvl 5 Climate Hero');
});

test('getLevel clamps next-level values for top tier and invalid input', () => {
  assert.equal(getLevel(2500).xpToNext, 0);
  assert.equal(getLevel(Number.NaN).label, 'Lvl 1 Eco Seed');
  assert.ok(getLevel(450).xpPercent > 0);
});
