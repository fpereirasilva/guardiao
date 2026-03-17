import type { FastifyInstance } from 'fastify'
import * as mind7Service from './mind7.service.js'

export async function mind7Routes(app: FastifyInstance) {
  // Status check
  app.get('/api/mind7/status', {
    schema: {
      tags: ['Mind7'],
      summary: 'Verificar status da instância Mind7',
    },
  }, async () => {
    const status = await mind7Service.getStatus()
    return { success: true, data: status }
  })

  // Equipments
  app.get('/api/mind7/equipments', {
    schema: {
      tags: ['Mind7'],
      summary: 'Listar todos os equipamentos Mind7',
      querystring: {
        type: 'object',
        properties: {
          full: { type: 'string', description: 'Incluir categorias e tipos (true/false)' },
        },
      },
    },
  }, async (request) => {
    const { full } = request.query as { full?: string }
    const data = await mind7Service.listEquipments(full === 'true')
    return { success: true, data }
  })

  app.get('/api/mind7/equipments/:id', {
    schema: {
      tags: ['Mind7'],
      summary: 'Buscar equipamento por ID',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, async (request) => {
    const { id } = request.params as { id: string }
    const { full } = request.query as { full?: string }
    const data = await mind7Service.getEquipment(id, full === 'true')
    return { success: true, data }
  })

  // Search
  app.get('/api/mind7/search', {
    schema: {
      tags: ['Mind7'],
      summary: 'Buscar equipamentos por texto',
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Termo de busca (mín. 2 caracteres)' },
          limit: { type: 'number' },
          offset: { type: 'number' },
          full: { type: 'string' },
        },
        required: ['q'],
      },
    },
  }, async (request) => {
    const { q, limit, offset, full } = request.query as { q: string; limit?: number; offset?: number; full?: string }
    const data = await mind7Service.searchEquipments(q, limit || 50, offset || 0, full === 'true')
    return { success: true, data }
  })

  app.post('/api/mind7/search/advanced', {
    schema: {
      tags: ['Mind7'],
      summary: 'Busca avançada com geolocalização',
      body: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          category: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              lat: { type: 'number' },
              lng: { type: 'number' },
            },
          },
          radius: { type: 'number' },
          limit: { type: 'number' },
          offset: { type: 'number' },
          full: { type: 'boolean' },
        },
      },
    },
  }, async (request) => {
    const params = request.body as mind7Service.Mind7AdvancedSearchParams
    const data = await mind7Service.advancedSearch(params)
    return { success: true, data }
  })

  app.get('/api/mind7/search/suggestions', {
    schema: {
      tags: ['Mind7'],
      summary: 'Sugestões de busca (autocomplete)',
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          limit: { type: 'number' },
        },
        required: ['q'],
      },
    },
  }, async (request) => {
    const { q, limit } = request.query as { q: string; limit?: number }
    const data = await mind7Service.searchSuggestions(q, limit || 10)
    return { success: true, data }
  })

  // Categories
  app.get('/api/mind7/categories', {
    schema: {
      tags: ['Mind7'],
      summary: 'Listar categorias',
    },
  }, async () => {
    const data = await mind7Service.listCategories()
    return { success: true, data }
  })

  app.get('/api/mind7/categories/:id', {
    schema: {
      tags: ['Mind7'],
      summary: 'Buscar categoria por ID',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, async (request) => {
    const { id } = request.params as { id: string }
    const data = await mind7Service.getCategory(id)
    return { success: true, data }
  })

  // Types
  app.get('/api/mind7/types', {
    schema: {
      tags: ['Mind7'],
      summary: 'Listar tipos de equipamento',
    },
  }, async () => {
    const data = await mind7Service.listTypes()
    return { success: true, data }
  })

  app.get('/api/mind7/types/:id', {
    schema: {
      tags: ['Mind7'],
      summary: 'Buscar tipo por ID',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, async (request) => {
    const { id } = request.params as { id: string }
    const data = await mind7Service.getType(id)
    return { success: true, data }
  })

  // Reviews
  app.get('/api/mind7/reviews', {
    schema: {
      tags: ['Mind7'],
      summary: 'Listar avaliações',
    },
  }, async () => {
    const data = await mind7Service.listReviews()
    return { success: true, data }
  })

  app.get('/api/mind7/reviews/:userId/:equipmentId', {
    schema: {
      tags: ['Mind7'],
      summary: 'Buscar avaliação específica',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          equipmentId: { type: 'string' },
        },
      },
    },
  }, async (request) => {
    const { userId, equipmentId } = request.params as { userId: string; equipmentId: string }
    const data = await mind7Service.getReview(userId, equipmentId)
    return { success: true, data }
  })
}
