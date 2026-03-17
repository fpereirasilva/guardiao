export function generateCpf(): string {
  const digits: number[] = []

  for (let i = 0; i < 9; i++) {
    digits.push(Math.floor(Math.random() * 10))
  }

  // First check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i)
  }
  let remainder = (sum * 10) % 11
  digits.push(remainder === 10 ? 0 : remainder)

  // Second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i)
  }
  remainder = (sum * 10) % 11
  digits.push(remainder === 10 ? 0 : remainder)

  const cpf = digits.join('')

  // Reject if all same digits
  if (/^(\d)\1{10}$/.test(cpf)) {
    return generateCpf()
  }

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function generateCnpj(): string {
  const digits: number[] = []

  for (let i = 0; i < 8; i++) {
    digits.push(Math.floor(Math.random() * 10))
  }
  // Branch suffix: 0001
  digits.push(0, 0, 0, 1)

  // First check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * weights1[i]
  }
  let remainder = sum % 11
  digits.push(remainder < 2 ? 0 : 11 - remainder)

  // Second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * weights2[i]
  }
  remainder = sum % 11
  digits.push(remainder < 2 ? 0 : 11 - remainder)

  const cnpj = digits.join('')
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}
