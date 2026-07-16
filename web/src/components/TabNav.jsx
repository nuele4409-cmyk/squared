const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'add', label: 'Add Debt' },
  { id: 'history', label: 'History' },
]

export function TabNav({ active, onChange }) {
  return (
    <nav className="tab-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-btn${active === tab.id ? ' active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
