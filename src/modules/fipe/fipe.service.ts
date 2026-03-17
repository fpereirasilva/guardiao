import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const fipeCache = new MemoryCache(86400) // 24h

export type TipoVeiculo = 'carros' | 'motos' | 'caminhoes'

export interface FipeMarca {
  nome: string
  valor: string
}

export interface FipePreco {
  valor: string
  marca: string
  modelo: string
  anoModelo: number
  combustivel: string
  codigoFipe: string
  mesReferencia: string
}

export async function listMarcas(tipo: TipoVeiculo): Promise<FipeMarca[]> {
  const cached = fipeCache.get<FipeMarca[]>(`fipe:marcas:${tipo}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://brasilapi.com.br/api/fipe/marcas/v1/${tipo}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço FIPE.', 'fipe')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar marcas FIPE.', 'fipe')
  }

  const data = await response.json() as FipeMarca[]
  fipeCache.set(`fipe:marcas:${tipo}`, data)
  return data
}

export async function lookupPreco(codigoFipe: string): Promise<FipePreco[]> {
  const cached = fipeCache.get<FipePreco[]>(`fipe:preco:${codigoFipe}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${codigoFipe}`, {
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço FIPE.', 'fipe')
  }

  if (!response.ok) {
    throw new ServiceError('Código FIPE não encontrado.', 'fipe')
  }

  const data = await response.json() as FipePreco[]
  fipeCache.set(`fipe:preco:${codigoFipe}`, data, 3600)
  return data
}
