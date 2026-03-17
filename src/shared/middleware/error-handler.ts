import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/index.js'

export function errorHandler(
  error: Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        message: error.message,
        service: error.service,
      },
    })
  }

  // Fastify validation errors
  if ('validation' in error) {
    return reply.status(400).send({
      success: false,
      error: {
        message: error.message,
      },
    })
  }

  console.error('Unhandled error:', error)
  return reply.status(500).send({
    success: false,
    error: {
      message: 'Erro interno do servidor',
    },
  })
}
