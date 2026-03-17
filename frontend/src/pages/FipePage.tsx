import { useState } from 'react'
import { HiTruck, HiMagnifyingGlass } from 'react-icons/hi2'
import { api, type FipeMarca, type FipePreco } from '../api'

type TipoVeiculo = 'carros' | 'motos' | 'caminhoes'

export default function FipePage() {
  const [tipo, setTipo] = useState<TipoVeiculo>('carros')
  const [marcas, setMarcas] = useState<FipeMarca[]>([])
  const [codigo, setCodigo] = useState('')
  const [precos, setPrecos] = useState<FipePreco[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingPreco, setLoadingPreco] = useState(false)
  const [error, setError] = useState('')

  async function handleBuscarMarcas() {
    setLoading(true)
    setMarcas([])
    setPrecos([])
    setError('')

    try {
      const res = await api.listMarcasFipe(tipo)
      if (res.success) {
        setMarcas(res.data)
      } else {
        setError(res.error?.message || 'Erro ao buscar marcas.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  async function handleBuscarPreco(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo.trim()) return
    setLoadingPreco(true)
    setPrecos([])
    setError('')

    try {
      const res = await api.lookupPrecoFipe(codigo.trim())
      if (res.success) {
        setPrecos(res.data)
      } else {
        setError(res.error?.message || 'Código FIPE não encontrado.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoadingPreco(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiTruck /> Tabela FIPE</h2>
      <p className="card-description">
        Consulte marcas de veículos ou busque o preço por código FIPE.
      </p>

      <div className="form-group">
        <label className="form-label">Tipo de veículo</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['carros', 'motos', 'caminhoes'] as const).map(t => (
            <button
              key={t}
              className={`btn ${tipo === t ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1 }}
              onClick={() => setTipo(t)}
              type="button"
            >
              {t === 'carros' ? 'Carros' : t === 'motos' ? 'Motos' : 'Caminhões'}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleBuscarMarcas} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Listar Marcas</>}
      </button>

      {marcas.length > 0 && (
        <div className="result result-success" style={{ marginTop: 0 }}>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {marcas.map(m => (
              <div className="result-row" key={m.valor}>
                <span className="result-value" style={{ fontFamily: 'inherit', fontWeight: 400 }}>{m.nome}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total: {marcas.length} marcas
          </div>
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      <h3 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Consulta por Código FIPE</h3>
      <form onSubmit={handleBuscarPreco}>
        <div className="form-group">
          <label className="form-label" htmlFor="fipe-code">Código FIPE</label>
          <input
            id="fipe-code"
            className="form-input"
            type="text"
            placeholder="001004-9"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loadingPreco || !codigo.trim()}>
          {loadingPreco ? <span className="spinner" /> : <><HiMagnifyingGlass /> Consultar Preço</>}
        </button>
      </form>

      {precos.length > 0 && (
        <div className="result result-success">
          {precos.map((p, i) => (
            <div key={i} style={{ marginBottom: i < precos.length - 1 ? 16 : 0 }}>
              <div className="result-row"><span className="result-label">Marca</span><span className="result-value">{p.marca}</span></div>
              <div className="result-row"><span className="result-label">Modelo</span><span className="result-value">{p.modelo}</span></div>
              <div className="result-row"><span className="result-label">Ano</span><span className="result-value">{p.anoModelo}</span></div>
              <div className="result-row"><span className="result-label">Combustível</span><span className="result-value">{p.combustivel}</span></div>
              <div className="result-row"><span className="result-label">Código FIPE</span><span className="result-value">{p.codigoFipe}</span></div>
              <div className="result-row"><span className="result-label">Valor</span><span className="result-value" style={{ color: 'var(--success)', fontSize: '1.1rem' }}>{p.valor}</span></div>
              <div className="result-row"><span className="result-label">Referência</span><span className="result-value" style={{ fontSize: '0.8rem' }}>{p.mesReferencia}</span></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="result result-error"><p>{error}</p></div>
      )}
    </div>
  )
}
