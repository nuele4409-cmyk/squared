import { truncateAddress, formatMon, formatDate } from '../lib/format'

export function DebtRow({ debt, myAddress, onClick }) {
  const iAmDebtor = debt.debtor.toLowerCase() === myAddress?.toLowerCase()
  const counterparty = iAmDebtor ? debt.creditor : debt.debtor

  return (
    <button type="button" className="debt-row" onClick={() => onClick(debt)}>
      <div className="debt-row-main">
        <span className={`direction-dot ${iAmDebtor ? 'owe' : 'owed'}`} />
        <div className="debt-row-text">
          <span className="debt-reason">{debt.reason || 'no reason given'}</span>
          <span className="debt-counterparty mono">
            {iAmDebtor ? 'to' : 'from'} {truncateAddress(counterparty)}
          </span>
        </div>
      </div>
      <div className="debt-row-side">
        <span className={`debt-amount mono ${iAmDebtor ? 'owe' : 'owed'}`}>
          {iAmDebtor ? '-' : '+'}
          {formatMon(debt.amount)} MON
        </span>
        {debt.settled ? (
          <span className="pill pill-settled">
            settled {debt.settledOnchain ? 'onchain' : 'offline'}
          </span>
        ) : (
          <span className="pill pill-open">open</span>
        )}
        <span className="debt-date">{formatDate(debt.createdAt)}</span>
      </div>
    </button>
  )
}
