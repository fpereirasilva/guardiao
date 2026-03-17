import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const ibgeCache = new MemoryCache(86400) // 24h

export interface Estado {
  id: number
  sigla: string
  nome: string
  regiao: string
}

export interface Municipio {
  nome: string
  codigo_ibge: string
}

export async function listEstados(): Promise<Estado[]> {
  const cached = ibgeCache.get<Estado[]>('estados')
  if (cached) return cached

  let response: Response
  try {
    response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1', {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço IBGE.', 'ibge')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar estados.', 'ibge')
  }

  const data = await response.json() as Array<Record<string, unknown>>
  const estados: Estado[] = data.map((e) => ({
    id: e.id as number,
    sigla: e.sigla as string,
    nome: e.nome as string,
    regiao: (e.regiao as Record<string, string>)?.nome || '',
  }))

  ibgeCache.set('estados', estados)
  return estados
}

export async function listMunicipios(uf: string): Promise<Municipio[]> {
  const sigla = uf.toUpperCase()
  if (sigla.length !== 2) {
    throw new ServiceError('UF deve conter 2 caracteres.', 'ibge')
  }

  const cached = ibgeCache.get<Municipio[]>(`municipios:${sigla}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${sigla}?providers=dados-abertos-br,gov,wikipedia`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço IBGE.', 'ibge')
  }

  if (!response.ok) {
    throw new ServiceError(`Erro ao buscar municípios para ${sigla}.`, 'ibge')
  }

  const data = await response.json() as Array<Record<string, unknown>>
  const municipios: Municipio[] = data.map((m) => ({
    nome: m.nome as string,
    codigo_ibge: String(m.codigo_ibge ?? ''),
  }))

  ibgeCache.set(`municipios:${sigla}`, municipios)
  return municipios
}
