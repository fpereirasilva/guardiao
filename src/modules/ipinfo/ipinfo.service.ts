import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const ipCache = new MemoryCache(3600) // 1h

export interface IpInfo {
  ip: string
  country: string
  countryCode: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
}

export async function lookupIp(ip: string): Promise<IpInfo> {
  // Basic validation - only allow valid IP patterns
  if (!/^[\d.]+$/.test(ip) && !/^[\da-fA-F:]+$/.test(ip)) {
    throw new ServiceError('IP inválido.', 'ipinfo')
  }

  const cached = ipCache.get<IpInfo>(`ip:${ip}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,timezone,isp,query`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de geolocalização IP.', 'ipinfo')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar informações do IP.', 'ipinfo')
  }

  const data = await response.json() as Record<string, unknown>

  if (data.status === 'fail') {
    throw new ServiceError((data.message as string) || 'IP não encontrado.', 'ipinfo')
  }

  const result: IpInfo = {
    ip: data.query as string,
    country: data.country as string,
    countryCode: data.countryCode as string,
    region: data.regionName as string,
    city: data.city as string,
    latitude: data.lat as number,
    longitude: data.lon as number,
    timezone: data.timezone as string,
    isp: data.isp as string,
  }

  ipCache.set(`ip:${ip}`, result)
  return result
}
