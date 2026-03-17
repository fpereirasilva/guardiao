import { useState, useEffect } from 'react'
import { HiCircleStack, HiArrowTrendingUp, HiArrowTrendingDown, HiMagnifyingGlass } from 'react-icons/hi2'
import { api } from '../api'
import type { CryptoListItem, CryptoDetail } from '../api'

export default function CryptoPage() {
  const [list, setList] = useState<CryptoListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<CryptoDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadList()
  }, [])

  async function loadList() {
    setLoading(true)
    setError('')
    try {
      const res = await api.getCryptoList()
      if (res.success) setList(res.data)
      else setError(res.error?.message || 'Erro ao buscar criptomoedas.')
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  async function handleDetail(id: string) {
    setLoadingDetail(true)
    setDetail(null)
    try {
      const res = await api.getCryptoDetail(id)
      if (res.success) setDetail(res.data)
    } catch { /* ignore */ }
    setLoadingDetail(false)
  }

  const filtered = list.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="card">
      <h2 className="card-title"><HiCircleStack /> Criptomoedas</h2>
      <p className="card-description">
        Top 50 criptomoedas com preços em tempo real (CoinCap).
      </p>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <HiMagnifyingGlass style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
        <input
          className="form-input"
          placeholder="Filtrar por nome ou símbolo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 36 }}
        />
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>}
      {error && <div className="result result-error"><p>{error}</p></div>}

      {!loading && filtered.length > 0 && (
        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px' }}>#</th>
                <th style={{ padding: '8px 4px' }}>Nome</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Preço (USD)</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>24h</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const change = parseFloat(c.changePercent24h)
                const positive = change >= 0
                return (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => handleDetail(c.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleDetail(c.id)}
                  >
                    <td style={{ padding: '8px 4px', color: 'var(--text-muted)' }}>{c.rank}</td>
                    <td style={{ padding: '8px 4px' }}>
                      <strong>{c.symbol}</strong>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'right', fontFamily: 'monospace' }}>
                      ${parseFloat(c.priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'right', color: positive ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      {positive ? <HiArrowTrendingUp /> : <HiArrowTrendingDown />}
                      {change.toFixed(2)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {loadingDetail && <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" /></div>}

      {detail && (
        <div className="result result-success" style={{ marginTop: 16 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>{detail.name} ({detail.symbol})</h3>
          <div className="result-row"><span className="result-label">Preço (USD)</span><span className="result-value">${parseFloat(detail.priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          {detail.priceBrl != null && (
            <div className="result-row"><span className="result-label">Preço (BRL)</span><span className="result-value" style={{ color: 'var(--success)' }}>R$ {parseFloat(detail.priceBrl).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          )}
          <div className="result-row"><span className="result-label">Variação 24h</span><span className="result-value" style={{ color: parseFloat(detail.changePercent24h) >= 0 ? 'var(--success)' : 'var(--error)' }}>{parseFloat(detail.changePercent24h).toFixed(2)}%</span></div>
          <div className="result-row"><span className="result-label">Market Cap</span><span className="result-value">${(parseFloat(detail.marketCapUsd) / 1e9).toFixed(2)}B</span></div>
          <div className="result-row"><span className="result-label">Volume 24h</span><span className="result-value">${(parseFloat(detail.volumeUsd24h) / 1e6).toFixed(1)}M</span></div>
          <div className="result-row"><span className="result-label">Supply</span><span className="result-value">{parseFloat(detail.supply).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span></div>
        </div>
      )}
    </div>
  )
}
