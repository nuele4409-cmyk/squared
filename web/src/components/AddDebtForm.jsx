import { useEffect, useState } from 'react'
import { isAddress, parseEther } from 'viem'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { LEDGER_ADDRESS, LEDGER_ABI } from '../config'

export function AddDebtForm({ onCreated }) {
  const { address } = useAccount()
  const [creditor, setCreditor] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [formError, setFormError] = useState('')

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess) {
      setCreditor('')
      setAmount('')
      setReason('')
      onCreated()
    }
  }, [isSuccess, onCreated])

  const submit = (e) => {
    e.preventDefault()
    setFormError('')

    if (!isAddress(creditor)) {
      setFormError('Enter a valid wallet address for who you owe.')
      return
    }
    if (creditor.toLowerCase() === address?.toLowerCase()) {
      setFormError('You cannot owe yourself.')
      return
    }
    const value = Number(amount)
    if (!value || value <= 0) {
      setFormError('Enter an amount greater than 0.')
      return
    }

    reset()
    writeContract({
      address: LEDGER_ADDRESS,
      abi: LEDGER_ABI,
      functionName: 'createDebt',
      args: [creditor, parseEther(amount), reason || 'no reason given'],
    })
  }

  const busy = isPending || isConfirming

  return (
    <form className="add-debt-form" onSubmit={submit}>
      <h2>Log a debt</h2>
      <p className="form-hint">Who do you owe, and for what?</p>

      <label className="field">
        <span>Who you owe (wallet address)</span>
        <input
          className="mono"
          type="text"
          placeholder="0x…"
          value={creditor}
          onChange={(e) => setCreditor(e.target.value.trim())}
        />
      </label>

      <label className="field">
        <span>Amount (MON)</span>
        <input
          className="mono"
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Reason</span>
        <input
          type="text"
          placeholder="data, transport, lunch…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={80}
        />
      </label>

      {formError && <p className="error-text">{formError}</p>}
      {error && <p className="error-text">{error.shortMessage ?? error.message}</p>}

      <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
        {busy ? 'Recording…' : 'Add debt'}
      </button>
    </form>
  )
}
