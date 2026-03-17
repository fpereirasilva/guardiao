import type { FastifyInstance } from 'fastify'
import { lookupDdd } from './ddd.service.js'

export async function dddRoutes(app: FastifyInstance) {
  app.get('/api/ddd/:ddd', {
    schema: {
      description: 'Consulta cidades e estado de um DDD',
      tags: ['DDD'],
      params: {
        type: 'object' as const,
        properties: { ddd: { type: 'string' as const } },
        required: ['ddd' as const],
      },
    },
    handler: async (request, reply) => {
      const { ddd } = request.params as { ddd: string }
      const data = await lookupDdd(ddd)
      return reply.send({ success: true, data })
    },
  })
}
