import { useState } from 'react'
import { HiIdentification, HiCheck, HiXMark } from 'react-icons/hi2'
import { api, type CpfData } from '../api'

export default function CpfPage() {
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CpfData | null>(null)
  const [error, setError] = useState('')

  function formatCpfInput(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length > 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    if (digits.length > 6) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    if (digits.length > 3) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    return digits
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length !== 11) return

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await api.validateCpf(cleaned)
      setResult(res.data)
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiIdentification /> Validar CPF</h2>
      <p className="card-description">
        Digite um CPF para verificar se é válido. A validação usa o algoritmo oficial de dígitos verificadores.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            className="form-input"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCpfInput(e.target.value))}
            maxLength={14}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || cpf.replace(/\D/g, '').length !== 11}>
          {loading ? <span className="spinner" /> : <>Validar CPF</>}
        </button>
      </form>

      {result && (
        <div className={`result ${result.valid ? 'result-success' : 'result-error'}`}>
          <div className="result-row">
            <span className="result-label">CPF</span>
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
