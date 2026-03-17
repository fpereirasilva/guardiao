import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const feriadosCache = new MemoryCache(86400) // 24h

export interface Feriado {
  date: string
  name: string
  type: string
}

export async function listFeriados(ano: number): Promise<Feriado[]> {
  if (ano < 1900 || ano > 2200) {
    throw new ServiceError('Ano deve estar entre 1900 e 2200.', 'feriados')
  }

  const cached = feriadosCache.get<Feriado[]>(`feriados:${ano}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de feriados.', 'feriados')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar feriados.', 'feriados')
  }

  const data = await response.json() as Array<Record<string, unknown>>
  const feriados: Feriado[] = data.map((f) => ({
    date: f.date as string,
    name: f.name as string,
    type: f.type as string,
  }))

  feriadosCache.set(`feriados:${ano}`, feriados)
  return feriados
}
