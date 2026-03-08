const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

export function getCache<T>(key: string): T | null {
  const hit = memoryCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return hit.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs = 1000 * 60 * 15) {
  memoryCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}
