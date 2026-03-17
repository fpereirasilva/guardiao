const API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '')
  : ''

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: { message: string }
}

export interface CepData {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

export interface CpfData {
  cpf: string
  valid: boolean
  formatted: string
}

export interface CnpjData {
  cnpj: string
  valid: boolean
  formatted: string
}

export interface CnpjLookupData {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  situacao: string
  tipo: string
  abertura: string
  natureza_juridica: string
  porte: string
  atividade_principal: string
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  uf: string
  cep: string
  telefone: string
  email: string
}

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

export interface Feriado {
  date: string
  name: string
  type: string
}

export interface DddData {
  ddd: string
  state: string
  cities: string[]
}

export interface Bank {
  ispb: string
  name: string
  code: number | null
  fullName: string
}

// Weather
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

// Exchange
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

// Crypto
export interface CryptoListItem {
  id: string
  rank: string
  symbol: string
  name: string
  priceUsd: string
  changePercent24h: string
}

export interface CryptoDetail {
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

// Dictionary
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

// Animals
export interface DogImage {
  url: string
  breed?: string
}

export interface CatFact {
  fact: string
}

// IP Info
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

// Mind7
export interface Mind7Equipment {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  description?: string
  website?: string
  phone_number?: string
  category_id?: string
  category?: { id: string; name: string; description?: string }
  types?: { id: string; name: string; description?: string }[]
}

export interface Mind7Category {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Mind7SearchResult {
  results: Mind7Equipment[]
  total: number
  searchTerm?: string
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  return res.json()
}

export const api = {
  lookupCep: (cep: string) =>
    request<CepData>(`/api/cep/${cep.replace(/\D/g, '')}`),

  validateCpf: (cpf: string) =>
    request<CpfData>('/api/validate/cpf', {
      method: 'POST',
      body: JSON.stringify({ cpf }),
    }),

  validateCnpj: (cnpj: string) =>
    request<CnpjData>('/api/validate/cnpj', {
      method: 'POST',
      body: JSON.stringify({ cnpj }),
    }),

  lookupCnpj: (cnpj: string) =>
    request<CnpjLookupData>(`/api/cnpj/${cnpj.replace(/\D/g, '')}`),

  listEstados: () =>
    request<Estado[]>('/api/ibge/estados'),

  listMunicipios: (uf: string) =>
    request<Municipio[]>(`/api/ibge/estados/${uf}/municipios`),

  listMarcasFipe: (tipo: string) =>
    request<FipeMarca[]>(`/api/fipe/marcas/${tipo}`),

  lookupPrecoFipe: (codigo: string) =>
    request<FipePreco[]>(`/api/fipe/preco/${codigo}`),

  listFeriados: (ano: number) =>
    request<Feriado[]>(`/api/feriados/${ano}`),

  lookupDdd: (ddd: string) =>
    request<DddData>(`/api/ddd/${ddd.replace(/\D/g, '')}`),

  generateCpf: () =>
    request<{ cpf: string }>('/api/generate/cpf'),

  generateCnpj: () =>
    request<{ cnpj: string }>('/api/generate/cnpj'),

  listBanks: () =>
    request<Bank[]>('/api/banks'),

  lookupBank: (code: string) =>
    request<Bank>(`/api/banks/${code}`),

  // Weather
  getWeather: (lat: number, lon: number) =>
    request<WeatherData>(`/api/weather?lat=${lat}&lon=${lon}`),

  // Exchange
  getExchangeRates: (base = 'BRL') =>
    request<ExchangeRates>(`/api/exchange/rates?base=${encodeURIComponent(base)}`),

  convertCurrency: (from: string, to: string, amount: number) =>
    request<ExchangeConversion>(`/api/exchange/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${amount}`),

  // Crypto
  getCryptoList: () =>
    request<CryptoListItem[]>('/api/crypto'),

  getCryptoDetail: (id: string) =>
    request<CryptoDetail>(`/api/crypto/${encodeURIComponent(id)}`),

  // Dictionary
  lookupWord: (word: string, lang = 'en') =>
    request<DictionaryResult>(`/api/dictionary/${encodeURIComponent(word)}?lang=${encodeURIComponent(lang)}`),

  // Animals
  getRandomDog: (breed?: string) =>
    request<DogImage>(breed ? `/api/animals/dogs/random?breed=${encodeURIComponent(breed)}` : '/api/animals/dogs/random'),

  getDogBreeds: () =>
    request<string[]>('/api/animals/dogs/breeds'),

  getCatFact: () =>
    request<CatFact>('/api/animals/cats/fact'),

  // IP Info
  lookupIp: (ip: string) =>
    request<IpInfo>(`/api/ipinfo/${encodeURIComponent(ip)}`),

  // Mind7
  mind7Status: () =>
    request<{ online: boolean; baseUrl: string }>('/api/mind7/status'),

  mind7Equipments: (full = false) =>
    request<Mind7Equipment[]>(`/api/mind7/equipments?full=${full}`),

  mind7Equipment: (id: string, full = false) =>
    request<Mind7Equipment>(`/api/mind7/equipments/${encodeURIComponent(id)}?full=${full}`),

  mind7Search: (q: string) =>
    request<Mind7SearchResult>(`/api/mind7/search?q=${encodeURIComponent(q)}`),

  mind7Categories: () =>
    request<Mind7Category[]>('/api/mind7/categories'),

  health: () => request<{ status: string; uptime: number }>('/api/health'),
}
