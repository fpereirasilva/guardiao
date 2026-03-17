import { useState } from 'react'
import { HiGlobeAlt, HiMagnifyingGlass } from 'react-icons/hi2'
import { api } from '../api'
import type { IpInfo } from '../api'

export default function IpInfoPage() {
  const [ip, setIp] = useState('')
  const [result, setResult] = useState<IpInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = ip.trim()
    if (!trimmed) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await api.lookupIp(trimmed)
      if (res.success) setResult(res.data)
      else setError(res.error?.message || 'IP inválido ou não encontrado.')
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  const EXAMPLES = ['8.8.8.8', '1.1.1.1', '208.67.222.222', '200.221.2.45']

  return (
    <div className="card">
      <h2 className="card-title"><HiGlobeAlt /> Geolocalização IP</h2>
      <p className="card-description">
        Descubra localização, ISP e fuso horário de qualquer endereço IP.
      </p>

      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label className="form-label">Endereço IP</label>
          <input
            className="form-input"
            placeholder="Ex: 8.8.8.8"
            value={ip}
            onChange={e => setIp(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Consultar</>}
        </button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            className="btn-outline"
            onClick={() => { setIp(ex); }}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            {ex}
          </button>
        ))}
      </div>

      {error && <div className="result result-error" style={{ marginTop: 16 }}><p>{error}</p></div>}

      {result && (
        <div className="result result-success" style={{ marginTop: 16 }}>
          <div className="result-row"><span className="result-label">IP</span><span className="result-value">{result.ip}</span></div>
          <div className="result-row"><span className="result-label">País</span><span className="result-value">{result.country} ({result.countryCode})</span></div>
          <div className="result-row"><span className="result-label">Região</span><span className="result-value">{result.region}</span></div>
          <div className="result-row"><span className="result-label">Cidade</span><span className="result-value">{result.city}</span></div>
          <div className="result-row"><span className="result-label">Coordenadas</span><span className="result-value">{result.latitude}, {result.longitude}</span></div>
          <div className="result-row"><span className="result-label">Fuso horário</span><span className="result-value">{result.timezone}</span></div>
          <div className="result-row"><span className="result-label">ISP</span><span className="result-value">{result.isp}</span></div>
        </div>
      )}
    </div>
  )
}
