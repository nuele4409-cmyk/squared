import { useState } from 'react'
import { useAccount } from 'wagmi'
import { DebtRow } from './DebtRow'
import { DebtDetail } from './DebtDetail'
import { HistorySkeleton } from './Skeleton'

export function History({ debts, isLoading, refetch }) {
  const { address } = useAccount()
  const [selected, setSelected] = useState(null)

  if (isLoading) {
    return <HistorySkeleton />
  }

  if (debts.length === 0) {
    return <div className="empty-state">No entries yet.</div>
  }

  return (
    <div className="history-list fade-in">
      {debts.map((d) => (
        <DebtRow key={d.id.toString()} debt={d} myAddress={address} onClick={setSelected} />
      ))}

      {selected && (
        <DebtDetail
          debt={selected}
          onClose={() => setSelected(null)}
          onSettled={() => {
            refetch()
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}
