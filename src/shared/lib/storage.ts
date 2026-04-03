export function readSessionValue<TValue>(key: string): TValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as TValue;
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

export function writeSessionValue<TValue>(key: string, value: TValue) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function clearSessionValue(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(key);
}

export function readLocalValue<TValue>(key: string): TValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as TValue;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function writeLocalValue<TValue>(key: string, value: TValue) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearLocalValue(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}
