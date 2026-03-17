import { buildApp } from './app.js'

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || '0.0.0.0'

async function main() {
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    console.log(`\n🇧🇷 Brasil Services API rodando em http://localhost:${PORT}`)
    console.log(`📚 Documentação: http://localhost:${PORT}/docs\n`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
