'use client'

import React, { useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { SocketProvider } from '@/contexts/SocketContext'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Layout/Header'
import LoginForm from '@/components/Auth/LoginForm'
import RegisterForm from '@/components/Auth/RegisterForm'
import ForgotPassword from '@/components/Auth/ForgotPassword'
import DepositInstructions from '@/components/Deposit/DepositInstructions'
import Dashboard from '@/components/Dashboard/Dashboard'
import TriangleView from '@/components/Triangle/TriangleView'
import TriangleDetail from '@/components/Triangle/TriangleDetail'
import Wallet from '@/components/Wallet/Wallet'
import Referrals from '@/components/Referrals/Referrals'
import AdminDashboard from '@/components/Admin/AdminDashboard'
import AdminUsers from '@/components/Admin/AdminUsers'
import AdminTransactions from '@/components/Admin/AdminTransactions'
import AdminPlans from '@/components/Admin/AdminPlans'
import AdminSettings from '@/components/Admin/AdminSettings'
import NotificationContainer from '@/components/Notifications/NotificationContainer'

const AppContent: React.FC = () => {
  const { user, isAdmin } = useAuth()
  const [currentPage, setCurrentPage] = useState('login')
  const [pendingDeposit, setPendingDeposit] = useState<any>(null)

  const handleNavigate = (page: string) => {
    console.log('Navigating to:', page)
    setCurrentPage(page)
  }

  // Refresh user data after deposit confirmation
  const refreshUserData = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const session = await response.json()
      console.log('Refreshed user session:', session)
    } catch (error) {
      console.error('Failed to refresh user session:', error)
    }
  }

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (typeof detail === 'string') setCurrentPage(detail)
    }
    window.addEventListener('navigate', handler as EventListener)
    return () => window.removeEventListener('navigate', handler as EventListener)
  }, [])

  // Check for pending deposit from registration
  React.useEffect(() => {
    const pending = localStorage.getItem('pending_deposit')
    if (pending) {
      try {
        const deposit = JSON.parse(pending)
        setPendingDeposit(deposit)
        setCurrentPage('deposit-instructions')
      } catch (e) {
        localStorage.removeItem('pending_deposit')
      }
    }
  }, [])

  const renderPage = () => {
    // Debug logging
    console.log('App renderPage - State:', {
      pendingDeposit: !!pendingDeposit,
      currentPage,
      user: !!user,
      isAdmin
    })

    // Show deposit instructions if there's a pending deposit
    if (pendingDeposit && currentPage === 'deposit-instructions') {
      return (
        <DepositInstructions
          depositInfo={pendingDeposit}
          onModalClose={() => {
            console.log('Modal closing - navigating to dashboard')
            localStorage.removeItem('pending_deposit')
            setPendingDeposit(null)
            // Refresh user data and navigate to dashboard
            refreshUserData().then(() => {
              setTimeout(() => {
                setCurrentPage('dashboard')
                console.log('Navigation to dashboard complete')
              }, 100)
            })
          }}
          onAccountDelete={() => {
            localStorage.removeItem('pending_deposit')
            setPendingDeposit(null)
            setCurrentPage('login')
          }}
        />
      )
    }

    if (!user && !isAdmin) {
      switch (currentPage) {
        case 'register':
          return <RegisterForm onNavigate={handleNavigate} />
        case 'forgot-password':
          return <ForgotPassword onNavigate={handleNavigate} />
        default:
          return <LoginForm onNavigate={handleNavigate} />
      }
    }

    if (isAdmin) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <main>
            {(() => {
              switch (currentPage) {
                case 'admin-users':
                  return <AdminUsers />
                case 'admin-transactions':
                  return <AdminTransactions />
                case 'admin-plans':
                  return <AdminPlans />
                case 'admin-settings':
                  return <AdminSettings />
                default:
                  return <AdminDashboard />
              }
            })()}
          </main>
        </div>
      )
    }

    if (user) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <main>
            {(() => {
              switch (currentPage) {
                case 'triangle':
                  return <TriangleView />
                case 'triangle-detail':
                  return <TriangleDetail />
                case 'wallet':
                  return <Wallet />
                case 'referrals':
                  return <Referrals />
                default:
                  return <Dashboard onNavigate={handleNavigate} />
              }
            })()}
          </main>
        </div>
      )
    }

    return <LoginForm onNavigate={handleNavigate} />
  }

  return (
    <div className="App">
      {renderPage()}
      <NotificationContainer />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}