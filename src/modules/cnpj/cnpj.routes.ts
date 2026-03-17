import type { FastifyInstance } from 'fastify'
import { lookupCnpj } from './cnpj.service.js'

export async function cnpjRoutes(app: FastifyInstance) {
  app.get('/api/cnpj/:cnpj', {
    schema: {
      description: 'Consulta dados completos de uma empresa pelo CNPJ',
      tags: ['CNPJ'],
      params: {
        type: 'object' as const,
        properties: { cnpj: { type: 'string' as const } },
        required: ['cnpj' as const],
      },
    },
    handler: async (request, reply) => {
      const { cnpj } = request.params as { cnpj: string }
      const result = await lookupCnpj(cnpj)
      return reply.send({ success: true, data: result })
    },
  })
}
