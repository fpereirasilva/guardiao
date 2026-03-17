import { useState } from 'react'
import { HiBuildingOffice2, HiCheck, HiXMark } from 'react-icons/hi2'
import { api, type CnpjData } from '../api'

export default function CnpjPage() {
  const [cnpj, setCnpj] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CnpjData | null>(null)
  const [error, setError] = useState('')

  function formatCnpjInput(value: string) {
    const d = value.replace(/\D/g, '').slice(0, 14)
    if (d.length > 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`
    if (d.length > 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`
    if (d.length > 5) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`
    if (d.length > 2) return `${d.slice(0,2)}.${d.slice(2)}`
    return d
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = cnpj.replace(/\D/g, '')
    if (cleaned.length !== 14) return

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await api.validateCnpj(cleaned)
      setResult(res.data)
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiBuildingOffice2 /> Validar CNPJ</h2>
      <p className="card-description">
        Digite um CNPJ para verificar se é válido. A validação usa o algoritmo oficial de dígitos verificadores.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="cnpj">CNPJ</label>
          <input
            id="cnpj"
            className="form-input"
            type="text"
            inputMode="numeric"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={(e) => setCnpj(formatCnpjInput(e.target.value))}
            maxLength={18}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || cnpj.replace(/\D/g, '').length !== 14}>
          {loading ? <span className="spinner" /> : <>Validar CNPJ</>}
        </button>
      </form>

      {result && (
        <div className={`result ${result.valid ? 'result-success' : 'result-error'}`}>
          <div className="result-row">
            <span className="result-label">CNPJ</span>
            <span className="result-value">{result.formatted}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Situação</span>
            <span className="result-value">
              {result.valid ? (
                <span className="result-badge badge-valid"><HiCheck /> Válido</span>
              ) : (
                <span className="result-badge badge-invalid"><HiXMark /> Inválido</span>
              )}
            </span>
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
