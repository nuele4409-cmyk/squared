import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import './App.css'
import { ConnectScreen } from './components/ConnectScreen'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { TabNav } from './components/TabNav'
import { Dashboard } from './components/Dashboard'
import { AddDebtForm } from './components/AddDebtForm'
import { History } from './components/History'
import { useDebts } from './hooks/useDebts'
import { getLedgerAddress } from './config'

function App() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const ledgerAddress = getLedgerAddress(chainId)
  const [tab, setTab] = useState('dashboard')
  const { debts, isLoading, refetch } = useDebts()

  if (!isConnected) {
    return <ConnectScreen />
  }

  return (
    <div className="app-shell">
      <Header />

      {!ledgerAddress && (
        <div className="network-banner">
          Squared isn't deployed on this network yet — switch to Monad Testnet or Mainnet
          using the network button above.
        </div>
      )}

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
      <Footer />
    </div>
  )
}

export default App
