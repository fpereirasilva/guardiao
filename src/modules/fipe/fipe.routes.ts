import type { FastifyInstance } from 'fastify'
import { listMarcas, lookupPreco, type TipoVeiculo } from './fipe.service.js'

export async function fipeRoutes(app: FastifyInstance) {
  app.get('/api/fipe/marcas/:tipo', {
    schema: {
      description: 'Lista marcas de veículos (carros, motos, caminhoes)',
      tags: ['FIPE'],
      params: {
        type: 'object' as const,
        properties: { tipo: { type: 'string' as const, enum: ['carros', 'motos', 'caminhoes'] } },
        required: ['tipo' as const],
      },
    },
    handler: async (request, reply) => {
      const { tipo } = request.params as { tipo: TipoVeiculo }
      const data = await listMarcas(tipo)
      return reply.send({ success: true, data })
    },
  })

  app.get('/api/fipe/preco/:codigo', {
    schema: {
      description: 'Consulta preço por código FIPE',
      tags: ['FIPE'],
      params: {
        type: 'object' as const,
        properties: { codigo: { type: 'string' as const } },
        required: ['codigo' as const],
      },
    },
    handler: async (request, reply) => {
      const { codigo } = request.params as { codigo: string }
      const data = await lookupPreco(codigo)
      return reply.send({ success: true, data })
    },
  })
}
