import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const dddCache = new MemoryCache(86400) // 24h

export interface DddResult {
  ddd: string
  state: string
  cities: string[]
}

export async function lookupDdd(ddd: string): Promise<DddResult> {
  const code = ddd.replace(/\D/g, '')
  if (code.length < 2 || code.length > 3) {
    throw new ServiceError('DDD deve conter 2 dígitos.', 'ddd')
  }

  const cached = dddCache.get<DddResult>(`ddd:${code}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://brasilapi.com.br/api/ddd/v1/${code}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço DDD.', 'ddd')
  }

  if (!response.ok) {
    throw new ServiceError('DDD não encontrado.', 'ddd')
  }

  const data = await response.json() as Record<string, unknown>
  const result: DddResult = {
    ddd: code,
    state: data.state as string,
    cities: data.cities as string[],
  }

  dddCache.set(`ddd:${code}`, result)
  return result
}
