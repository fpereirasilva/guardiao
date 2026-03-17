import { useState } from 'react'
import { HiCloudArrowDown, HiMagnifyingGlass } from 'react-icons/hi2'
import { api } from '../api'
import type { WeatherData } from '../api'

const CAPITAIS: Record<string, [number, number]> = {
  'São Paulo': [-23.55, -46.63],
  'Rio de Janeiro': [-22.91, -43.17],
  'Brasília': [-15.78, -47.93],
  'Salvador': [-12.97, -38.51],
  'Belo Horizonte': [-19.92, -43.94],
  'Curitiba': [-25.43, -49.27],
  'Manaus': [-3.12, -60.02],
  'Recife': [-8.05, -34.87],
  'Porto Alegre': [-30.03, -51.23],
  'Fortaleza': [-3.72, -38.52],
}

export default function ClimaPage() {
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!lat || !lon) return
    await fetchWeather(Number(lat), Number(lon))
  }

  async function fetchWeather(latitude: number, longitude: number) {
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await api.getWeather(latitude, longitude)
      if (res.success) {
        setResult(res.data)
      } else {
        setError(res.error?.message || 'Erro ao buscar clima.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  function selectCapital(name: string) {
    const [la, lo] = CAPITAIS[name]
    setLat(String(la))
    setLon(String(lo))
    fetchWeather(la, lo)
  }

  function formatDate(d: string) {
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiCloudArrowDown /> Previsão do Tempo</h2>
      <p className="card-description">
        Consulte o clima atual e previsão de 7 dias por coordenadas. Selecione uma capital ou digite latitude/longitude.
      </p>

      <div className="form-group">
        <label className="form-label">Capitais</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.keys(CAPITAIS).map(c => (
            <button key={c} className="btn btn-outline" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => selectCapital(c)} type="button">
              {c}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="lat">Latitude</label>
            <input id="lat" className="form-input" type="number" step="any" placeholder="-23.55" value={lat} onChange={e => setLat(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="lon">Longitude</label>
            <input id="lon" className="form-input" type="number" step="any" placeholder="-46.63" value={lon} onChange={e => setLon(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || !lat || !lon}>
          {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Consultar</>}
        </button>
      </form>

      {result && (
        <div className="result result-success">
          <div className="result-row"><span className="result-label">Temperatura</span><span className="result-value" style={{ fontSize: '1.3rem' }}>{result.temperature}°C</span></div>
          <div className="result-row"><span className="result-label">Condição</span><span className="result-value">{result.description}</span></div>
          <div className="result-row"><span className="result-label">Umidade</span><span className="result-value">{result.humidity}%</span></div>
          <div className="result-row"><span className="result-label">Vento</span><span className="result-value">{result.windspeed} km/h</span></div>

          {result.daily.length > 0 && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0' }} />
              <span className="result-label" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Previsão 7 dias</span>
              {result.daily.map(d => (
                <div className="result-row" key={d.date}>
                  <span className="result-value" style={{ fontFamily: 'inherit', fontWeight: 400, width: 80 }}>{formatDate(d.date)}</span>
                  <span className="result-value" style={{ fontSize: '0.85rem', flex: 1 }}>{d.description}</span>
                  <span className="result-value" style={{ fontSize: '0.85rem' }}>{d.tempMin}° / {d.tempMax}°</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {error && <div className="result result-error"><p>{error}</p></div>}
    </div>
  )
}
