import { useState } from 'react'
import { HiHeart, HiArrowPath, HiListBullet } from 'react-icons/hi2'
import { api } from '../api'

export default function AnimaisPage() {
  const [dogImg, setDogImg] = useState('')
  const [dogBreed, setDogBreed] = useState('')
  const [catFact, setCatFact] = useState('')
  const [loadingDog, setLoadingDog] = useState(false)
  const [loadingCat, setLoadingCat] = useState(false)
  const [breeds, setBreeds] = useState<string[]>([])
  const [showBreeds, setShowBreeds] = useState(false)
  const [selectedBreed, setSelectedBreed] = useState('')
  const [loadingBreeds, setLoadingBreeds] = useState(false)

  async function handleRandomDog() {
    setLoadingDog(true)
    setDogBreed('')
    try {
      const res = await api.getRandomDog()
      if (res.success) {
        setDogImg(res.data.url)
        setDogBreed(res.data.breed || '')
      }
    } catch { /* ignore */ }
    setLoadingDog(false)
  }

  async function handleBreedDog(breed: string) {
    setLoadingDog(true)
    setSelectedBreed(breed)
    try {
      const res = await api.getRandomDog(breed)
      if (res.success) {
        setDogImg(res.data.url)
        setDogBreed(breed)
      }
    } catch { /* ignore */ }
    setLoadingDog(false)
  }

  async function handleLoadBreeds() {
    if (breeds.length > 0) {
      setShowBreeds(!showBreeds)
      return
    }
    setLoadingBreeds(true)
    try {
      const res = await api.getDogBreeds()
      if (res.success) {
        setBreeds(res.data)
        setShowBreeds(true)
      }
    } catch { /* ignore */ }
    setLoadingBreeds(false)
  }

  async function handleCatFact() {
    setLoadingCat(true)
    try {
      const res = await api.getCatFact()
      if (res.success) setCatFact(res.data.fact)
    } catch { /* ignore */ }
    setLoadingCat(false)
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiHeart /> Animais</h2>
      <p className="card-description">
        Imagens aleatórias de cães e curiosidades sobre gatos.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Dogs Section */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>🐕 Cães</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button className="btn btn-primary" onClick={handleRandomDog} disabled={loadingDog} style={{ flex: 1 }}>
              {loadingDog ? <span className="spinner" /> : <><HiArrowPath /> Aleatório</>}
            </button>
            <button className="btn-outline" onClick={handleLoadBreeds} disabled={loadingBreeds} style={{ padding: '10px 16px' }}>
              {loadingBreeds ? <span className="spinner" /> : <HiListBullet />}
            </button>
          </div>

          {showBreeds && breeds.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 12, background: 'var(--bg-secondary)', borderRadius: 8, padding: 8 }}>
              {breeds.map(b => (
                <button
                  key={b}
                  className="btn-outline"
                  onClick={() => handleBreedDog(b)}
                  style={{
                    display: 'inline-block', fontSize: '0.75rem', padding: '4px 8px', margin: 2,
                    background: selectedBreed === b ? 'var(--primary)' : undefined,
                    color: selectedBreed === b ? '#fff' : undefined
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {dogImg && (
            <div style={{ borderRadius: 12, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
              <img src={dogImg} alt="Dog" style={{ width: '100%', height: 300, objectFit: 'cover' }} />
              {dogBreed && (
                <div style={{ padding: 8, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {dogBreed.replace(/\//g, ' → ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cats Section */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>🐱 Gatos</h3>
          <button className="btn btn-primary" onClick={handleCatFact} disabled={loadingCat} style={{ marginBottom: 12 }}>
            {loadingCat ? <span className="spinner" /> : <><HiArrowPath /> Curiosidade</>}
          </button>

          {catFact && (
            <div className="result result-success">
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>{catFact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
