import { ServiceError } from '../../shared/errors/index.js'
import { MemoryCache } from '../../shared/cache/index.js'

const dictCache = new MemoryCache(86400) // 24h

export interface DictionaryResult {
  word: string
  phonetic: string
  audio: string
  meanings: DictionaryMeaning[]
}

export interface DictionaryMeaning {
  partOfSpeech: string
  definitions: { definition: string; example?: string }[]
  synonyms: string[]
}

export async function lookupWord(word: string, lang: string = 'en'): Promise<DictionaryResult> {
  const key = `dict:${lang}:${word.toLowerCase()}`
  const cached = dictCache.get<DictionaryResult>(key)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURIComponent(word)}`, {
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new ServiceError('Erro ao conectar com serviço de dicionário.', 'dictionary')
  }

  if (!response.ok) {
    throw new ServiceError('Palavra não encontrada.', 'dictionary')
  }

  const data = await response.json() as Array<Record<string, unknown>>
  const entry = data[0]

  const phonetics = entry.phonetics as Array<Record<string, string>> ?? []
  const phonetic = phonetics.find(p => p.text)?.text || (entry.phonetic as string) || ''
  const audio = phonetics.find(p => p.audio)?.audio || ''

  const meanings = (entry.meanings as Array<Record<string, unknown>> ?? []).map((m) => ({
    partOfSpeech: m.partOfSpeech as string,
    definitions: (m.definitions as Array<Record<string, string>> ?? []).slice(0, 5).map(d => ({
      definition: d.definition,
      example: d.example || undefined,
    })),
    synonyms: ((m.synonyms as string[]) ?? []).slice(0, 10),
  }))

  const result: DictionaryResult = {
    word: entry.word as string,
    phonetic,
    audio,
    meanings,
  }

  dictCache.set(key, result)
  return result
}
