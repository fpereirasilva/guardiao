import { useState } from 'react'
import { HiMapPin, HiMagnifyingGlass } from 'react-icons/hi2'
import { api, type CepData } from '../api'

export default function CepPage() {
  const [cep, setCep] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CepData | null>(null)
  const [error, setError] = useState('')

  function formatCepInput(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return digits
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length !== 8) return

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await api.lookupCep(cleaned)
      if (res.success) {
        setResult(res.data)
      } else {
        setError(res.error?.message || 'CEP não encontrado.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  const isCached = result?.service?.includes('cache')

  return (
    <div className="card">
      <h2 className="card-title"><HiMapPin /> Consulta CEP</h2>
      <p className="card-description">
        Digite um CEP para buscar o endereço. A consulta usa múltiplos serviços com fallback automático.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="cep">CEP</label>
          <input
            id="cep"
            className="form-input"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(formatCepInput(e.target.value))}
            maxLength={9}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || cep.replace(/\D/g, '').length !== 8}>
          {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Consultar</>}
        </button>
      </form>

      {result && (
        <div className="result result-success">
          <div className="result-row">
            <span className="result-label">CEP</span>
            <span className="result-value">
              {result.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
              {isCached && <span className="result-badge badge-cached">cache</span>}
            </span>
          </div>
          <div className="result-row">
            <span className="result-label">Logradouro</span>
            <span className="result-value">{result.street || '—'}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Bairro</span>
            <span className="result-value">{result.neighborhood || '—'}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Cidade</span>
            <span className="result-value">{result.city}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Estado</span>
            <span className="result-value">{result.state}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Serviço</span>
            <span className="result-value" style={{ fontSize: '0.8rem' }}>{result.service}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="result result-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
