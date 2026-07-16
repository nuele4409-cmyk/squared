import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { DebtRow } from './DebtRow'
import { DebtDetail } from './DebtDetail'
import { truncateAddress, formatMon } from '../lib/format'

export function Dashboard({ debts, isLoading, refetch }) {
  const { address } = useAccount()
  const [selected, setSelected] = useState(null)

  const { totalOwe, totalOwed, groups } = useMemo(() => {
    const unsettled = debts.filter((d) => !d.settled)
    let totalOwe = 0n
    let totalOwed = 0n
    const byPerson = new Map()

    for (const d of unsettled) {
      const iAmDebtor = d.debtor.toLowerCase() === address?.toLowerCase()
      const counterparty = (iAmDebtor ? d.creditor : d.debtor).toLowerCase()

      if (!byPerson.has(counterparty)) {
        byPerson.set(counterparty, { address: iAmDebtor ? d.creditor : d.debtor, net: 0n, debts: [] })
      }
      const g = byPerson.get(counterparty)
      g.debts.push(d)

      if (iAmDebtor) {
        totalOwe += d.amount
        g.net -= d.amount
      } else {
        totalOwed += d.amount
        g.net += d.amount
      }
    }

    const groups = [...byPerson.values()].sort((a, b) => {
      const diff = (b.net < 0n ? -b.net : b.net) - (a.net < 0n ? -a.net : a.net)
      return diff > 0n ? 1 : diff < 0n ? -1 : 0
    })

    return { totalOwe, totalOwed, groups }
  }, [debts, address])

  if (isLoading) {
    return <div className="empty-state">Reading the ledger…</div>
  }

  return (
    <div className="dashboard">
      <div className="stat-row">
        <div className="stat-tile">
          <span className="stat-label">You owe</span>
          <span className="stat-value owe mono">{formatMon(totalOwe)} MON</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Owed to you</span>
          <span className="stat-value owed mono">{formatMon(totalOwed)} MON</span>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <p>All squared up. No open debts.</p>
        </div>
      ) : (
        <div className="person-groups">
          {groups.map((g) => (
            <div key={g.address} className="person-group">
              <div className="person-group-header">
                <span className="mono">{truncateAddress(g.address, 6)}</span>
                <span className={`mono net-badge ${g.net >= 0n ? 'owed' : 'owe'}`}>
                  {g.net >= 0n ? 'owes you ' : 'you owe '}
                  {formatMon(g.net >= 0n ? g.net : -g.net)} MON
                </span>
              </div>
              {g.debts.map((d) => (
                <DebtRow key={d.id.toString()} debt={d} myAddress={address} onClick={setSelected} />
              ))}
            </div>
          ))}
        </div>
      )}

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
