import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import {
  HiShieldCheck, HiMapPin, HiIdentification, HiBuildingOffice2,
  HiGlobeAmericas, HiTruck, HiCalendarDays, HiPhone,
  HiCog6Tooth, HiBanknotes, HiCloud, HiCurrencyDollar,
  HiCircleStack, HiBookOpen, HiHeart, HiGlobeAlt,
} from 'react-icons/hi2'
import { FaBrain } from 'react-icons/fa6'
import Home from './pages/Home'
import CepPage from './pages/CepPage'
import CpfPage from './pages/CpfPage'
import CnpjPage from './pages/CnpjPage'
import EmpresaPage from './pages/EmpresaPage'
import IbgePage from './pages/IbgePage'
import FipePage from './pages/FipePage'
import FeriadosPage from './pages/FeriadosPage'
import DddPage from './pages/DddPage'
import GeradorPage from './pages/GeradorPage'
import BancosPage from './pages/BancosPage'
import ClimaPage from './pages/ClimaPage'
import CambioPage from './pages/CambioPage'
import CryptoPage from './pages/CryptoPage'
import DicionarioPage from './pages/DicionarioPage'
import AnimaisPage from './pages/AnimaisPage'
import IpInfoPage from './pages/IpInfoPage'
import Mind7Page from './pages/Mind7Page'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="header">
          <NavLink to="/" className="header-brand">
            <HiShieldCheck className="brand-icon" />
            Guardião
          </NavLink>
          <nav className="nav">
            <NavLink to="/cep" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiMapPin /> <span className="nav-text">CEP</span>
            </NavLink>
            <NavLink to="/cpf" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiIdentification /> <span className="nav-text">CPF</span>
            </NavLink>
            <NavLink to="/cnpj" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiBuildingOffice2 /> <span className="nav-text">CNPJ</span>
            </NavLink>
            <NavLink to="/empresa" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiBuildingOffice2 /> <span className="nav-text">Empresa</span>
            </NavLink>
            <NavLink to="/ibge" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiGlobeAmericas /> <span className="nav-text">IBGE</span>
            </NavLink>
            <NavLink to="/fipe" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiTruck /> <span className="nav-text">FIPE</span>
            </NavLink>
            <NavLink to="/feriados" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiCalendarDays /> <span className="nav-text">Feriados</span>
            </NavLink>
            <NavLink to="/ddd" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiPhone /> <span className="nav-text">DDD</span>
            </NavLink>
            <NavLink to="/gerador" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiCog6Tooth /> <span className="nav-text">Gerador</span>
            </NavLink>
            <NavLink to="/bancos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiBanknotes /> <span className="nav-text">Bancos</span>
            </NavLink>
            <NavLink to="/clima" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiCloud /> <span className="nav-text">Clima</span>
            </NavLink>
            <NavLink to="/cambio" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiCurrencyDollar /> <span className="nav-text">Câmbio</span>
            </NavLink>
            <NavLink to="/crypto" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiCircleStack /> <span className="nav-text">Crypto</span>
            </NavLink>
            <NavLink to="/dicionario" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiBookOpen /> <span className="nav-text">Dicionário</span>
            </NavLink>
            <NavLink to="/animais" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiHeart /> <span className="nav-text">Animais</span>
            </NavLink>
            <NavLink to="/ipinfo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HiGlobeAlt /> <span className="nav-text">IP Info</span>
            </NavLink>
            <NavLink to="/mind7" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaBrain /> <span className="nav-text">Mind7</span>
            </NavLink>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cep" element={<CepPage />} />
            <Route path="/cpf" element={<CpfPage />} />
            <Route path="/cnpj" element={<CnpjPage />} />
            <Route path="/empresa" element={<EmpresaPage />} />
            <Route path="/ibge" element={<IbgePage />} />
            <Route path="/fipe" element={<FipePage />} />
            <Route path="/feriados" element={<FeriadosPage />} />
            <Route path="/ddd" element={<DddPage />} />
            <Route path="/gerador" element={<GeradorPage />} />
            <Route path="/bancos" element={<BancosPage />} />
            <Route path="/clima" element={<ClimaPage />} />
            <Route path="/cambio" element={<CambioPage />} />
            <Route path="/crypto" element={<CryptoPage />} />
            <Route path="/dicionario" element={<DicionarioPage />} />
            <Route path="/animais" element={<AnimaisPage />} />
            <Route path="/ipinfo" element={<IpInfoPage />} />
            <Route path="/mind7" element={<Mind7Page />} />
          </Routes>
        </main>

        <footer className="footer">
          Guardião &copy; {new Date().getFullYear()} &mdash; Brasil Services API
        </footer>
      </div>
    </BrowserRouter>
  )
}
