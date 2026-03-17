import { useState } from 'react'
import { HiPhone, HiMagnifyingGlass } from 'react-icons/hi2'
import { api, type DddData } from '../api'

export default function DddPage() {
  const [ddd, setDdd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DddData | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = ddd.replace(/\D/g, '')
    if (cleaned.length < 2) return

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await api.lookupDdd(cleaned)
      if (res.success) {
        setResult(res.data)
      } else {
        setError(res.error?.message || 'DDD não encontrado.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiPhone /> Consulta DDD</h2>
      <p className="card-description">
        Digite um DDD para descobrir o estado e as cidades atendidas.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="ddd">DDD</label>
          <input
            id="ddd"
            className="form-input"
            type="text"
            inputMode="numeric"
            placeholder="11"
            value={ddd}
            onChange={(e) => setDdd(e.target.value.replace(/\D/g, '').slice(0, 3))}
            maxLength={3}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || ddd.replace(/\D/g, '').length < 2}>
          {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Consultar</>}
        </button>
      </form>

      {result && (
        <div className="result result-success">
          <div className="result-row">
            <span className="result-label">DDD</span>
            <span className="result-value">{result.ddd}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Estado</span>
            <span className="result-value">{result.state}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <span className="result-label" style={{ display: 'block', marginBottom: 8 }}>Cidades ({result.cities.length})</span>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {result.cities.sort().map(c => (
                <div className="result-row" key={c}>
                  <span className="result-value" style={{ fontFamily: 'inherit', fontWeight: 400 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="result result-error"><p>{error}</p></div>
      )}
    </div>
  )
}
