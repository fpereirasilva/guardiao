import type { FastifyInstance } from 'fastify'
import { validateCpf, validateCnpj } from './document.service.js'

export async function documentRoutes(app: FastifyInstance) {
  // --- CPF ---
  app.post('/api/validate/cpf', {
    schema: {
      description: 'Valida um CPF usando algoritmo de dígitos verificadores',
      tags: ['Documentos'],
      body: {
        type: 'object' as const,
        properties: {
          cpf: { type: 'string' as const, description: 'CPF com 11 dígitos (com ou sem formatação)' },
        },
        required: ['cpf' as const],
      },
    },
    handler: async (request, reply) => {
      const { cpf } = request.body as { cpf: string }
      const result = validateCpf(cpf)
      const status = result.valid ? 200 : 400
      return reply.code(status).send({ success: result.valid, data: result })
    },
  })

  // --- CNPJ ---
  app.post('/api/validate/cnpj', {
    schema: {
      description: 'Valida um CNPJ usando algoritmo de dígitos verificadores',
      tags: ['Documentos'],
      body: {
        type: 'object' as const,
        properties: {
          cnpj: { type: 'string' as const, description: 'CNPJ com 14 dígitos (com ou sem formatação)' },
        },
        required: ['cnpj' as const],
      },
    },
    handler: async (request, reply) => {
      const { cnpj } = request.body as { cnpj: string }
      const result = validateCnpj(cnpj)
      const status = result.valid ? 200 : 400
      return reply.code(status).send({ success: result.valid, data: result })
    },
  })
}
