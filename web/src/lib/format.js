import { formatEther } from 'viem'

export function truncateAddress(address, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`
}

export function formatMon(wei) {
  if (wei === undefined || wei === null) return '0'
  const n = Number(formatEther(wei))
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

export function formatDate(unixSeconds) {
  if (!unixSeconds) return ''
  const n = Number(unixSeconds)
  if (n === 0) return ''
  return new Date(n * 1000).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
