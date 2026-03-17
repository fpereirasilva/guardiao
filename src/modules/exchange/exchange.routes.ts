import type { FastifyInstance } from 'fastify'
import { getExchangeRates, convertCurrency } from './exchange.service.js'

export async function exchangeRoutes(app: FastifyInstance) {
  app.get('/api/exchange/rates', {
    schema: {
      description: 'Taxas de câmbio atuais (Frankfurter)',
      tags: ['Câmbio'],
      querystring: {
        type: 'object' as const,
        properties: {
          base: { type: 'string' as const, description: 'Moeda base (padrão: BRL)' },
        },
      },
    },
    handler: async (request, reply) => {
      const { base } = request.query as { base?: string }
      const data = await getExchangeRates(base || 'BRL')
      return reply.send({ success: true, data })
    },
  })

  app.get('/api/exchange/convert', {
    schema: {
      description: 'Converter entre moedas',
      tags: ['Câmbio'],
      querystring: {
        type: 'object' as const,
        properties: {
          from: { type: 'string' as const },
          to: { type: 'string' as const },
          amount: { type: 'number' as const },
        },
        required: ['from' as const, 'to' as const, 'amount' as const],
      },
    },
    handler: async (request, reply) => {
      const { from, to, amount } = request.query as { from: string; to: string; amount: number }
      const data = await convertCurrency(from, to, amount)
      return reply.send({ success: true, data })
    },
  })
}
