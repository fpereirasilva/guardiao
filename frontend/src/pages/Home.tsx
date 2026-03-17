import { useNavigate } from 'react-router-dom'
import {
  HiMapPin, HiIdentification, HiBuildingOffice2,
  HiGlobeAmericas, HiTruck, HiCalendarDays, HiPhone,
  HiCog6Tooth, HiBanknotes, HiCloud, HiCurrencyDollar,
  HiCircleStack, HiBookOpen, HiHeart, HiGlobeAlt,
} from 'react-icons/hi2'
import { FaBrain } from 'react-icons/fa6'

const services = [
  { path: '/cep', icon: HiMapPin, color: 'cep', title: 'Consulta CEP', desc: 'Busca de endereço com fallback multi-provider' },
  { path: '/cpf', icon: HiIdentification, color: 'cpf', title: 'Validar CPF', desc: 'Validação com algoritmo de dígitos verificadores' },
  { path: '/cnpj', icon: HiBuildingOffice2, color: 'cnpj', title: 'Validar CNPJ', desc: 'Verificação completa de CNPJ' },
  { path: '/empresa', icon: HiBuildingOffice2, color: 'empresa', title: 'Consulta Empresa', desc: 'Dados da Receita Federal por CNPJ' },
  { path: '/ibge', icon: HiGlobeAmericas, color: 'ibge', title: 'IBGE', desc: 'Estados e municípios brasileiros' },
  { path: '/fipe', icon: HiTruck, color: 'fipe', title: 'Tabela FIPE', desc: 'Preços de veículos e marcas' },
  { path: '/feriados', icon: HiCalendarDays, color: 'feriados', title: 'Feriados', desc: 'Feriados nacionais por ano' },
  { path: '/ddd', icon: HiPhone, color: 'ddd', title: 'DDD', desc: 'Cidades e estado por código DDD' },
  { path: '/gerador', icon: HiCog6Tooth, color: 'gerador', title: 'Gerador', desc: 'Gerar CPF e CNPJ válidos para testes' },
  { path: '/bancos', icon: HiBanknotes, color: 'bancos', title: 'Bancos', desc: 'Lista de bancos do Banco Central' },
  { path: '/clima', icon: HiCloud, color: 'clima', title: 'Clima', desc: 'Previsão do tempo com Open-Meteo' },
  { path: '/cambio', icon: HiCurrencyDollar, color: 'cambio', title: 'Câmbio', desc: 'Taxas de câmbio e conversão de moedas' },
  { path: '/crypto', icon: HiCircleStack, color: 'crypto', title: 'Crypto', desc: 'Top 50 criptomoedas em tempo real' },
  { path: '/dicionario', icon: HiBookOpen, color: 'dicionario', title: 'Dicionário', desc: 'Definições, fonética e sinônimos' },
  { path: '/animais', icon: HiHeart, color: 'animais', title: 'Animais', desc: 'Imagens de cães e fatos sobre gatos' },
  { path: '/ipinfo', icon: HiGlobeAlt, color: 'ipinfo', title: 'IP Info', desc: 'Geolocalização de endereços IP' },
  { path: '/mind7', icon: FaBrain, color: 'mind7', title: 'Mind7', desc: 'Mapa de equipamentos de saúde mental' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <div className="home-hero">
        <h1>
          <span>Guardião</span>
        </h1>
        <p>Plataforma completa de consultas e serviços — CEP, CPF, CNPJ, IBGE, FIPE, Clima, Crypto, Mind7 e muito mais.</p>
      </div>

      <div className="home-grid">
        {services.map(s => (
          <div className="home-card" key={s.path} onClick={() => navigate(s.path)}>
            <div className={`home-card-icon ${s.color}`}><s.icon /></div>
            <div className="home-card-text">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
