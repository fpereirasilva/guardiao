import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { cepRoutes } from './modules/cep/cep.routes.js'
import { documentRoutes } from './modules/document/document.routes.js'
import { cnpjRoutes } from './modules/cnpj/cnpj.routes.js'
import { ibgeRoutes } from './modules/ibge/ibge.routes.js'
import { fipeRoutes } from './modules/fipe/fipe.routes.js'
import { feriadosRoutes } from './modules/feriados/feriados.routes.js'
import { dddRoutes } from './modules/ddd/ddd.routes.js'
import { generatorRoutes } from './modules/generator/generator.routes.js'
import { banksRoutes } from './modules/banks/banks.routes.js'
import { weatherRoutes } from './modules/weather/weather.routes.js'
import { exchangeRoutes } from './modules/exchange/exchange.routes.js'
import { cryptoRoutes } from './modules/crypto/crypto.routes.js'
import { dictionaryRoutes } from './modules/dictionary/dictionary.routes.js'
import { animalsRoutes } from './modules/animals/animals.routes.js'
import { ipinfoRoutes } from './modules/ipinfo/ipinfo.routes.js'
import { mind7Routes } from './modules/mind7/mind7.routes.js'
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
        title: 'Guardião API',
        description: 'API unificada — serviços brasileiros, clima, câmbio, cripto, dicionário e mais',
        version: '3.0.0',
      },
      tags: [
        { name: 'CEP', description: 'Consulta de endereço por CEP' },
        { name: 'Documentos', description: 'Validação de CPF e CNPJ' },
        { name: 'CNPJ', description: 'Consulta de dados de empresa por CNPJ' },
        { name: 'IBGE', description: 'Estados e municípios' },
        { name: 'FIPE', description: 'Tabela FIPE de veículos' },
        { name: 'Feriados', description: 'Feriados nacionais' },
        { name: 'DDD', description: 'Consulta de DDD' },
        { name: 'Gerador', description: 'Gerador de CPF/CNPJ válidos' },
        { name: 'Bancos', description: 'Lista de bancos brasileiros' },
        { name: 'Clima', description: 'Previsão do tempo (Open-Meteo)' },
        { name: 'Câmbio', description: 'Taxas de câmbio (Frankfurter)' },
        { name: 'Criptomoedas', description: 'Preços de criptomoedas (CoinCap)' },
        { name: 'Dicionário', description: 'Definições de palavras (Free Dictionary)' },
        { name: 'Animais', description: 'Fotos de cães e fatos sobre gatos' },
        { name: 'IP Info', description: 'Geolocalização por IP' },
        { name: 'Mind7', description: 'Mapa Mind7 — equipamentos de saúde mental' },
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
      services: [
        'cep', 'cpf', 'cnpj', 'ibge', 'fipe', 'feriados', 'ddd', 'generator', 'banks',
        'weather', 'exchange', 'crypto', 'dictionary', 'animals', 'ipinfo', 'mind7',
      ],
    }),
  })

  // Módulos — Serviços Brasileiros
  await app.register(cepRoutes)
  await app.register(documentRoutes)
  await app.register(cnpjRoutes)
  await app.register(ibgeRoutes)
  await app.register(fipeRoutes)
  await app.register(feriadosRoutes)
  await app.register(dddRoutes)
  await app.register(generatorRoutes)
  await app.register(banksRoutes)

  // Módulos — APIs Públicas
  await app.register(weatherRoutes)
  await app.register(exchangeRoutes)
  await app.register(cryptoRoutes)
  await app.register(dictionaryRoutes)
  await app.register(animalsRoutes)
  await app.register(ipinfoRoutes)

  // Módulos — Mind7 (proxy)
  await app.register(mind7Routes)

  return app
}
