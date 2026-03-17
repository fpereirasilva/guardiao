import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const animalsCache = new MemoryCache(60) // 1min (random images change frequently)

export interface DogImage {
  url: string
  breed?: string
}

export interface CatFact {
  fact: string
}

export async function getRandomDog(breed?: string): Promise<DogImage> {
  const url = breed
    ? `https://dog.ceo/api/breed/${breed}/images/random`
    : 'https://dog.ceo/api/breeds/image/random'

  let response: Response
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(10000) })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de animais.', 'animals')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar imagem.', 'animals')
  }

  const data = await response.json() as { message: string; status: string }
  return { url: data.message, breed }
}

export async function getDogBreeds(): Promise<string[]> {
  const cached = animalsCache.get<string[]>('dog:breeds')
  if (cached) return cached

  let response: Response
  try {
    response = await fetch('https://dog.ceo/api/breeds/list/all', {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de animais.', 'animals')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar raças.', 'animals')
  }

  const data = await response.json() as { message: Record<string, string[]> }
  const breeds = Object.keys(data.message).sort()
  animalsCache.set('dog:breeds', breeds, 86400)
  return breeds
}

export async function getCatFact(): Promise<CatFact> {
  let response: Response
  try {
    response = await fetch('https://catfact.ninja/fact', {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de fatos sobre gatos.', 'animals')
  }

  if (!response.ok) {
    throw new ServiceError('Erro ao buscar fato.', 'animals')
  }

  const data = await response.json() as { fact: string }
  return { fact: data.fact }
}
