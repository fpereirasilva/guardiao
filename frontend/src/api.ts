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

  health: () => request<{ status: string; uptime: number }>('/api/health'),
}
