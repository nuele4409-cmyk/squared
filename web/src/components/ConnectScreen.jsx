import { useAppKit } from '@reown/appkit/react'
import { Footer } from './Footer'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
    title: 'Log a debt',
    body: 'Pick who you owe, an amount, a reason. One transaction on Monad — done.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Settle onchain',
    body: 'Pay the MON directly through the contract — marked settled automatically.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path
          d="M9 12l2 2 4-4M4 6h16v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6zM4 6l8-4 8 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Confirm offline',
    body: 'Paid cash or by transfer? Only the person owed can confirm it — never the debtor.',
  },
]

function PreviewLedger() {
  return (
    <div className="preview-card">
      <div className="stat-row">
        <div className="stat-tile">
          <span className="stat-label">You owe</span>
          <span className="stat-value owe mono">32 MON</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Owed to you</span>
          <span className="stat-value owed mono">50 MON</span>
        </div>
      </div>
      <div className="person-groups">
        <div className="person-group">
          <div className="person-group-header">
            <span className="mono">0xC159…32d6</span>
            <span className="mono net-badge owed">owes you 50 MON</span>
          </div>
          <div className="debt-row">
            <div className="debt-row-main">
              <span className="direction-dot owed" />
              <div className="debt-row-text">
                <span className="debt-reason">Data</span>
                <span className="debt-counterparty mono">from 0xC159…32d6</span>
              </div>
            </div>
            <div className="debt-row-side">
              <span className="debt-amount mono owed">+50 MON</span>
              <span className="pill pill-open">open</span>
            </div>
          </div>
        </div>
        <div className="person-group">
          <div className="person-group-header">
            <span className="mono">0x7A21…9fE0</span>
            <span className="mono net-badge owe">you owe 32 MON</span>
          </div>
          <div className="debt-row">
            <div className="debt-row-main">
              <span className="direction-dot owe" />
              <div className="debt-row-text">
                <span className="debt-reason">Transport</span>
                <span className="debt-counterparty mono">to 0x7A21…9fE0</span>
              </div>
            </div>
            <div className="debt-row-side">
              <span className="debt-amount mono owe">-32 MON</span>
              <span className="pill pill-open">open</span>
            </div>
          </div>
        </div>
      </div>
      <div className="preview-lock">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="22" height="22">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
        </svg>
        <p>Connect a wallet to see your own ledger</p>
      </div>
    </div>
  )
}

export function ConnectScreen() {
  const { open } = useAppKit()

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="wordmark-small">
          Squared<span className="stamp-dot">²</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => open()}>
          Connect Wallet
        </button>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-text">
          <div className="stamp">№ 2²</div>
          <h1 className="landing-headline">
            The ledger for small debts <span className="accent">between friends.</span>
          </h1>
          <p className="pitch">
            Transport money, data top-ups, a lunch someone covered — track it
            onchain so "I already paid you" never happens again.
          </p>
          <button type="button" className="btn btn-primary btn-lg landing-cta" onClick={() => open()}>
            Connect Wallet
          </button>
          <p className="network-note">Runs on Monad Testnet · Chain ID 10143</p>
        </div>
        <div className="landing-hero-preview">
          <PreviewLedger />
        </div>
      </section>

      <section className="landing-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}
