import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import './AdminApp.css'

interface AdminAppProps {
  onLogout: () => void
}

interface DashboardStats {
  users: { totalUsers: number; totalPassengers: number; totalDrivers: number; activeUsers: number }
  drivers: { totalDrivers: number; approvedDrivers: number; pendingDrivers: number }
  rides: { totalRides: number; completedRides: number; cancelledRides: number }
}

interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  role: string
  isVerified: boolean
  isActive: boolean
  createdAt: string
}

interface Driver {
  id: string
  userId: string
  cedulaNumber: string
  licenseNumber: string
  isApproved: boolean
  rating: string
  totalRides: number
  createdAt: string
}

export default function AdminApp({ onLogout }: AdminAppProps) {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [error, setError] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (currentPage === 'dashboard') {
      fetchDashboard()
    } else if (currentPage === 'users') {
      fetchUsers()
    } else if (currentPage === 'drivers') {
      fetchPendingDrivers()
    }
  }, [currentPage])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(response.data.dashboard)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data.users)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading users')
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingDrivers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/admin/drivers/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDrivers(response.data.drivers)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading drivers')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDriver = async (driverId: string) => {
    try {
      await axios.post(`${apiUrl}/admin/drivers/${driverId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchPendingDrivers()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error approving driver')
    }
  }

  const handleRejectDriver = async (driverId: string) => {
    try {
      await axios.post(`${apiUrl}/admin/drivers/${driverId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchPendingDrivers()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error rejecting driver')
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    try {
      await axios.post(`${apiUrl}/admin/users/${userId}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error deactivating user')
    }
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="container">
          <h1>COCUMOVE - {t('admin.dashboard')}</h1>
          <nav className="admin-nav">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={currentPage === 'dashboard' ? 'active' : ''}
            >
              {t('admin.dashboard')}
            </button>
            <button 
              onClick={() => setCurrentPage('users')}
              className={currentPage === 'users' ? 'active' : ''}
            >
              {t('admin.users')}
            </button>
            <button 
              onClick={() => setCurrentPage('drivers')}
              className={currentPage === 'drivers' ? 'active' : ''}
            >
              {t('admin.drivers')}
            </button>
            <button 
              onClick={() => setCurrentPage('rides')}
              className={currentPage === 'rides' ? 'active' : ''}
            >
              {t('admin.rides')}
            </button>
            <button 
              onClick={() => setCurrentPage('reports')}
              className={currentPage === 'reports' ? 'active' : ''}
            >
              {t('admin.reports')}
            </button>
            <button onClick={onLogout} className="btn-logout">{t('navigation.logout')}</button>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {currentPage === 'dashboard' && (
            <section className="admin-dashboard">
              <h2>{t('admin.statistics')}</h2>
              {loading ? (
                <p>{t('common.loading')}</p>
              ) : stats ? (
                <>
                  <div className="stats-section">
                    <h3>{t('admin.users')}</h3>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <h4>{t('admin.totalUsers')}</h4>
                        <p>{stats.users.totalUsers}</p>
                      </div>
                      <div className="stat-card">
                        <h4>{t('admin.passengers')}</h4>
                        <p>{stats.users.totalPassengers}</p>
                      </div>
                      <div className="stat-card">
                        <h4>{t('admin.drivers')}</h4>
                        <p>{stats.users.totalDrivers}</p>
                      </div>
                      <div className="stat-card">
                        <h4>Activos</h4>
                        <p>{stats.users.activeUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="stats-section">
                    <h3>{t('admin.drivers')}</h3>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <h4>{t('admin.totalDrivers')}</h4>
                        <p>{stats.drivers.totalDrivers}</p>
                      </div>
                      <div className="stat-card">
                        <h4>Aprobados</h4>
                        <p>{stats.drivers.approvedDrivers}</p>
                      </div>
                      <div className="stat-card">
                        <h4>{t('admin.pendingVerifications')}</h4>
                        <p>{stats.drivers.pendingDrivers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="stats-section">
                    <h3>{t('admin.rides')}</h3>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <h4>{t('admin.totalRides')}</h4>
                        <p>{stats.rides.totalRides}</p>
                      </div>
                      <div className="stat-card">
                        <h4>Completados</h4>
                        <p>{stats.rides.completedRides}</p>
                      </div>
                      <div className="stat-card">
                        <h4>Cancelados</h4>
                        <p>{stats.rides.cancelledRides}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </section>
          )}

          {currentPage === 'users' && (
            <section className="admin-users">
              <h2>{t('admin.manageUsers')}</h2>
              {loading ? (
                <p>{t('common.loading')}</p>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('common.email')}</th>
                        <th>{t('common.phone')}</th>
                        <th>Nombre</th>
                        <th>Rol</th>
                        <th>Verificado</th>
                        <th>Activo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.role}</td>
                          <td>{user.isVerified ? '✓' : '✗'}</td>
                          <td>{user.isActive ? '✓' : '✗'}</td>
                          <td>
                            <button 
                              className="btn btn-small btn-danger"
                              onClick={() => handleDeactivateUser(user.id)}
                            >
                              {t('common.delete')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {currentPage === 'drivers' && (
            <section className="admin-drivers">
              <h2>{t('admin.manageDrivers')}</h2>
              <p>{t('admin.pendingVerifications')}: {drivers.length}</p>
              {loading ? (
                <p>{t('common.loading')}</p>
              ) : (
                <div className="drivers-list">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="driver-card">
                      <h4>Cédula: {driver.cedulaNumber}</h4>
                      <p>Licencia: {driver.licenseNumber}</p>
                      <p>Viajes: {driver.totalRides}</p>
                      <p>Calificación: {driver.rating}/5.00</p>
                      <div className="driver-actions">
                        <button 
                          className="btn btn-success"
                          onClick={() => handleApproveDriver(driver.id)}
                        >
                          {t('admin.approveDriver')}
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleRejectDriver(driver.id)}
                        >
                          {t('admin.rejectDriver')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {currentPage === 'rides' && (
            <section className="admin-rides">
              <h2>{t('admin.rides')}</h2>
              <p>{t('common.loading')}</p>
            </section>
          )}

          {currentPage === 'reports' && (
            <section className="admin-reports">
              <h2>{t('admin.reports')}</h2>
              <p>{t('common.loading')}</p>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

