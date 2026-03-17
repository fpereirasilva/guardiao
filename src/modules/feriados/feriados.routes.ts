import type { FastifyInstance } from 'fastify'
import { listFeriados } from './feriados.service.js'

export async function feriadosRoutes(app: FastifyInstance) {
  app.get('/api/feriados/:ano', {
    schema: {
      description: 'Lista feriados nacionais de um ano',
      tags: ['Feriados'],
      params: {
        type: 'object' as const,
        properties: { ano: { type: 'string' as const } },
        required: ['ano' as const],
      },
    },
    handler: async (request, reply) => {
      const { ano } = request.params as { ano: string }
      const data = await listFeriados(Number(ano))
      return reply.send({ success: true, data })
    },
  })
}
