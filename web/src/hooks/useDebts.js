import { useAccount, useChainId, useReadContract, useReadContracts } from 'wagmi'
import { getLedgerAddress, LEDGER_ABI } from '../config'

export function useDebts() {
  const { address } = useAccount()
  const chainId = useChainId()
  const ledgerAddress = getLedgerAddress(chainId)

  const idsQuery = useReadContract({
    address: ledgerAddress,
    abi: LEDGER_ABI,
    functionName: 'getUserDebts',
    args: [address],
    chainId,
    query: { enabled: Boolean(address && ledgerAddress) },
  })

  const ids = idsQuery.data ?? []

  const debtsQuery = useReadContracts({
    contracts: ids.map((id) => ({
      address: ledgerAddress,
      abi: LEDGER_ABI,
      functionName: 'getDebt',
      args: [id],
      chainId,
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
