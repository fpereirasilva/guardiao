import { useState, useEffect } from 'react'
import { HiGlobeAmericas, HiMagnifyingGlass } from 'react-icons/hi2'
import { api, type Estado, type Municipio } from '../api'

export default function IbgePage() {
  const [estados, setEstados] = useState<Estado[]>([])
  const [selectedUf, setSelectedUf] = useState('')
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.listEstados().then(res => {
      if (res.success) setEstados(res.data)
    })
  }, [])

  async function handleSearch() {
    if (!selectedUf) return
    setLoading(true)
    setMunicipios([])
    setError('')

    try {
      const res = await api.listMunicipios(selectedUf)
      if (res.success) {
        setMunicipios(res.data)
      } else {
        setError(res.error?.message || 'Erro ao buscar municípios.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiGlobeAmericas /> IBGE — Estados e Municípios</h2>
      <p className="card-description">
        Selecione um estado para listar seus municípios.
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="uf">Estado</label>
        <select
          id="uf"
          className="form-input"
          value={selectedUf}
          onChange={(e) => setSelectedUf(e.target.value)}
        >
          <option value="">Selecione um estado...</option>
          {estados
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map(e => (
              <option key={e.sigla} value={e.sigla}>{e.nome} ({e.sigla})</option>
            ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !selectedUf}>
        {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Buscar Municípios</>}
      </button>

      {municipios.length > 0 && (
        <div className="result result-success">
          <div className="result-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="result-label" style={{ fontWeight: 600 }}>Município</span>
            <span className="result-label" style={{ fontWeight: 600 }}>Código IBGE</span>
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {municipios.map(m => (
              <div className="result-row" key={m.codigo_ibge || m.nome}>
                <span className="result-value" style={{ fontFamily: 'inherit', fontWeight: 400 }}>{m.nome}</span>
                <span className="result-value" style={{ fontSize: '0.85rem' }}>{m.codigo_ibge || '—'}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total: {municipios.length} municípios
          </div>
        </div>
      )}

      {error && (
        <div className="result result-error"><p>{error}</p></div>
      )}
    </div>
  )
}
