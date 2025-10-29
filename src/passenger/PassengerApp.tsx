import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import './PassengerApp.css'

interface PassengerAppProps {
  onLogout: () => void
}

interface Ride {
  id: string
  pickupLocation: string
  dropoffLocation: string
  status: string
  fare?: number
  distance?: number
  duration?: number
  createdAt: string
}

interface Wallet {
  balance: number
  totalEarned: number
  totalSpent: number
}

export default function PassengerApp({ onLogout }: PassengerAppProps) {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState('home')
  const [loading, setLoading] = useState(false)
  const [rides, setRides] = useState<Ride[]>([])
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (currentPage === 'rides') {
      fetchMyRides()
    } else if (currentPage === 'wallet') {
      fetchWallet()
    }
  }, [currentPage])

  const fetchMyRides = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/passenger/rides`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRides(response.data.rides)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading rides')
    } finally {
      setLoading(false)
    }
  }

  const fetchWallet = async () => {
    setLoading(true)
    try {
      // Placeholder - será implementado en fase de tokens
      setWallet({
        balance: 100,
        totalEarned: 100,
        totalSpent: 0,
      })
      setError(null)
    } catch (err: any) {
      setError('Error loading wallet')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestRide = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(
        `${apiUrl}/passenger/rides/request`,
        {
          pickupLocation,
          dropoffLocation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPickupLocation('')
      setDropoffLocation('')
      setError(null)
      alert(t('common.success'))
      fetchMyRides()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error requesting ride')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRide = async (rideId: string) => {
    if (!confirm(t('common.confirm'))) return

    try {
      await axios.post(
        `${apiUrl}/passenger/rides/${rideId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchMyRides()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error cancelling ride')
    }
  }

  const getRideStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800'
      case 'accepted':
        return '#2196F3'
      case 'in_progress':
        return '#4CAF50'
      case 'completed':
        return '#4CAF50'
      case 'cancelled':
        return '#f44336'
      default:
        return '#666'
    }
  }

  return (
    <div className="passenger-app">
      <header className="passenger-header">
        <div className="container">
          <h1>COCUMOVE - {t('navigation.passenger')}</h1>
          <nav className="passenger-nav">
            <button 
              onClick={() => setCurrentPage('home')}
              className={currentPage === 'home' ? 'active' : ''}
            >
              {t('navigation.home')}
            </button>
            <button 
              onClick={() => setCurrentPage('rides')}
              className={currentPage === 'rides' ? 'active' : ''}
            >
              {t('navigation.rides')}
            </button>
            <button 
              onClick={() => setCurrentPage('wallet')}
              className={currentPage === 'wallet' ? 'active' : ''}
            >
              {t('navigation.wallet')}
            </button>
            <button 
              onClick={() => setCurrentPage('profile')}
              className={currentPage === 'profile' ? 'active' : ''}
            >
              {t('navigation.profile')}
            </button>
            <button onClick={onLogout} className="btn-logout">{t('navigation.logout')}</button>
          </nav>
        </div>
      </header>

      <main className="passenger-main">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {currentPage === 'home' && (
            <section className="passenger-home">
              <h2>{t('passenger.requestRide')}</h2>
              <form onSubmit={handleRequestRide} className="ride-form">
                <div className="form-group">
                  <label>{t('passenger.pickupLocation')}</label>
                  <input 
                    type="text" 
                    placeholder={t('passenger.pickupLocation')}
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('passenger.dropoffLocation')}</label>
                  <input 
                    type="text" 
                    placeholder={t('passenger.dropoffLocation')}
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? t('common.loading') : t('passenger.requestRide')}
                </button>
              </form>

              <div className="features-section">
                <h3>{t('app.title')}</h3>
                <div className="features-list">
                  <div className="feature-item">
                    <span className="icon">🎁</span>
                    <p>{t('tokens.earnTokens')}</p>
                  </div>
                  <div className="feature-item">
                    <span className="icon">⭐</span>
                    <p>{t('common.search')}</p>
                  </div>
                  <div className="feature-item">
                    <span className="icon">🔒</span>
                    <p>{t('common.search')}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentPage === 'rides' && (
            <section className="passenger-rides">
              <h2>{t('passenger.rideHistory')}</h2>
              {loading ? (
                <p>{t('common.loading')}</p>
              ) : rides.length > 0 ? (
                <div className="rides-list">
                  {rides.map((ride) => (
                    <div key={ride.id} className="ride-card">
                      <div className="ride-info">
                        <div className="ride-locations">
                          <p><strong>{t('passenger.pickupLocation')}:</strong> {ride.pickupLocation}</p>
                          <p><strong>{t('passenger.dropoffLocation')}:</strong> {ride.dropoffLocation}</p>
                        </div>
                        <div className="ride-details">
                          <p><strong>{t('passenger.fare')}:</strong> ${ride.fare || '0.00'}</p>
                          <p><strong>{t('passenger.totalDistance')}:</strong> {ride.distance || '0'} km</p>
                          <p><strong>{t('passenger.totalTime')}:</strong> {ride.duration || '0'} min</p>
                        </div>
                      </div>
                      <div className="ride-status" style={{ color: getRideStatusColor(ride.status) }}>
                        <strong>{ride.status.toUpperCase()}</strong>
                      </div>
                      {ride.status === 'pending' && (
                        <button 
                          className="btn btn-danger btn-small"
                          onClick={() => handleCancelRide(ride.id)}
                        >
                          {t('common.cancel')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t('passenger.rideHistory')}: {t('common.loading')}</p>
              )}
            </section>
          )}

          {currentPage === 'wallet' && (
            <section className="passenger-wallet">
              <h2>{t('tokens.cocuTokens')}</h2>
              {wallet ? (
                <div className="wallet-cards">
                  <div className="wallet-card">
                    <h3>{t('tokens.balance')}</h3>
                    <p className="balance">{wallet.balance} COCU</p>
                  </div>
                  <div className="wallet-card">
                    <h3>{t('tokens.earned')}</h3>
                    <p className="earned">{wallet.totalEarned} COCU</p>
                  </div>
                  <div className="wallet-card">
                    <h3>{t('tokens.spent')}</h3>
                    <p className="spent">{wallet.totalSpent} COCU</p>
                  </div>
                </div>
              ) : (
                <p>{t('common.loading')}</p>
              )}
            </section>
          )}

          {currentPage === 'profile' && (
            <section className="passenger-profile">
              <h2>{t('navigation.profile')}</h2>
              <p>{t('common.loading')}</p>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

