# Brasil Services API

API unificada de serviços brasileiros — CEP, CPF, CNPJ.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/cep/:cep` | Consulta endereço por CEP (multi-provider com fallback) |
| `POST` | `/api/validate/cpf` | Valida CPF (algoritmo dígitos verificadores) |
| `POST` | `/api/validate/cnpj` | Valida CNPJ (algoritmo dígitos verificadores) |
| `GET` | `/api/health` | Health check |
| `GET` | `/docs` | Swagger UI (documentação interativa) |

## Stack

- **Runtime:** Node.js 22+ (fetch nativo)
- **Framework:** Fastify
- **Linguagem:** TypeScript
- **Cache:** In-memory com TTL (CEPs: 24h)
- **Resiliência:** Circuit Breaker por provider
- **Docs:** Swagger/OpenAPI auto-gerado
- **Container:** Docker multi-stage build

## Exemplos

```bash
# CEP
curl http://localhost:3000/api/cep/01001000

# CPF
curl -X POST http://localhost:3000/api/validate/cpf \
  -H "Content-Type: application/json" \
  -d '{"cpf": "529.982.247-25"}'

# CNPJ
curl -X POST http://localhost:3000/api/validate/cnpj \
  -H "Content-Type: application/json" \
  -d '{"cnpj": "11.222.333/0001-81"}'
```

## Rodar localmente

```bash
npm install
npm run dev
```

## Docker

```bash
docker build -t brasil-services .
docker run -p 3000:3000 brasil-services
```

## Providers de CEP

A API consulta múltiplos serviços com fallback automático:

1. **ViaCEP** (primário)
2. **BrasilAPI** (fallback)
3. **OpenCEP** (fallback)

Se o provider primário falhar, o próximo é consultado automaticamente. O Circuit Breaker desabilita temporariamente providers com muitas falhas consecutivas.
