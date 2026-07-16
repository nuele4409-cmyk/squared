import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { LEDGER_ADDRESS, LEDGER_ABI } from '../config'

export function useDebts() {
  const { address } = useAccount()

  const idsQuery = useReadContract({
    address: LEDGER_ADDRESS,
    abi: LEDGER_ABI,
    functionName: 'getUserDebts',
    args: [address],
    query: { enabled: Boolean(address && LEDGER_ADDRESS) },
  })

  const ids = idsQuery.data ?? []

  const debtsQuery = useReadContracts({
    contracts: ids.map((id) => ({
      address: LEDGER_ADDRESS,
      abi: LEDGER_ABI,
      functionName: 'getDebt',
      args: [id],
    })),
    query: { enabled: ids.length > 0 },
  })

  const debts = (debtsQuery.data ?? [])
    .map((r) => r.result)
    .filter(Boolean)
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

  const refetch = () => {
    idsQuery.refetch()
    debtsQuery.refetch()
  }

  return {
    debts,
    isLoading: idsQuery.isLoading || debtsQuery.isLoading,
    refetch,
  }
}
