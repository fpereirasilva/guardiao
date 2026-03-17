import { ServiceError } from '../../shared/errors/index.js'
import { cepCache } from '../../shared/cache/index.js'

export interface CnpjLookupResult {
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

export async function lookupCnpj(rawCnpj: string): Promise<CnpjLookupResult> {
  const cnpj = rawCnpj.replace(/\D/g, '')
  if (cnpj.length !== 14) {
    throw new ServiceError('CNPJ deve conter 14 dígitos.', 'cnpj-lookup')
  }

  const cached = cepCache.get<CnpjLookupResult>(`cnpj:${cnpj}`)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new ServiceError('Erro ao se conectar com o serviço de consulta CNPJ.', 'cnpj-lookup')
  }

  if (!response.ok) {
    throw new ServiceError('CNPJ não encontrado.', 'cnpj-lookup')
  }

  const data = await response.json() as Record<string, unknown>
  const atividades = data.atividade_principal as Array<Record<string, string>> | undefined

  const result: CnpjLookupResult = {
    cnpj: data.cnpj as string,
    razao_social: data.razao_social as string,
    nome_fantasia: (data.nome_fantasia as string) || '',
    situacao: data.situacao as string,
    tipo: data.tipo as string,
    abertura: data.abertura as string,
    natureza_juridica: data.natureza_juridica as string,
    porte: data.porte as string,
    atividade_principal: atividades?.[0]?.text || '',
    logradouro: data.logradouro as string,
    numero: data.numero as string,
    bairro: data.bairro as string,
    municipio: data.municipio as string,
    uf: data.uf as string,
    cep: data.cep as string,
    telefone: data.telefone as string,
    email: data.email as string,
  }

  cepCache.set(`cnpj:${cnpj}`, result, 3600)
  return result
}
