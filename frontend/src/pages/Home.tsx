import { useNavigate } from 'react-router-dom'
import { HiMapPin, HiIdentification, HiBuildingOffice2 } from 'react-icons/hi2'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <div className="home-hero">
        <h1>
          <span>Guardião</span>
        </h1>
        <p>Consulta de CEP, validação de CPF e CNPJ em uma única plataforma rápida e segura.</p>
      </div>

      <div className="home-grid">
        <div className="home-card" onClick={() => navigate('/cep')}>
          <div className="home-card-icon cep"><HiMapPin /></div>
          <div className="home-card-text">
            <h3>Consulta CEP</h3>
            <p>Busca de endereço com fallback multi-provider</p>
          </div>
        </div>

        <div className="home-card" onClick={() => navigate('/cpf')}>
          <div className="home-card-icon cpf"><HiIdentification /></div>
          <div className="home-card-text">
            <h3>Validar CPF</h3>
            <p>Validação com algoritmo de dígitos verificadores</p>
          </div>
        </div>

        <div className="home-card" onClick={() => navigate('/cnpj')}>
          <div className="home-card-icon cnpj"><HiBuildingOffice2 /></div>
          <div className="home-card-text">
            <h3>Validar CNPJ</h3>
            <p>Verificação completa de CNPJ</p>
          </div>
        </div>
      </div>
    </>
  )
}
