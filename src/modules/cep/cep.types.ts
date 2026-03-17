export interface CepResult {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

export interface CepProvider {
  name: string
  fetch(cep: string): Promise<CepResult>
}
