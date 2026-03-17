import type { FastifyInstance } from 'fastify'
import { lookupWord } from './dictionary.service.js'

export async function dictionaryRoutes(app: FastifyInstance) {
  app.get('/api/dictionary/:word', {
    schema: {
      description: 'Busca definição de uma palavra (Free Dictionary API)',
      tags: ['Dicionário'],
      params: {
        type: 'object' as const,
        properties: { word: { type: 'string' as const } },
        required: ['word' as const],
      },
      querystring: {
        type: 'object' as const,
        properties: {
          lang: { type: 'string' as const, description: 'Idioma (en, pt, es, fr, de, it, etc.)' },
        },
      },
    },
    handler: async (request, reply) => {
      const { word } = request.params as { word: string }
      const { lang } = request.query as { lang?: string }
      const data = await lookupWord(word, lang || 'en')
      return reply.send({ success: true, data })
    },
  })
}
