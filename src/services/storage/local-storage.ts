/**
 * Type-safe LocalStorage helper
 */

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      const item = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, item);
    } catch {
      // Ignore or log storage quota issues
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // Ignore
    }
  },
};
