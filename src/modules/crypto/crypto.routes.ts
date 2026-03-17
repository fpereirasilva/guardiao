import type { FastifyInstance } from 'fastify'
import { getCryptoList, getCryptoDetail } from './crypto.service.js'

export async function cryptoRoutes(app: FastifyInstance) {
  app.get('/api/crypto', {
    schema: {
      description: 'Lista top 50 criptomoedas (CoinCap)',
      tags: ['Criptomoedas'],
    },
    handler: async (_request, reply) => {
      const data = await getCryptoList()
      return reply.send({ success: true, data })
    },
  })

  app.get('/api/crypto/:id', {
    schema: {
      description: 'Detalhes de uma criptomoeda',
      tags: ['Criptomoedas'],
      params: {
        type: 'object' as const,
        properties: { id: { type: 'string' as const } },
        required: ['id' as const],
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const data = await getCryptoDetail(id)
      return reply.send({ success: true, data })
    },
  })
}
