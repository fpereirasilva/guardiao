interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>()
  private readonly defaultTtl: number

  constructor(defaultTtlSeconds: number = 3600) {
    this.defaultTtl = defaultTtlSeconds * 1000
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = (ttlSeconds ?? this.defaultTtl / 1000) * 1000
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    })
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  get size(): number {
    return this.store.size
  }
}

export const cepCache = new MemoryCache(86400)     // CEPs: 24h
export const documentCache = new MemoryCache(3600)  // Documentos: 1h
