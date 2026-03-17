import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const exchangeCache = new MemoryCache(3600) // 1h

export interface ExchangeRates {
  base: string
  date: string
  rates: Record<string, number>
}

export interface ExchangeConversion {
  from: string
  to: string
  amount: number
  result: number
  rate: number
  date: string
}

export async function getExchangeRates(base: string = 'BRL'): Promise<ExchangeRates> {
  const key = `exchange:${base.toUpperCase()}`
  const cached = exchangeCache.get<ExchangeRates>(key)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://api.frankfurter.app/latest?from=${base.toUpperCase()}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de câmbio.', 'exchange')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar taxas de câmbio.', 'exchange')
  }

  const data = await response.json() as Record<string, unknown>
  const result: ExchangeRates = {
    base: data.base as string,
    date: data.date as string,
    rates: data.rates as Record<string, number>,
  }

  exchangeCache.set(key, result)
  return result
}

export async function convertCurrency(from: string, to: string, amount: number): Promise<ExchangeConversion> {
  const key = `exchange:convert:${from}:${to}:${amount}`
  const cached = exchangeCache.get<ExchangeConversion>(key)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://api.frankfurter.app/latest?from=${from.toUpperCase()}&to=${to.toUpperCase()}&amount=${amount}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de câmbio.', 'exchange')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao converter moeda.', 'exchange')
  }

  const data = await response.json() as Record<string, unknown>
  const rates = data.rates as Record<string, number>
  const result: ExchangeConversion = {
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    amount,
    result: rates[to.toUpperCase()],
    rate: rates[to.toUpperCase()] / amount,
    date: data.date as string,
  }

  exchangeCache.set(key, result, 1800)
  return result
}
