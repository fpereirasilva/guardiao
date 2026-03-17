import { useState } from 'react'
import { HiBuildingOffice2, HiMagnifyingGlass } from 'react-icons/hi2'
import { api, type CnpjLookupData } from '../api'

export default function EmpresaPage() {
  const [cnpj, setCnpj] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CnpjLookupData | null>(null)
  const [error, setError] = useState('')

  function formatCnpjInput(value: string) {
    const d = value.replace(/\D/g, '').slice(0, 14)
    if (d.length > 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`
    if (d.length > 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`
    if (d.length > 5) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`
    if (d.length > 2) return `${d.slice(0,2)}.${d.slice(2)}`
    return d
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = cnpj.replace(/\D/g, '')
    if (cleaned.length !== 14) return

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await api.lookupCnpj(cleaned)
      if (res.success) {
        setResult(res.data)
      } else {
        setError(res.error?.message || 'CNPJ não encontrado.')
      }
    } catch {
      setError('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title"><HiBuildingOffice2 /> Consulta Empresa</h2>
      <p className="card-description">
        Digite um CNPJ para consultar os dados completos da empresa na Receita Federal.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="cnpj">CNPJ</label>
          <input
            id="cnpj"
            className="form-input"
            type="text"
            inputMode="numeric"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={(e) => setCnpj(formatCnpjInput(e.target.value))}
            maxLength={18}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || cnpj.replace(/\D/g, '').length !== 14}>
          {loading ? <span className="spinner" /> : <><HiMagnifyingGlass /> Consultar</>}
        </button>
      </form>

      {result && (
        <div className="result result-success">
          <div className="result-row"><span className="result-label">Razão Social</span><span className="result-value">{result.razao_social}</span></div>
          {result.nome_fantasia && <div className="result-row"><span className="result-label">Nome Fantasia</span><span className="result-value">{result.nome_fantasia}</span></div>}
          <div className="result-row"><span className="result-label">Situação</span><span className="result-value">{result.situacao}</span></div>
          <div className="result-row"><span className="result-label">Tipo</span><span className="result-value">{result.tipo}</span></div>
          <div className="result-row"><span className="result-label">Abertura</span><span className="result-value">{result.abertura}</span></div>
          <div className="result-row"><span className="result-label">Natureza Jurídica</span><span className="result-value">{result.natureza_juridica}</span></div>
          <div className="result-row"><span className="result-label">Porte</span><span className="result-value">{result.porte}</span></div>
          <div className="result-row"><span className="result-label">Atividade</span><span className="result-value">{result.atividade_principal}</span></div>
          <div className="result-row"><span className="result-label">Endereço</span><span className="result-value">{result.logradouro}, {result.numero} - {result.bairro}</span></div>
          <div className="result-row"><span className="result-label">Cidade/UF</span><span className="result-value">{result.municipio}/{result.uf}</span></div>
          <div className="result-row"><span className="result-label">CEP</span><span className="result-value">{result.cep}</span></div>
          {result.telefone && <div className="result-row"><span className="result-label">Telefone</span><span className="result-value">{result.telefone}</span></div>}
          {result.email && <div className="result-row"><span className="result-label">E-mail</span><span className="result-value" style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>{result.email}</span></div>}
        </div>
      )}

      {error && (
        <div className="result result-error"><p>{error}</p></div>
      )}
    </div>
  )
}
