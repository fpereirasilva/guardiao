import type { CepProvider, CepResult } from '../cep.types.js'
import { ServiceError } from '../../../shared/errors/index.js'

export class OpenCepProvider implements CepProvider {
  name = 'opencep'

  async fetch(cep: string): Promise<CepResult> {
    const url = `https://opencep.com/v1/${cep}`

    let response: Response
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      throw new ServiceError('Erro ao se conectar com o serviço OpenCEP.', this.name)
    }

    if (!response.ok) {
      throw new ServiceError('CEP não encontrado na base do OpenCEP.', this.name)
    }

    const data = await response.json() as Record<string, unknown>

    return {
      cep: (data.cep as string).replace('-', ''),
      state: data.uf as string,
      city: data.localidade as string,
      neighborhood: data.bairro as string,
      street: data.logradouro as string,
      service: this.name,
    }
  }
}
