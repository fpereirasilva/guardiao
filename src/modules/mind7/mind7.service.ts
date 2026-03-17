import { MemoryCache } from '../../shared/cache/index.js'
import { ServiceError, NotFoundError } from '../../shared/errors/index.js'

const cache = new MemoryCache(5 * 60 * 1000) // 5 min cache

function getBaseUrl(): string {
  return process.env.MIND7_API_URL || 'http://localhost:3001'
}

export interface Mind7Equipment {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  description?: string
  website?: string
  phone_number?: string
  category_id?: string
  category?: { id: string; name: string; description?: string }
  types?: { id: string; name: string; description?: string }[]
}

export interface Mind7Category {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Mind7Type {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Mind7Review {
  user_id: string
  equipment_id: string
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}

export interface Mind7SearchResult {
  results: Mind7Equipment[]
  total: number
  searchTerm?: string
}

export interface Mind7AdvancedSearchParams {
  text?: string
  category?: string
  location?: { lat: number; lng: number }
  radius?: number
  limit?: number
  offset?: number
  full?: boolean
}

async function mind7Fetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getBaseUrl()
  const url = `${base}${path}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!res.ok) {
      const body = await res.text()
      throw new ServiceError(`Mind7 API error: ${res.status} - ${body}`, 'mind7')
    }

    return await res.json() as T
  } catch (err: unknown) {
    if (err instanceof ServiceError || err instanceof NotFoundError) throw err
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ServiceError('Mind7 API timeout - verifique se o servidor está rodando', 'mind7')
    }
    throw new ServiceError(`Mind7 API indisponível: ${err instanceof Error ? err.message : 'erro desconhecido'}`, 'mind7')
  } finally {
    clearTimeout(timeout)
  }
}

export async function listEquipments(full = false): Promise<Mind7Equipment[]> {
  const key = `mind7:equipments:${full}`
  const cached = cache.get<Mind7Equipment[]>(key)
  if (cached) return cached

  const data = await mind7Fetch<Mind7Equipment[]>(`/api/equipments/all${full ? '?full=true' : ''}`)
  cache.set(key, data)
  return data
}

export async function getEquipment(id: string, full = false): Promise<Mind7Equipment> {
  const data = await mind7Fetch<Mind7Equipment>(`/api/equipments/${encodeURIComponent(id)}${full ? '?full=true' : ''}`)
  return data
}

export async function searchEquipments(q: string, limit = 50, offset = 0, full = false): Promise<Mind7SearchResult> {
  const params = new URLSearchParams({ q, limit: String(limit), offset: String(offset) })
  if (full) params.set('full', 'true')
  return mind7Fetch<Mind7SearchResult>(`/api/equipments/search?${params}`)
}

export async function advancedSearch(params: Mind7AdvancedSearchParams): Promise<Mind7SearchResult> {
  return mind7Fetch<Mind7SearchResult>('/api/search/advanced', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function searchSuggestions(q: string, limit = 10): Promise<{ suggestions: string[]; query: string }> {
  const params = new URLSearchParams({ q, limit: String(limit) })
  return mind7Fetch(`/api/search/suggestions?${params}`)
}

export async function listCategories(): Promise<Mind7Category[]> {
  const key = 'mind7:categories'
  const cached = cache.get<Mind7Category[]>(key)
  if (cached) return cached

  const data = await mind7Fetch<Mind7Category[]>('/api/categories/')
  cache.set(key, data)
  return data
}

export async function getCategory(id: string): Promise<Mind7Category> {
  return mind7Fetch<Mind7Category>(`/api/categories/${encodeURIComponent(id)}`)
}

export async function listTypes(): Promise<Mind7Type[]> {
  const key = 'mind7:types'
  const cached = cache.get<Mind7Type[]>(key)
  if (cached) return cached

  const data = await mind7Fetch<Mind7Type[]>('/api/types/')
  cache.set(key, data)
  return data
}

export async function getType(id: string): Promise<Mind7Type> {
  return mind7Fetch<Mind7Type>(`/api/types/${encodeURIComponent(id)}`)
}

export async function listReviews(): Promise<Mind7Review[]> {
  const key = 'mind7:reviews'
  const cached = cache.get<Mind7Review[]>(key)
  if (cached) return cached

  const data = await mind7Fetch<Mind7Review[]>('/api/reviews/')
  cache.set(key, data)
  return data
}

export async function getReview(userId: string, equipmentId: string): Promise<Mind7Review> {
  return mind7Fetch<Mind7Review>(`/api/reviews/${encodeURIComponent(userId)}/${encodeURIComponent(equipmentId)}`)
}

export async function getStatus(): Promise<{ online: boolean; baseUrl: string }> {
  const base = getBaseUrl()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(`${base}/home`, { signal: controller.signal })
    clearTimeout(timeout)
    return { online: res.ok, baseUrl: base }
  } catch {
    return { online: false, baseUrl: base }
  }
}
