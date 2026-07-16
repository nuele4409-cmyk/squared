import { useConnect } from 'wagmi'

export function ConnectScreen() {
  const { connectors, connect, isPending, error } = useConnect()
  const injected = connectors.find((c) => c.id === 'injected') ?? connectors[0]

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
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => connect({ connector: injected })}
          disabled={isPending || !injected}
        >
          {isPending ? 'Connecting…' : 'Connect Wallet'}
        </button>
        {error && <p className="error-text">{error.shortMessage ?? error.message}</p>}
        {!injected && (
          <p className="error-text">
            No injected wallet found. Install MetaMask to continue.
          </p>
        )}
        <p className="network-note">Runs on Monad Testnet · Chain ID 10143</p>
      </div>
    </div>
  )
}
