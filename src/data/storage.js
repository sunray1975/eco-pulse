export const STORAGE_KEYS = {
  onboarded: 'ecopulse_onboarded',
  profile: 'ecopulse_profile',
  loggedActions: 'ecopulse_logged_actions',
  points: 'ecopulse_points'
};

const ALL_STORAGE_KEYS = Object.values(STORAGE_KEYS);

export function safeJsonParse(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function readStoredProfile(storage = localStorage) {
  const savedOnboarded = storage.getItem(STORAGE_KEYS.onboarded);
  const savedProfile = safeJsonParse(storage.getItem(STORAGE_KEYS.profile), null);
  const savedActions = safeJsonParse(storage.getItem(STORAGE_KEYS.loggedActions), []);
  const savedPoints = Number.parseInt(storage.getItem(STORAGE_KEYS.points) || '0', 10);

  if (savedOnboarded !== 'true' || !savedProfile) return null;

  return {
    profile: savedProfile,
    actions: Array.isArray(savedActions) ? savedActions : [],
    points: Number.isFinite(savedPoints) && savedPoints > 0 ? savedPoints : 0
  };
}

export function saveNewProfile(profile, storage = localStorage) {
  storage.setItem(STORAGE_KEYS.onboarded, 'true');
  storage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  storage.setItem(STORAGE_KEYS.loggedActions, JSON.stringify([]));
  storage.setItem(STORAGE_KEYS.points, '0');
}

export function saveActionProgress(actions, points, storage = localStorage) {
  storage.setItem(STORAGE_KEYS.loggedActions, JSON.stringify(actions));
  storage.setItem(STORAGE_KEYS.points, points.toString());
}

export function clearEcoPulseProfile(storage = localStorage) {
  ALL_STORAGE_KEYS.forEach(key => storage.removeItem(key));
}
