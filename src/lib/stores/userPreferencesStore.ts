import { writable } from "svelte/store";

import { browser } from "$app/environment";

export type PeriodType = "1h" | "24h" | "7d" | "30d";

interface UserPreferences {
  tablePeriod: PeriodType;
}

const STORAGE_KEY = "buildscape_user_preferences";
const DEFAULT_PREFERENCES: UserPreferences = {
  tablePeriod: "24h",
};

function loadPreferences(): UserPreferences {
  if (!browser) return DEFAULT_PREFERENCES;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate and merge with defaults to handle missing fields
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
      };
    }
  } catch (error) {
    console.error("Failed to load user preferences:", error);
  }

  return DEFAULT_PREFERENCES;
}

function savePreferences(preferences: UserPreferences): void {
  if (!browser) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save user preferences:", error);
  }
}

function createUserPreferencesStore() {
  const { subscribe, update } = writable<UserPreferences>(loadPreferences());

  return {
    subscribe,

    setTablePeriod(period: PeriodType) {
      update((prefs) => {
        const updated = { ...prefs, tablePeriod: period };
        savePreferences(updated);
        return updated;
      });
    },

    getTablePeriod(): PeriodType {
      // For immediate access without subscription
      if (!browser) return DEFAULT_PREFERENCES.tablePeriod;

      const prefs = loadPreferences();
      return prefs.tablePeriod;
    },

    reset() {
      const defaults = DEFAULT_PREFERENCES;
      savePreferences(defaults);
      update(() => defaults);
    },
  };
}

export const userPreferencesStore = createUserPreferencesStore();
