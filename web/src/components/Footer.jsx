export function Footer() {
  return (
    <footer className="app-footer">
      <div className="wordmark-small footer-wordmark">
        Squared<span className="stamp-dot">²</span>
      </div>
      <p className="footer-copy">© 2026 Squared. Built for the Monad ecosystem.</p>
      <nav className="footer-links">
        <a href="https://github.com/nuele4409-cmyk/squared" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://testnet.monadexplorer.com" target="_blank" rel="noreferrer">
          Explorer
        </a>
        <a href="https://monad.xyz" target="_blank" rel="noreferrer">
          Monad
        </a>
      </nav>
    </footer>
  )
}
