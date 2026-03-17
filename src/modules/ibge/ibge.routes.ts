import type { FastifyInstance } from 'fastify'
import { listEstados, listMunicipios } from './ibge.service.js'

export async function ibgeRoutes(app: FastifyInstance) {
  app.get('/api/ibge/estados', {
    schema: {
      description: 'Lista todos os estados brasileiros',
      tags: ['IBGE'],
    },
    handler: async (_request, reply) => {
      const data = await listEstados()
      return reply.send({ success: true, data })
    },
  })

  app.get('/api/ibge/estados/:uf/municipios', {
    schema: {
      description: 'Lista municípios de um estado',
      tags: ['IBGE'],
      params: {
        type: 'object' as const,
        properties: { uf: { type: 'string' as const } },
        required: ['uf' as const],
      },
    },
    handler: async (request, reply) => {
      const { uf } = request.params as { uf: string }
      const data = await listMunicipios(uf)
      return reply.send({ success: true, data })
    },
  })
}
