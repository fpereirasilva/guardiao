import { useState } from 'react'
import { HiCog6Tooth, HiArrowPath, HiClipboardDocument } from 'react-icons/hi2'
import { api } from '../api'

export default function GeradorPage() {
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [loading, setLoading] = useState<'cpf' | 'cnpj' | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleGenerateCpf() {
    setLoading('cpf')
    try {
      const res = await api.generateCpf()
      if (res.success) setCpf(res.data.cpf)
    } catch { /* ignore */ }
    setLoading(null)
  }

  async function handleGenerateCnpj() {
    setLoading('cnpj')
    try {
      const res = await api.generateCnpj()
      if (res.success) setCnpj(res.data.cnpj)
    } catch { /* ignore */ }
    setLoading(null)
  }

  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiCog6Tooth /> Gerador CPF / CNPJ</h2>
      <p className="card-description">
        Gere CPFs e CNPJs válidos para testes e desenvolvimento. Documentos gerados não pertencem a nenhuma pessoa ou empresa real.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>Gerar CPF</h3>
          <button className="btn btn-primary" onClick={handleGenerateCpf} disabled={loading === 'cpf'}>
            {loading === 'cpf' ? <span className="spinner" /> : <><HiArrowPath /> Gerar CPF</>}
          </button>
          {cpf && (
            <div className="result result-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="result-value" style={{ fontSize: '1.2rem' }}>{cpf}</span>
              <button
                className="btn btn-outline"
                style={{ width: 'auto', padding: '8px 14px', fontSize: '0.8rem' }}
                onClick={() => copyToClipboard(cpf, 'cpf')}
              >
                <HiClipboardDocument /> {copied === 'cpf' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>Gerar CNPJ</h3>
          <button className="btn btn-primary" onClick={handleGenerateCnpj} disabled={loading === 'cnpj'}>
            {loading === 'cnpj' ? <span className="spinner" /> : <><HiArrowPath /> Gerar CNPJ</>}
          </button>
          {cnpj && (
            <div className="result result-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="result-value" style={{ fontSize: '1.2rem' }}>{cnpj}</span>
              <button
                className="btn btn-outline"
                style={{ width: 'auto', padding: '8px 14px', fontSize: '0.8rem' }}
                onClick={() => copyToClipboard(cnpj, 'cnpj')}
              >
                <HiClipboardDocument /> {copied === 'cnpj' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
