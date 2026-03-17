import type { CepProvider, CepResult } from '../cep.types.js'
import { ServiceError } from '../../../shared/errors/index.js'

export class BrasilApiProvider implements CepProvider {
  name = 'brasilapi'

  async fetch(cep: string): Promise<CepResult> {
    const url = `https://brasilapi.com.br/api/cep/v2/${cep}`

    let response: Response
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      throw new ServiceError('Erro ao se conectar com o serviço BrasilAPI.', this.name)
    }

    if (!response.ok) {
      throw new ServiceError('CEP não encontrado na base do BrasilAPI.', this.name)
    }

    const data = await response.json() as Record<string, unknown>

    return {
      cep: (data.cep as string).replace('-', ''),
      state: data.state as string,
      city: data.city as string,
      neighborhood: data.neighborhood as string,
      street: data.street as string,
      service: this.name,
    }
  }
}
