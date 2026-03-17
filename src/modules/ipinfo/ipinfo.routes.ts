import type { FastifyInstance } from 'fastify'
import { lookupIp } from './ipinfo.service.js'

export async function ipinfoRoutes(app: FastifyInstance) {
  app.get('/api/ipinfo/:ip', {
    schema: {
      description: 'Geolocalização por endereço IP',
      tags: ['IP Info'],
      params: {
        type: 'object' as const,
        properties: { ip: { type: 'string' as const } },
        required: ['ip' as const],
      },
    },
    handler: async (request, reply) => {
      const { ip } = request.params as { ip: string }
      const data = await lookupIp(ip)
      return reply.send({ success: true, data })
    },
  })
}
