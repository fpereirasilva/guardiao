import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const weatherCache = new MemoryCache(1800) // 30min

export interface WeatherData {
  latitude: number
  longitude: number
  temperature: number
  windspeed: number
  winddirection: number
  weathercode: number
  humidity: number
  description: string
  daily: DailyForecast[]
}

export interface DailyForecast {
  date: string
  tempMax: number
  tempMin: number
  weathercode: number
  description: string
}

const weatherCodes: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Nevoeiro', 48: 'Nevoeiro com geada',
  51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa forte',
  61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
  71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte',
  80: 'Pancadas leves', 81: 'Pancadas moderadas', 82: 'Pancadas fortes',
  95: 'Tempestade', 96: 'Tempestade com granizo leve', 99: 'Tempestade com granizo',
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  const key = `weather:${lat.toFixed(2)}:${lon.toFixed(2)}`
  const cached = weatherCache.get<WeatherData>(key)
  if (cached) return cached

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America/Sao_Paulo&forecast_days=7`

  let response: Response
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(10000) })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de clima.', 'weather')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar previsão do tempo.', 'weather')
  }

  const data = await response.json() as Record<string, unknown>
  const current = data.current_weather as Record<string, number>
  const hourly = data.hourly as Record<string, unknown[]>
  const daily = data.daily as Record<string, unknown[]>

  const humidity = (hourly?.relativehumidity_2m as number[])?.[0] ?? 0

  const dailyForecasts: DailyForecast[] = []
  const dates = daily?.time as string[] ?? []
  const maxTemps = daily?.temperature_2m_max as number[] ?? []
  const minTemps = daily?.temperature_2m_min as number[] ?? []
  const codes = daily?.weathercode as number[] ?? []

  for (let i = 0; i < dates.length; i++) {
    dailyForecasts.push({
      date: dates[i],
      tempMax: maxTemps[i],
      tempMin: minTemps[i],
      weathercode: codes[i],
      description: weatherCodes[codes[i]] ?? 'Desconhecido',
    })
  }

  const result: WeatherData = {
    latitude: lat,
    longitude: lon,
    temperature: current.temperature,
    windspeed: current.windspeed,
    winddirection: current.winddirection,
    weathercode: current.weathercode,
    humidity,
    description: weatherCodes[current.weathercode] ?? 'Desconhecido',
    daily: dailyForecasts,
  }

  weatherCache.set(key, result)
  return result
}
