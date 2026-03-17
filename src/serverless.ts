import { buildApp } from './app.js'
import type { IncomingMessage, ServerResponse } from 'http'

let handler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null

async function getHandler() {
  if (!handler) {
    const app = await buildApp()
    await app.ready()
    handler = (req: IncomingMessage, res: ServerResponse) => {
      app.server.emit('request', req, res)
    }
  }
  return handler
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const h = await getHandler()
  h(req, res)
}
