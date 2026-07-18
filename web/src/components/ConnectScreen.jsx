import { useAppKit } from '@reown/appkit/react'

export function ConnectScreen() {
  const { open } = useAppKit()

  return (
    <div className="connect-screen">
      <div className="connect-card">
        <div className="stamp">№ 2²</div>
        <h1 className="wordmark">Squared</h1>
        <p className="tagline">The ledger for small debts between friends.</p>
        <p className="pitch">
          Transport money, data top-ups, a lunch someone covered — track it
          onchain so "I already paid you" never happens again.
        </p>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => open()}>
          Connect Wallet
        </button>
        <p className="network-note">Runs on Monad Testnet · Chain ID 10143</p>
      </div>
    </div>
  )
}
