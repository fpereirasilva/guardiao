import { useState } from 'react'
import { HiCurrencyDollar, HiMagnifyingGlass, HiArrowsRightLeft } from 'react-icons/hi2'
import { api } from '../api'
import type { ExchangeRates, ExchangeConversion } from '../api'

const MOEDAS = ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'ARS', 'MXN']

export default function CambioPage() {
  const [base, setBase] = useState('BRL')
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [loadingRates, setLoadingRates] = useState(false)

  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('BRL')
  const [amount, setAmount] = useState('1')
  const [conversion, setConversion] = useState<ExchangeConversion | null>(null)
  const [loadingConvert, setLoadingConvert] = useState(false)
  const [error, setError] = useState('')

  async function handleFetchRates() {
    setLoadingRates(true)
    setRates(null)
    setError('')
    try {
      const res = await api.getExchangeRates(base)
      if (res.success) setRates(res.data)
      else setError(res.error?.message || 'Erro ao buscar taxas.')
    } catch { setError('Erro de conexão.') }
    setLoadingRates(false)
  }

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    setLoadingConvert(true)
    setConversion(null)
    setError('')
    try {
      const res = await api.convertCurrency(from, to, Number(amount))
      if (res.success) setConversion(res.data)
      else setError(res.error?.message || 'Erro na conversão.')
    } catch { setError('Erro de conexão.') }
    setLoadingConvert(false)
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiCurrencyDollar /> Câmbio de Moedas</h2>
      <p className="card-description">
        Taxas de câmbio atualizadas e conversor de moedas (Frankfurter/BCE).
      </p>

      <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>Taxas de Câmbio</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select className="form-input" value={base} onChange={e => setBase(e.target.value)} style={{ flex: 1 }}>
          {MOEDAS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleFetchRates} disabled={loadingRates}>
          {loadingRates ? <span className="spinner" /> : <><HiMagnifyingGlass /> Buscar</>}
        </button>
      </div>

      {rates && (
        <div className="result result-success" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Base: {rates.base} — {rates.date}</div>
          <div style={{ maxHeight: 250, overflowY: 'auto' }}>
            {Object.entries(rates.rates).sort().map(([currency, rate]) => (
              <div className="result-row" key={currency}>
                <span className="result-value" style={{ fontFamily: 'inherit', fontWeight: 500 }}>{currency}</span>
                <span className="result-value">{rate.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      <h3 style={{ fontSize: '1rem', marginBottom: 12 }}><HiArrowsRightLeft style={{ verticalAlign: 'middle' }} /> Converter</h3>
      <form onSubmit={handleConvert}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Valor</label>
            <input className="form-input" type="number" step="any" min="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">De</label>
            <select className="form-input" value={from} onChange={e => setFrom(e.target.value)}>
              {MOEDAS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Para</label>
            <select className="form-input" value={to} onChange={e => setTo(e.target.value)}>
              {MOEDAS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loadingConvert}>
          {loadingConvert ? <span className="spinner" /> : 'Converter'}
        </button>
      </form>

      {conversion && (
        <div className="result result-success">
          <div className="result-row">
            <span className="result-label">{conversion.amount} {conversion.from}</span>
            <span className="result-value" style={{ fontSize: '1.2rem', color: 'var(--success)' }}>
              {conversion.result.toFixed(2)} {conversion.to}
            </span>
          </div>
          <div className="result-row">
            <span className="result-label">Taxa</span>
            <span className="result-value">{conversion.rate.toFixed(6)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Data</span>
            <span className="result-value" style={{ fontSize: '0.8rem' }}>{conversion.date}</span>
          </div>
        </div>
      )}

      {error && <div className="result result-error"><p>{error}</p></div>}
    </div>
  )
}
