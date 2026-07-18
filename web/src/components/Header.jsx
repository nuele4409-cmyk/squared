export function Header() {
  return (
    <header className="app-header">
      <div className="wordmark-small">
        Squared<span className="stamp-dot">²</span>
      </div>
      <div className="header-right">
        <appkit-network-button />
        <appkit-account-button balance="show" />
      </div>
    </header>
  )
}
