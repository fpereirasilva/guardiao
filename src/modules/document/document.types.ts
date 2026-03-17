export interface CpfValidationResult {
  cpf: string
  valid: boolean
  formatted: string
}

export interface CnpjValidationResult {
  cnpj: string
  valid: boolean
  formatted: string
}

export interface CpfLookupResult {
  cpf: string
  name: string
  gender: string
  birthDate: string
  age: number
  situation: string
}
