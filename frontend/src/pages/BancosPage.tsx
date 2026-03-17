import { useState, useEffect } from 'react'
import { HiBanknotes, HiMagnifyingGlass } from 'react-icons/hi2'
import { api, type Bank } from '../api'

export default function BancosPage() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.listBanks()
      .then(res => {
        if (res.success) setBanks(res.data)
        else setError('Erro ao carregar bancos.')
      })
      .catch(() => setError('Erro de conexão com o servidor.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = banks.filter(b => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.name?.toLowerCase().includes(q) ||
      b.fullName?.toLowerCase().includes(q) ||
      String(b.code).includes(q)
    )
  })

  return (
    <div className="card">
      <h2 className="card-title"><HiBanknotes /> Bancos do Brasil</h2>
      <p className="card-description">
        Lista completa de bancos brasileiros registrados no Banco Central.
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="search">Filtrar</label>
        <div style={{ position: 'relative' }}>
          <input
            id="search"
            className="form-input"
            type="text"
            placeholder="Nome ou código do banco..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <HiMagnifyingGlass style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <span className="spinner" style={{ display: 'inline-block' }} />
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="result result-success" style={{ marginTop: 8 }}>
          <div className="result-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="result-label" style={{ fontWeight: 600, width: 60 }}>Código</span>
            <span className="result-label" style={{ fontWeight: 600, flex: 1 }}>Nome</span>
          </div>
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {filtered.map(b => (
              <div className="result-row" key={b.ispb}>
                <span className="result-value" style={{ width: 60 }}>{b.code ?? '—'}</span>
                <span className="result-value" style={{ fontFamily: 'inherit', fontWeight: 400, flex: 1 }}>{b.name || b.fullName}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Exibindo {filtered.length} de {banks.length} bancos
          </div>
        </div>
      )}

      {error && (
        <div className="result result-error"><p>{error}</p></div>
      )}
    </div>
  )
}
