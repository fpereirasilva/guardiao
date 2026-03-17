import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const cryptoCache = new MemoryCache(300) // 5min

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  priceUsd: string
  priceBrl: string
  changePercent24h: string
  marketCapUsd: string
  volumeUsd24h: string
  supply: string
}

export interface CryptoListItem {
  id: string
  rank: string
  symbol: string
  name: string
  priceUsd: string
  changePercent24h: string
}

export async function getCryptoList(): Promise<CryptoListItem[]> {
  const cached = cryptoCache.get<CryptoListItem[]>('crypto:list')
  if (cached) return cached

  let response: Response
  try {
    response = await fetch('https://api.coincap.io/v2/assets?limit=50', {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de criptomoedas.', 'crypto')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar criptomoedas.', 'crypto')
  }

  const json = await response.json() as { data: Array<Record<string, string>> }
  const result: CryptoListItem[] = json.data.map((c) => ({
    id: c.id,
    rank: c.rank,
    symbol: c.symbol,
    name: c.name,
    priceUsd: Number(c.priceUsd).toFixed(2),
    changePercent24h: Number(c.changePercent24Hr).toFixed(2),
  }))

  cryptoCache.set('crypto:list', result)
  return result
}

export async function getCryptoDetail(id: string): Promise<CryptoPrice> {
  const cached = cryptoCache.get<CryptoPrice>(`crypto:${id}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://api.coincap.io/v2/assets/${id}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de criptomoedas.', 'crypto')
  }

  if (!response.ok) {
    throw new ServiceError('Criptomoeda não encontrada.', 'crypto')
  }

  const json = await response.json() as { data: Record<string, string> }
  const c = json.data

  // Get BRL rate
  let brlRate = 5.0
  try {
    const rateRes = await fetch('https://api.coincap.io/v2/rates/brazilian-real', {
      signal: AbortSignal.timeout(5000),
    })
    if (rateRes.ok) {
      const rateJson = await rateRes.json() as { data: { rateUsd: string } }
      brlRate = 1 / Number(rateJson.data.rateUsd)
    }
  } catch { /* use default */ }

  const priceUsd = Number(c.priceUsd)
  const result: CryptoPrice = {
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    priceUsd: priceUsd.toFixed(2),
    priceBrl: (priceUsd * brlRate).toFixed(2),
    changePercent24h: Number(c.changePercent24Hr).toFixed(2),
    marketCapUsd: Number(c.marketCapUsd).toFixed(0),
    volumeUsd24h: Number(c.volumeUsd24Hr).toFixed(0),
    supply: Number(c.supply).toFixed(0),
  }

  cryptoCache.set(`crypto:${id}`, result)
  return result
}
