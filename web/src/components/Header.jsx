import { useAccount, useDisconnect } from 'wagmi'
import { truncateAddress } from '../lib/format'

export function Header() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <header className="app-header">
      <div className="wordmark-small">
        Squared<span className="stamp-dot">²</span>
      </div>
      <div className="header-right">
        <span className="chip mono">{truncateAddress(address)}</span>
        <button type="button" className="btn btn-ghost" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    </header>
  )
}
