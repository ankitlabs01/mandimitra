export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(`mandi_mitra_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage for key ${key}:`, e);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`mandi_mitra_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing to localStorage for key ${key}:`, e);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`mandi_mitra_${key}`);
  } catch (e) {
    console.warn(`Error removing localStorage for key ${key}:`, e);
  }
}
