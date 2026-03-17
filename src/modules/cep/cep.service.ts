import type { CepProvider, CepResult } from './cep.types.js'
import { ViaCepProvider } from './providers/viacep.provider.js'
import { BrasilApiProvider } from './providers/brasilapi.provider.js'
import { OpenCepProvider } from './providers/opencep.provider.js'
import { CircuitBreaker } from '../../shared/circuit-breaker/index.js'
import { cepCache } from '../../shared/cache/index.js'
import { NotFoundError, ValidationError } from '../../shared/errors/index.js'

const providers: CepProvider[] = [
  new ViaCepProvider(),
  new BrasilApiProvider(),
  new OpenCepProvider(),
]

const breakers = new Map<string, CircuitBreaker>(
  providers.map((p) => [p.name, new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 30000 })])
)

function validateCep(cep: string): string {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) {
    throw new ValidationError('CEP deve conter exatamente 8 dígitos.')
  }
  return cleaned
}

export async function lookupCep(rawCep: string): Promise<CepResult> {
  const cep = validateCep(rawCep)

  const cached = cepCache.get<CepResult>(cep)
  if (cached) {
    return { ...cached, service: `${cached.service} (cache)` }
  }

  const errors: Error[] = []

  for (const provider of providers) {
    const breaker = breakers.get(provider.name)!
    try {
      const result = await breaker.execute(() => provider.fetch(cep))
      cepCache.set(cep, result)
      return result
    } catch (error) {
      errors.push(error as Error)
    }
  }

  throw new NotFoundError(
    `CEP ${cep} não encontrado. Serviços consultados: ${providers.map((p) => p.name).join(', ')}`
  )
}
