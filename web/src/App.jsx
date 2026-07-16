import { useState } from 'react'
import { useAccount } from 'wagmi'
import './App.css'
import { ConnectScreen } from './components/ConnectScreen'
import { Header } from './components/Header'
import { TabNav } from './components/TabNav'
import { Dashboard } from './components/Dashboard'
import { AddDebtForm } from './components/AddDebtForm'
import { History } from './components/History'
import { useDebts } from './hooks/useDebts'
import { LEDGER_ADDRESS } from './config'

function App() {
  const { isConnected } = useAccount()
  const [tab, setTab] = useState('dashboard')
  const { debts, isLoading, refetch } = useDebts()

  if (!isConnected) {
    return <ConnectScreen />
  }

  if (!LEDGER_ADDRESS) {
    return (
      <div className="connect-screen">
        <div className="connect-card">
          <h1 className="wordmark">Squared</h1>
          <p className="error-text">
            No contract address configured. Set VITE_LEDGER_ADDRESS in web/.env after
            deploying SquaredLedger.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header />
      <TabNav active={tab} onChange={setTab} />
      <main className="app-main">
        {tab === 'dashboard' && <Dashboard debts={debts} isLoading={isLoading} refetch={refetch} />}
        {tab === 'add' && (
          <AddDebtForm
            onCreated={() => {
              refetch()
              setTab('dashboard')
            }}
          />
        )}
        {tab === 'history' && <History debts={debts} isLoading={isLoading} refetch={refetch} />}
      </main>
    </div>
  )
}

export default App
