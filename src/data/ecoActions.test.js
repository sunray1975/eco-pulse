import test from 'node:test';
import assert from 'node:assert/strict';
import { ECO_ACTIONS, queryEcoActions } from './ecoActions.js';

test('eco action catalogue has complete scoring metadata', () => {
  assert.ok(ECO_ACTIONS.length >= 20);

  ECO_ACTIONS.forEach(action => {
    assert.match(action.id, /^[a-z0-9_]+$/);
    assert.ok(action.title);
    assert.ok(action.description);
    assert.ok(['home', 'travel', 'diet', 'consumption'].includes(action.category));
    assert.ok(action.carbonSavings > 0);
    assert.ok(action.points > 0);
    assert.ok(Array.isArray(action.keywords));
    assert.ok(action.keywords.length > 0);
  });
});

test('queryEcoActions ranks relevant actions from title, category, and keywords', () => {
  const solar = queryEcoActions('solar rooftop electricity');
  const transit = queryEcoActions('bus metro commute');
  const diet = queryEcoActions('vegan food meat');

  assert.equal(solar[0].id, 'solar_install');
  assert.equal(transit[0].id, 'public_transit_commute');
  assert.ok(diet.some(action => action.id === 'plant_based_diet'));
});

test('queryEcoActions handles empty and short searches safely', () => {
  assert.deepEqual(queryEcoActions(''), []);
  assert.ok(queryEcoActions('ev').some(action => action.id === 'ev_transition'));
  assert.deepEqual(queryEcoActions(null), []);
});
