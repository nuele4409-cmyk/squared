import { useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { LEDGER_ADDRESS, LEDGER_ABI } from '../config'
import { truncateAddress, formatMon, formatDate } from '../lib/format'

export function DebtDetail({ debt, onClose, onSettled }) {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const iAmDebtor = debt.debtor.toLowerCase() === address?.toLowerCase()
  const iAmCreditor = debt.creditor.toLowerCase() === address?.toLowerCase()

  useEffect(() => {
    if (isSuccess) {
      onSettled()
    }
  }, [isSuccess, onSettled])

  const payOnchain = () => {
    reset()
    writeContract({
      address: LEDGER_ADDRESS,
      abi: LEDGER_ABI,
      functionName: 'settleOnchain',
      args: [debt.id],
      value: debt.amount,
    })
  }

  const confirmOffline = () => {
    reset()
    writeContract({
      address: LEDGER_ADDRESS,
      abi: LEDGER_ABI,
      functionName: 'confirmOfflineSettlement',
      args: [debt.id],
    })
  }

  const busy = isPending || isConfirming

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="stamp-small">IOU #{debt.id.toString()}</span>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="detail-amount mono">{formatMon(debt.amount)} MON</div>
        <p className="detail-reason">{debt.reason || 'no reason given'}</p>

        <dl className="detail-list">
          <dt>Debtor</dt>
          <dd className="mono">
            {truncateAddress(debt.debtor, 6)} {iAmDebtor && '(you)'}
          </dd>
          <dt>Creditor</dt>
          <dd className="mono">
            {truncateAddress(debt.creditor, 6)} {iAmCreditor && '(you)'}
          </dd>
          <dt>Created</dt>
          <dd>{formatDate(debt.createdAt)}</dd>
          {debt.settled && (
            <>
              <dt>Settled</dt>
              <dd>
                {formatDate(debt.settledAt)} · {debt.settledOnchain ? 'onchain payment' : 'confirmed offline'}
              </dd>
            </>
          )}
        </dl>

        {!debt.settled && iAmDebtor && (
          <button type="button" className="btn btn-primary btn-lg" onClick={payOnchain} disabled={busy}>
            {busy ? 'Confirming…' : `Pay ${formatMon(debt.amount)} MON onchain`}
          </button>
        )}

        {!debt.settled && iAmCreditor && (
          <button type="button" className="btn btn-secondary btn-lg" onClick={confirmOffline} disabled={busy}>
            {busy ? 'Confirming…' : 'Confirm I was paid another way'}
          </button>
        )}

        {!debt.settled && !iAmDebtor && !iAmCreditor && (
          <p className="error-text">You are not part of this debt.</p>
        )}

        {error && <p className="error-text">{error.shortMessage ?? error.message}</p>}
      </div>
    </div>
  )
}
