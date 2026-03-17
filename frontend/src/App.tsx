import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { HiShieldCheck, HiMapPin, HiIdentification, HiBuildingOffice2 } from 'react-icons/hi2'
import Home from './pages/Home'
import CepPage from './pages/CepPage'
import CpfPage from './pages/CpfPage'
import CnpjPage from './pages/CnpjPage'

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
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cep" element={<CepPage />} />
            <Route path="/cpf" element={<CpfPage />} />
            <Route path="/cnpj" element={<CnpjPage />} />
          </Routes>
        </main>

        <footer className="footer">
          Guardião &copy; {new Date().getFullYear()} &mdash; Brasil Services API
        </footer>
      </div>
    </BrowserRouter>
  )
}
