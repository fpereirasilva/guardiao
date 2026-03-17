import { ValidationError } from '../../shared/errors/index.js'
import type { CpfValidationResult, CnpjValidationResult } from './document.types.js'

export function validateCpf(rawCpf: string): CpfValidationResult {
  const cpf = rawCpf.replace(/\D/g, '')

  if (cpf.length !== 11) {
    throw new ValidationError('CPF deve conter 11 dígitos.')
  }

  const formatted = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  const valid = isValidCpf(cpf)

  return { cpf, valid, formatted }
}

export function validateCnpj(rawCnpj: string): CnpjValidationResult {
  const cnpj = rawCnpj.replace(/\D/g, '')

  if (cnpj.length !== 14) {
    throw new ValidationError('CNPJ deve conter 14 dígitos.')
  }

  const formatted = cnpj.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  )
  const valid = isValidCnpj(cnpj)

  return { cnpj, valid, formatted }
}

function isValidCpf(cpf: string): boolean {
  // Rejeita sequências de dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const digits = cpf.split('').map(Number)

  // Primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== digits[9]) return false

  // Segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== digits[10]) return false

  return true
}

function isValidCnpj(cnpj: string): boolean {
  // Rejeita sequências de dígitos iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  const digits = cnpj.split('').map(Number)

  // Primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * weights1[i]
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder
  if (firstDigit !== digits[12]) return false

  // Segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * weights2[i]
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder
  if (secondDigit !== digits[13]) return false

  return true
}
