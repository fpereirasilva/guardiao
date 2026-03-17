import { buildApp } from './app.js'
import type { IncomingMessage, ServerResponse } from 'http'

let app: Awaited<ReturnType<typeof buildApp>> | null = null

async function getApp() {
  if (!app) {
    app = await buildApp()
    await app.ready()
  }
  return app
}

function collectBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const fastify = await getApp()

  const body = ['GET', 'HEAD', 'OPTIONS'].includes(req.method || 'GET')
    ? undefined
    : await collectBody(req)

  const response = await fastify.inject({
    method: req.method as any,
    url: req.url || '/',
    headers: req.headers as Record<string, string>,
    payload: body,
  })

  const headers = response.headers
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      res.setHeader(key, value as string)
    }
  }
  res.statusCode = response.statusCode
  res.end(response.body)
}
