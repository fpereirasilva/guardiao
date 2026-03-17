import { useState } from 'react'
import { HiCalendarDays, HiMagnifyingGlass } from 'react-icons/hi2'
import { api, type Feriado } from '../api'

export default function FeriadosPage() {
  const [ano, setAno] = useState(String(new Date().getFullYear()))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Feriado[]>([])
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(ano)
    if (!n || n < 1900 || n > 2200) return

    setLoading(true)
    setResult([])
    setError('')

    try {
      const res = await api.listFeriados(n)
      if (res.success) {
        setResult(res.data)
      } else {
        setError(res.error?.message || 'Erro ao buscar feriados.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiCalendarDays /> Feriados Nacionais</h2>
      <p className="card-description">
        Consulte os feriados nacionais de qualquer ano.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="ano">Ano</label>
          <input
            id="ano"
            className="form-input"
            type="number"
            placeholder="2025"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            min={1900}
            max={2200}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || !ano}>
          {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Buscar Feriados</>}
        </button>
      </form>

      {result.length > 0 && (
        <div className="result result-success">
          {result.map((f) => (
            <div className="result-row" key={f.date}>
              <span className="result-value" style={{ fontFamily: 'inherit', fontWeight: 400 }}>{f.name}</span>
              <span className="result-value" style={{ fontSize: '0.85rem' }}>{formatDate(f.date)}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total: {result.length} feriados
          </div>
        </div>
      )}

      {error && (
        <div className="result result-error"><p>{error}</p></div>
      )}
    </div>
  )
}
