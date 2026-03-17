import type { CepProvider, CepResult } from '../cep.types.js'
import { ServiceError } from '../../../shared/errors/index.js'

export class ViaCepProvider implements CepProvider {
  name = 'viacep'

  async fetch(cep: string): Promise<CepResult> {
    const url = `https://viacep.com.br/ws/${cep}/json/`

    let response: Response
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { 'content-type': 'application/json;charset=utf-8' },
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      throw new ServiceError('Erro ao se conectar com o serviço ViaCEP.', this.name)
    }

    if (!response.ok) {
      throw new ServiceError('Erro ao se conectar com o serviço ViaCEP.', this.name)
    }

    const data = await response.json() as Record<string, unknown>

    if (data.erro === true) {
      throw new ServiceError('CEP não encontrado na base do ViaCEP.', this.name)
    }

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
