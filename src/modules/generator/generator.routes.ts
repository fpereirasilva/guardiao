import type { FastifyInstance } from 'fastify'
import { generateCpf, generateCnpj } from './generator.service.js'

export async function generatorRoutes(app: FastifyInstance) {
  app.get('/api/generate/cpf', {
    schema: {
      description: 'Gera um CPF válido aleatório',
      tags: ['Gerador'],
    },
    handler: async (_request, reply) => {
      const cpf = generateCpf()
      return reply.send({ success: true, data: { cpf } })
    },
  })

  app.get('/api/generate/cnpj', {
    schema: {
      description: 'Gera um CNPJ válido aleatório',
      tags: ['Gerador'],
    },
    handler: async (_request, reply) => {
      const cnpj = generateCnpj()
      return reply.send({ success: true, data: { cnpj } })
    },
  })
}
