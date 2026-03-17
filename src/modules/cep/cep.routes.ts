import type { FastifyInstance } from 'fastify'
import { lookupCep } from './cep.service.js'

export async function cepRoutes(app: FastifyInstance) {
  app.get<{ Params: { cep: string } }>('/api/cep/:cep', {
    schema: {
      description: 'Consulta endereço por CEP com fallback entre múltiplos providers',
      tags: ['CEP'],
      params: {
        type: 'object',
        properties: {
          cep: { type: 'string', description: 'CEP com 8 dígitos' },
        },
        required: ['cep'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                cep: { type: 'string' },
                state: { type: 'string' },
                city: { type: 'string' },
                neighborhood: { type: 'string' },
                street: { type: 'string' },
                service: { type: 'string' },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const result = await lookupCep(request.params.cep)
      return reply.send({ success: true, data: result })
    },
  })
}
