export class AppError extends Error {
  public readonly statusCode: number
  public readonly service?: string

  constructor(message: string, statusCode: number = 500, service?: string) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.service = service
  }
}

export class ServiceError extends AppError {
  constructor(message: string, service: string) {
    super(message, 502, service)
    this.name = 'ServiceError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}
