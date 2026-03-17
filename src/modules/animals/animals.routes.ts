import type { FastifyInstance } from 'fastify'
import { getRandomDog, getDogBreeds, getCatFact } from './animals.service.js'

export async function animalsRoutes(app: FastifyInstance) {
  app.get('/api/animals/dogs/random', {
    schema: {
      description: 'Foto aleatória de cachorro',
      tags: ['Animais'],
      querystring: {
        type: 'object' as const,
        properties: {
          breed: { type: 'string' as const, description: 'Raça (opcional)' },
        },
      },
    },
    handler: async (request, reply) => {
      const { breed } = request.query as { breed?: string }
      const data = await getRandomDog(breed)
      return reply.send({ success: true, data })
    },
  })

  app.get('/api/animals/dogs/breeds', {
    schema: {
      description: 'Lista todas as raças de cães',
      tags: ['Animais'],
    },
    handler: async (_request, reply) => {
      const data = await getDogBreeds()
      return reply.send({ success: true, data })
    },
  })

  app.get('/api/animals/cats/fact', {
    schema: {
      description: 'Fato aleatório sobre gatos',
      tags: ['Animais'],
    },
    handler: async (_request, reply) => {
      const data = await getCatFact()
      return reply.send({ success: true, data })
    },
  })
}
