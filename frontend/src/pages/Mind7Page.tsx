import { useState, useEffect } from 'react'
import { HiMapPin, HiMagnifyingGlass, HiSignal, HiXMark, HiPhone, HiGlobeAlt, HiTag } from 'react-icons/hi2'
import { api } from '../api'
import type { Mind7Equipment, Mind7Category, Mind7SearchResult } from '../api'

export default function Mind7Page() {
  const [status, setStatus] = useState<{ online: boolean; baseUrl: string } | null>(null)
  const [equipments, setEquipments] = useState<Mind7Equipment[]>([])
  const [categories, setCategories] = useState<Mind7Category[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Mind7SearchResult | null>(null)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [selected, setSelected] = useState<Mind7Equipment | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    try {
      const res = await api.mind7Status()
      if (res.success) {
        setStatus(res.data)
        if (res.data.online) {
          loadData()
        }
      }
    } catch {
      setStatus({ online: false, baseUrl: '' })
    }
  }

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [eqRes, catRes] = await Promise.all([
        api.mind7Equipments(true),
        api.mind7Categories(),
      ])
      if (eqRes.success) setEquipments(eqRes.data)
      if (catRes.success) setCategories(catRes.data)
    } catch {
      setError('Erro ao carregar dados do Mind7.')
    }
    setLoading(false)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim().length < 2) return
    setLoadingSearch(true)
    setSearchResults(null)
    setError('')
    try {
      const res = await api.mind7Search(search.trim())
      if (res.success) setSearchResults(res.data)
      else setError(res.error?.message || 'Erro na busca.')
    } catch {
      setError('Erro de conexão.')
    }
    setLoadingSearch(false)
  }

  async function handleDetail(id: string) {
    try {
      const res = await api.mind7Equipment(id, true)
      if (res.success) setSelected(res.data)
    } catch { /* ignore */ }
  }

  const displayList = searchResults ? searchResults.results : equipments

  return (
    <div className="card">
      <h2 className="card-title"><HiMapPin /> Mapa Mind7</h2>
      <p className="card-description">
        Mapeamento de equipamentos e pontos de apoio à saúde mental.
      </p>

      {/* Status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
        padding: '8px 12px', borderRadius: 8, background: 'var(--bg-secondary)',
        fontSize: '0.85rem',
      }}>
        <HiSignal style={{ color: status?.online ? 'var(--success)' : 'var(--error)' }} />
        <span style={{ color: status?.online ? 'var(--success)' : 'var(--error)' }}>
          {status === null ? 'Verificando...' : status.online ? 'Mind7 Online' : 'Mind7 Offline'}
        </span>
        {status && (
          <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', fontSize: '0.75rem' }}>
            {status.baseUrl}
          </span>
        )}
        {status && !status.online && (
          <button className="btn-outline" onClick={checkStatus} style={{ padding: '4px 10px', fontSize: '0.75rem', marginLeft: 8 }}>
            Reconectar
          </button>
        )}
      </div>

      {!status?.online && (
        <div className="result result-error">
          <p>Para usar esta funcionalidade, uma instância do Mapa Mind7 precisa estar em execução.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Configure a variável de ambiente <strong>MIND7_API_URL</strong> no backend com o endereço da instância.
          </p>
        </div>
      )}

      {status?.online && (
        <>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <HiMagnifyingGlass style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                <input
                  className="form-input"
                  placeholder="Buscar equipamentos (mín. 2 caracteres)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loadingSearch} style={{ width: 'auto', padding: '10px 20px' }}>
                {loadingSearch ? <span className="spinner" /> : 'Buscar'}
              </button>
              {searchResults && (
                <button className="btn-outline" onClick={() => { setSearchResults(null); setSearch('') }} style={{ padding: '10px 14px' }}>
                  <HiXMark />
                </button>
              )}
            </div>
          </form>

          {/* Categories */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {categories.map(c => (
                <span key={c.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 16,
                  fontSize: '0.75rem', color: 'var(--text-muted)',
                }}>
                  <HiTag style={{ fontSize: '0.7rem' }} /> {c.name}
                </span>
              ))}
            </div>
          )}

          {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>}
          {error && <div className="result result-error"><p>{error}</p></div>}

          {searchResults && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              {searchResults.total} resultado(s) para "{search}"
            </div>
          )}

          {/* Equipment List */}
          {!loading && displayList.length > 0 && (
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              {displayList.map(eq => (
                <div
                  key={eq.id}
                  onClick={() => handleDetail(eq.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleDetail(eq.id)}
                  style={{
                    padding: 12, borderRadius: 8, marginBottom: 8,
                    background: 'var(--bg-secondary)', cursor: 'pointer',
                    border: selected?.id === eq.id ? '1px solid var(--primary)' : '1px solid transparent',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>{eq.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        <HiMapPin style={{ verticalAlign: 'middle' }} /> {eq.address}
                      </div>
                    </div>
                    {eq.category && (
                      <span style={{
                        background: 'var(--primary)', color: '#fff',
                        padding: '2px 8px', borderRadius: 12, fontSize: '0.7rem',
                      }}>
                        {eq.category.name}
                      </span>
                    )}
                  </div>
                  {eq.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
                      {eq.description.length > 120 ? eq.description.slice(0, 120) + '...' : eq.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && displayList.length === 0 && !error && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
              Nenhum equipamento encontrado.
            </div>
          )}

          {/* Detail Panel */}
          {selected && (
            <div className="result result-success" style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selected.name}</h3>
                <button className="btn-outline" onClick={() => setSelected(null)} style={{ padding: '4px 8px' }}>
                  <HiXMark />
                </button>
              </div>

              <div className="result-row"><span className="result-label"><HiMapPin /> Endereço</span><span className="result-value">{selected.address}</span></div>
              <div className="result-row"><span className="result-label">Coordenadas</span><span className="result-value">{selected.latitude}, {selected.longitude}</span></div>
              {selected.description && (
                <div className="result-row"><span className="result-label">Descrição</span><span className="result-value" style={{ fontSize: '0.85rem' }}>{selected.description}</span></div>
              )}
              {selected.website && (
                <div className="result-row">
                  <span className="result-label"><HiGlobeAlt /> Website</span>
                  <a href={selected.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{selected.website}</a>
                </div>
              )}
              {selected.phone_number && (
                <div className="result-row"><span className="result-label"><HiPhone /> Telefone</span><span className="result-value">{selected.phone_number}</span></div>
              )}
              {selected.category && (
                <div className="result-row"><span className="result-label"><HiTag /> Categoria</span><span className="result-value">{selected.category.name}</span></div>
              )}
              {selected.types && selected.types.length > 0 && (
                <div className="result-row">
                  <span className="result-label">Tipos</span>
                  <span className="result-value">
                    {selected.types.map(t => t.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
