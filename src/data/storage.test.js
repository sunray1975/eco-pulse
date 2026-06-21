import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearEcoPulseProfile,
  readStoredProfile,
  safeJsonParse,
  saveActionProgress,
  saveNewProfile,
  STORAGE_KEYS
} from './storage.js';

function createMemoryStorage() {
  const data = new Map();

  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
    has: key => data.has(key)
  };
}

test('safeJsonParse returns fallback for invalid JSON', () => {
  assert.deepEqual(safeJsonParse('{"ok":true}', {}), { ok: true });
  assert.deepEqual(safeJsonParse('{bad json', { ok: false }), { ok: false });
});

test('profile storage helpers persist only EcoPulse keys', () => {
  const storage = createMemoryStorage();
  const profile = { carType: 'electric', dietType: 'vegan' };

  saveNewProfile(profile, storage);
  saveActionProgress(['solar_install'], 150, storage);

  assert.deepEqual(readStoredProfile(storage), {
    profile,
    actions: ['solar_install'],
    points: 150
  });

  clearEcoPulseProfile(storage);
  Object.values(STORAGE_KEYS).forEach(key => assert.equal(storage.has(key), false));
});
