import type { FastifyInstance } from 'fastify'
import { getWeather } from './weather.service.js'

export async function weatherRoutes(app: FastifyInstance) {
  app.get('/api/weather', {
    schema: {
      description: 'Previsão do tempo por coordenadas (Open-Meteo)',
      tags: ['Clima'],
      querystring: {
        type: 'object' as const,
        properties: {
          lat: { type: 'number' as const, description: 'Latitude' },
          lon: { type: 'number' as const, description: 'Longitude' },
        },
        required: ['lat' as const, 'lon' as const],
      },
    },
    handler: async (request, reply) => {
      const { lat, lon } = request.query as { lat: number; lon: number }
      const data = await getWeather(lat, lon)
      return reply.send({ success: true, data })
    },
  })
}
