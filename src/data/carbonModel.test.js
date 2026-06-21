import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFootprint, getConversions, EMISSION_FACTORS, TARGETS } from './carbonModel.js';

const baselineProfile = {
  electricityMonthlyKwh: '150',
  lpgMonthlyCylinders: '1',
  hasSolar: false,
  solarMonthlyKwh: '0',
  carType: 'petrol',
  carWeeklyKm: '100',
  bikeType: 'petrol',
  bikeWeeklyKm: '50',
  busWeeklyKm: '20',
  metroWeeklyKm: '30',
  trainWeeklyKm: '10',
  domesticFlightsYearly: '2',
  intlFlightsYearly: '0',
  dietType: 'mediumMeat',
  consumptionLevel: 'moderate'
};

test('calculateFootprint returns category totals and a rounded total', () => {
  const result = calculateFootprint(baselineProfile);

  assert.deepEqual(Object.keys(result), ['home', 'travel', 'diet', 'consumption', 'total']);
  assert.equal(result.total, result.home + result.travel + result.diet + result.consumption);
  assert.ok(result.total > TARGETS.indiaAverage);
});

test('solar generation never creates a negative home footprint', () => {
  const result = calculateFootprint({
    ...baselineProfile,
    hasSolar: true,
    solarMonthlyKwh: '9999'
  });

  assert.equal(result.home, 0);
});

test('cleaner diet and lower consumption reduce footprint', () => {
  const highImpact = calculateFootprint({
    ...baselineProfile,
    dietType: 'heavyMeat',
    consumptionLevel: 'high'
  });
  const lowImpact = calculateFootprint({
    ...baselineProfile,
    dietType: 'vegan',
    consumptionLevel: 'low'
  });

  assert.ok(lowImpact.total < highImpact.total);
  assert.equal(highImpact.diet, EMISSION_FACTORS.diet.heavyMeat);
  assert.equal(lowImpact.consumption, EMISSION_FACTORS.consumption.low);
});

test('conversions produce relatable positive values for nonzero emissions', () => {
  const conversions = getConversions(2200);

  assert.ok(conversions.treesPerYear > 0);
  assert.ok(conversions.carKmSaved > 0);
  assert.ok(conversions.smartphonesCharged > conversions.treesPerYear);
});
