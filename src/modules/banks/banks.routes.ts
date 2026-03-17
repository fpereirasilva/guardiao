import type { FastifyInstance } from 'fastify'
import { listBanks, lookupBank } from './banks.service.js'

export async function banksRoutes(app: FastifyInstance) {
  app.get('/api/banks', {
    schema: {
      description: 'Lista todos os bancos brasileiros',
      tags: ['Bancos'],
    },
    handler: async (_request, reply) => {
      const data = await listBanks()
      return reply.send({ success: true, data })
    },
  })

  app.get('/api/banks/:code', {
    schema: {
      description: 'Consulta banco pelo código',
      tags: ['Bancos'],
      params: {
        type: 'object' as const,
        properties: { code: { type: 'string' as const } },
        required: ['code' as const],
      },
    },
    handler: async (request, reply) => {
      const { code } = request.params as { code: string }
      const data = await lookupBank(code)
      return reply.send({ success: true, data })
    },
  })
}
