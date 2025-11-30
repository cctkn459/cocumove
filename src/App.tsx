import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'

// Importar componentes de las tres aplicaciones
import AdminApp from './admin/AdminApp'
import PassengerApp from './passenger/PassengerApp'
import DriverApp from './driver/DriverApp'

type AppMode = 'landing' | 'admin' | 'passenger' | 'driver'

function App() {
  const { i18n } = useTranslation()
  const [appMode, setAppMode] = useState<AppMode>('landing')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'passenger' | 'driver' | null>(null)

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (token && role) {
      setIsLoggedIn(true)
      setUserRole(role as any)
      setAppMode(role as AppMode)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    setUserRole(null)
    setAppMode('landing')
  }

  // Renderizar la aplicación correspondiente
  if (isLoggedIn && userRole) {
    if (userRole === 'admin') {
      return <AdminApp onLogout={handleLogout} />
    } else if (userRole === 'passenger') {
      return <PassengerApp onLogout={handleLogout} />
    } else if (userRole === 'driver') {
      return <DriverApp onLogout={handleLogout} />
    }
  }

  // Landing page
  return (
    <div className="app-landing">
      <header className="landing-header">
        <div className="container">
          <div className="logo-section">
            <img src="/logo.png" alt="COCUMOVE Logo" className="logo" />
            <h1>COCUMOVE</h1>
            <p className="tagline">Move The Future</p>
          </div>
          <nav className="nav-links">
            <select 
              value={i18n.language} 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="language-selector"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
            </select>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <div className="container">
          <section className="hero">
            <h2>Bienvenido a COCUMOVE</h2>
            <p>La plataforma de transporte inteligente del futuro</p>
          </section>

          <section className="role-selection">
            <h3>¿Cómo deseas continuar?</h3>
            <div className="role-cards">
              <div className="role-card">
                <div className="role-icon">👤</div>
                <h4>Pasajero</h4>
                <p>Solicita viajes seguros y rápidos</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setAppMode('passenger')}
                >
                  Continuar como Pasajero
                </button>
              </div>

              <div className="role-card">
                <div className="role-icon">🚗</div>
                <h4>Conductor</h4>
                <p>Gana dinero y tokens COCU</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setAppMode('driver')}
                >
                  Continuar como Conductor
                </button>
              </div>

              <div className="role-card">
                <div className="role-icon">⚙️</div>
                <h4>Administrador</h4>
                <p>Gestiona la plataforma</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setAppMode('admin')}
                >
                  Continuar como Admin
                </button>
              </div>
            </div>
          </section>

          <section className="features">
            <h3>Características Principales</h3>
            <div className="features-grid">
              <div className="feature">
                <span className="feature-icon">🎁</span>
                <h4>Tokens COCU</h4>
                <p>Gana y canjea tokens con cada viaje</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🌍</span>
                <h4>Multiidioma</h4>
                <p>Disponible en español, inglés, portugués y francés</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <h4>Seguro</h4>
                <p>Verificación completa de documentos y antecedentes</p>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <h4>Calificaciones</h4>
                <p>Sistema de reputación transparente</p>
              </div>
            </div>
          </section>

          <section className="contact">
            <h3>¿Preguntas?</h3>
            <p>Contacta con nosotros en: <a href="mailto:cocupoly@gmail.com">cocupoly@gmail.com</a></p>
          </section>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 COCUMOVE. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Renderizar la aplicación seleccionada */}
      {appMode === 'passenger' && <PassengerApp onLogout={handleLogout} />}
      {appMode === 'driver' && <DriverApp onLogout={handleLogout} />}
      {appMode === 'admin' && <AdminApp onLogout={handleLogout} />}
    </div>
  )
}

export default App

