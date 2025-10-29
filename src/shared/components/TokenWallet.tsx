import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import '../styles/TokenWallet.css'

interface TokenWalletProps {
  userId?: string
  compact?: boolean
}

interface Wallet {
  balance: number
  totalEarned: number
  totalSpent: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  description?: string
  createdAt: string
}

export default function TokenWallet({ userId, compact = false }: TokenWalletProps) {
  const { t } = useTranslation()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchWallet()
  }, [])

  const fetchWallet = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/tokens/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setWallet(response.data.wallet)
    } catch (error) {
      console.error('Error fetching wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tokens/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTransactions(response.data.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleShowHistory = () => {
    setShowHistory(!showHistory)
    if (!showHistory && transactions.length === 0) {
      fetchTransactions()
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      ride_completion: t('tokens.rideCompletion'),
      referral: t('tokens.referralBonus'),
      bonus: t('tokens.bonus'),
      withdrawal: t('tokens.withdrawal'),
    }
    return typeMap[type] || type
  }

  if (compact && wallet) {
    return (
      <div className="token-wallet-compact">
        <div className="wallet-balance">
          <span className="label">{t('tokens.cocuTokens')}</span>
          <span className="amount">{wallet.balance.toFixed(2)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="token-wallet">
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : wallet ? (
        <>
          <div className="wallet-cards">
            <div className="wallet-card balance">
              <h3>{t('tokens.balance')}</h3>
              <p className="amount">{wallet.balance.toFixed(2)} COCU</p>
            </div>
            <div className="wallet-card earned">
              <h3>{t('tokens.earned')}</h3>
              <p className="amount">{wallet.totalEarned.toFixed(2)} COCU</p>
            </div>
            <div className="wallet-card spent">
              <h3>{t('tokens.spent')}</h3>
              <p className="amount">{wallet.totalSpent.toFixed(2)} COCU</p>
            </div>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={handleShowHistory}
          >
            {showHistory ? t('common.close') : t('tokens.history')}
          </button>

          {showHistory && (
            <div className="transaction-history">
              <h3>{t('tokens.history')}</h3>
              {transactions.length > 0 ? (
                <div className="transactions-list">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="transaction-item">
                      <div className="transaction-info">
                        <p className="type">{getTransactionTypeLabel(tx.type)}</p>
                        {tx.description && <p className="description">{tx.description}</p>}
                      </div>
                      <div className="transaction-amount">
                        <span className={tx.type === 'withdrawal' ? 'negative' : 'positive'}>
                          {tx.type === 'withdrawal' ? '-' : '+'}
                          {Math.abs(tx.amount).toFixed(2)} COCU
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t('common.loading')}</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>{t('common.error')}</p>
      )}
    </div>
  )
}

