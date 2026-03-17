import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const banksCache = new MemoryCache(86400) // 24h

export interface Bank {
  ispb: string
  name: string
  code: number | null
  fullName: string
}

export async function listBanks(): Promise<Bank[]> {
  const cached = banksCache.get<Bank[]>('banks:all')
  if (cached) return cached

  let response: Response
  try {
    response = await fetch('https://brasilapi.com.br/api/banks/v1', {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de bancos.', 'banks')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar lista de bancos.', 'banks')
  }

  const data = await response.json() as Array<Record<string, unknown>>
  const banks: Bank[] = data.map((b) => ({
    ispb: b.ispb as string,
    name: b.name as string || (b.fullName as string) || '',
    code: b.code as number | null,
    fullName: b.fullName as string || '',
  }))

  banksCache.set('banks:all', banks)
  return banks
}

export async function lookupBank(code: string): Promise<Bank> {
  const cached = banksCache.get<Bank>(`bank:${code}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://brasilapi.com.br/api/banks/v1/${code}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de bancos.', 'banks')
  }

  if (!response.ok) {
    throw new ServiceError('Banco não encontrado.', 'banks')
  }

  const b = await response.json() as Record<string, unknown>
  const bank: Bank = {
    ispb: b.ispb as string,
    name: b.name as string || (b.fullName as string) || '',
    code: b.code as number | null,
    fullName: b.fullName as string || '',
  }

  banksCache.set(`bank:${code}`, bank)
  return bank
}
