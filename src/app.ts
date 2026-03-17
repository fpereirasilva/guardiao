import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { cepRoutes } from './modules/cep/cep.routes.js'
import { documentRoutes } from './modules/document/document.routes.js'
import { errorHandler } from './shared/middleware/error-handler.js'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  })

  // Plugins
  await app.register(cors, { origin: true })
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Brasil Services API',
        description: 'API unificada de serviços brasileiros — CEP, CPF, CNPJ',
        version: '1.0.0',
      },
      tags: [
        { name: 'CEP', description: 'Consulta de endereço por CEP' },
        { name: 'Documentos', description: 'Validação de CPF e CNPJ' },
        { name: 'Health', description: 'Status da API' },
      ],
    },
  })
  await app.register(swaggerUi, {
    routePrefix: '/docs',
  })

  // Error handler
  app.setErrorHandler(errorHandler)

  // Health check
  app.get('/api/health', {
    schema: {
      description: 'Verifica o status da API',
      tags: ['Health'],
    },
    handler: async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }),
  })

  // Módulos
  await app.register(cepRoutes)
  await app.register(documentRoutes)

  return app
}
