import { useState } from 'react'
import { HiBookOpen, HiMagnifyingGlass, HiSpeakerWave } from 'react-icons/hi2'
import { api } from '../api'
import type { DictionaryResult } from '../api'

const LANGS = [
  { code: 'en', label: 'Inglês' },
  { code: 'es', label: 'Espanhol' },
  { code: 'fr', label: 'Francês' },
  { code: 'de', label: 'Alemão' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Russo' },
  { code: 'ja', label: 'Japonês' },
  { code: 'ko', label: 'Coreano' },
  { code: 'ar', label: 'Árabe' },
  { code: 'hi', label: 'Hindi' },
  { code: 'tr', label: 'Turco' },
]

export default function DicionarioPage() {
  const [word, setWord] = useState('')
  const [lang, setLang] = useState('en')
  const [result, setResult] = useState<DictionaryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = word.trim()
    if (!trimmed) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await api.lookupWord(trimmed, lang)
      if (res.success) setResult(res.data)
      else setError(res.error?.message || 'Palavra não encontrada.')
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  function playAudio(url: string) {
    new Audio(url).play()
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiBookOpen /> Dicionário</h2>
      <p className="card-description">
        Consulte definições, fonética e sinônimos em vários idiomas (Free Dictionary API).
      </p>

      <form onSubmit={handleSearch}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Palavra</label>
            <input
              className="form-input"
              placeholder="Ex: hello, amour, casa..."
              value={word}
              onChange={e => setWord(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Idioma</label>
            <select className="form-input" value={lang} onChange={e => setLang(e.target.value)}>
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Buscar</>}
        </button>
      </form>

      {error && <div className="result result-error"><p>{error}</p></div>}

      {result && (
        <div className="result result-success">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{result.word}</h3>
            {result.phonetic && (
              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{result.phonetic}</span>
            )}
            {result.audio && (
              <button
                className="btn-outline"
                onClick={() => playAudio(result.audio)}
                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                title="Ouvir pronúncia"
              >
                <HiSpeakerWave />
              </button>
            )}
          </div>

          {result.meanings.map((m, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
                {m.partOfSpeech}
              </div>
              {m.definitions.slice(0, 5).map((d, j) => (
                <div key={j} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: '2px solid var(--border)' }}>
                  <p style={{ margin: 0 }}>{d.definition}</p>
                  {d.example && (
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                      "{d.example}"
                    </p>
                  )}
                </div>
              ))}
              {m.synonyms && m.synonyms.length > 0 && (
                <div style={{ fontSize: '0.85rem', marginTop: 8 }}>
                  <strong>Sinônimos:</strong>{' '}
                  {m.synonyms.slice(0, 8).map((s, k) => (
                    <span key={k} style={{ display: 'inline-block', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4, margin: '2px 4px', fontSize: '0.8rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
