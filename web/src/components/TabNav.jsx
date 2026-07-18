const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'add', label: 'Add Debt' },
  { id: 'history', label: 'History' },
]

export function TabNav({ active, onChange }) {
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.id === active))

  return (
    <nav className="tab-nav">
      <div
        className="tab-indicator"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
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
