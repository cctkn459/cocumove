import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import './DriverApp.css'

interface DriverAppProps {
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

interface DriverStats {
  totalDrivers: number
  approvedDrivers: number
  pendingDrivers: number
}

export default function DriverApp({ onLogout }: DriverAppProps) {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState('home')
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rides, setRides] = useState<Ride[]>([])
  const [error, setError] = useState<string | null>(null)
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    todayEarnings: 0,
    totalRides: 0,
    tokens: 0,
  })

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (currentPage === 'rides') {
      fetchMyRides()
    } else if (currentPage === 'earnings') {
      calculateEarnings()
    }
  }, [currentPage])

  const fetchMyRides = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/driver/rides`, {
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

  const calculateEarnings = () => {
    // Placeholder - será implementado con datos reales
    setEarnings({
      totalEarnings: 1250.50,
      todayEarnings: 125.00,
      totalRides: 45,
      tokens: 225,
    })
  }

  const handleAcceptRide = async (rideId: string) => {
    try {
      await axios.post(
        `${apiUrl}/driver/rides/${rideId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchMyRides()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error accepting ride')
    }
  }

  const handleStartRide = async (rideId: string) => {
    try {
      await axios.post(
        `${apiUrl}/driver/rides/${rideId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchMyRides()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error starting ride')
    }
  }

  const handleCompleteRide = async (rideId: string) => {
    const fare = prompt(t('passenger.fare') + ':')
    if (!fare) return

    try {
      await axios.post(
        `${apiUrl}/driver/rides/${rideId}/complete`,
        {
          fare: parseFloat(fare),
          distance: 5.2,
          duration: 15,
          paymentMethod: 'cash',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchMyRides()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error completing ride')
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

  const getRideActions = (ride: Ride) => {
    switch (ride.status) {
      case 'pending':
        return (
          <button 
            className="btn btn-success btn-small"
            onClick={() => handleAcceptRide(ride.id)}
          >
            {t('driver.acceptRide')}
          </button>
        )
      case 'accepted':
        return (
          <button 
            className="btn btn-primary btn-small"
            onClick={() => handleStartRide(ride.id)}
          >
            {t('driver.startRide')}
          </button>
        )
      case 'in_progress':
        return (
          <button 
            className="btn btn-success btn-small"
            onClick={() => handleCompleteRide(ride.id)}
          >
            {t('driver.completeRide')}
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="driver-app">
      <header className="driver-header">
        <div className="container">
          <h1>COCUMOVE - {t('navigation.driver')}</h1>
          <nav className="driver-nav">
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
              onClick={() => setCurrentPage('earnings')}
              className={currentPage === 'earnings' ? 'active' : ''}
            >
              {t('driver.earnings')}
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

      <main className="driver-main">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {currentPage === 'home' && (
            <section className="driver-home">
              <div className="status-card">
                <h2>{t('driver.online')}</h2>
                <button 
                  className={`btn btn-large ${isOnline ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => setIsOnline(!isOnline)}
                >
                  {isOnline ? t('driver.goOffline') : t('driver.goOnline')}
                </button>
                <p className="status-text">
                  {isOnline ? t('driver.online') : t('driver.offline')}
                </p>
              </div>

              {isOnline && (
                <div className="quick-stats">
                  <h3>{t('driver.todayEarnings')}</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h4>{t('driver.todayEarnings')}</h4>
                      <p>${earnings.todayEarnings.toFixed(2)}</p>
                    </div>
                    <div className="stat-card">
                      <h4>{t('driver.totalRides')}</h4>
                      <p>{earnings.totalRides}</p>
                    </div>
                    <div className="stat-card">
                      <h4>{t('tokens.cocuTokens')}</h4>
                      <p>{earnings.tokens} COCU</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {currentPage === 'rides' && (
            <section className="driver-rides">
              <h2>{t('driver.rideHistory')}</h2>
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
                      <div className="ride-action">
                        {getRideActions(ride)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t('common.loading')}</p>
              )}
            </section>
          )}

          {currentPage === 'earnings' && (
            <section className="driver-earnings">
              <h2>{t('driver.earnings')}</h2>
              <div className="earnings-cards">
                <div className="earnings-card">
                  <h3>{t('driver.totalEarnings')}</h3>
                  <p className="amount">${earnings.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="earnings-card">
                  <h3>{t('driver.todayEarnings')}</h3>
                  <p className="amount">${earnings.todayEarnings.toFixed(2)}</p>
                </div>
                <div className="earnings-card">
                  <h3>{t('driver.totalRides')}</h3>
                  <p className="amount">{earnings.totalRides}</p>
                </div>
                <div className="earnings-card">
                  <h3>{t('tokens.cocuTokens')}</h3>
                  <p className="amount">{earnings.tokens} COCU</p>
                </div>
              </div>
            </section>
          )}

          {currentPage === 'profile' && (
            <section className="driver-profile">
              <h2>{t('navigation.profile')}</h2>
              <p>{t('common.loading')}</p>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

