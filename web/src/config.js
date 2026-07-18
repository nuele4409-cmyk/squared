import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { monadTestnet, monadMainnet, SUPPORTED_CHAINS } from './chain'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

const metadata = {
  name: 'Squared',
  description: 'Onchain IOU tracker for small debts between friends',
  url: 'https://squared-alpha.vercel.app',
  icons: ['https://squared-alpha.vercel.app/favicon.svg'],
}

const wagmiAdapter = new WagmiAdapter({
  networks: SUPPORTED_CHAINS,
  projectId,
  ssr: false,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: SUPPORTED_CHAINS,
  projectId,
  metadata,
  themeVariables: { '--w3m-accent': '#6c4cf7' },
  features: { analytics: false, email: false, socials: false, swaps: false, onramp: false, send: false },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

// SquaredLedger deployed separately per network — testnet via faucet MON,
// mainnet with real MON. Empty string means "not deployed on this chain yet."
const LEDGER_ADDRESSES = {
  [monadTestnet.id]: import.meta.env.VITE_LEDGER_ADDRESS_TESTNET || '',
  [monadMainnet.id]: import.meta.env.VITE_LEDGER_ADDRESS_MAINNET || '',
}

export function getLedgerAddress(chainId) {
  return LEDGER_ADDRESSES[chainId] || ''
}

export const LEDGER_ABI = [
  {
    type: 'function',
    name: 'createDebt',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'creditor', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'settleOnchain',
    stateMutability: 'payable',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'confirmOfflineSettlement',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getUserDebts',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    type: 'function',
    name: 'getDebt',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'debtor', type: 'address' },
          { name: 'creditor', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'reason', type: 'string' },
          { name: 'settled', type: 'bool' },
          { name: 'settledOnchain', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'settledAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'event',
    name: 'DebtCreated',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'debtor', type: 'address', indexed: true },
      { name: 'creditor', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'reason', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'DebtSettled',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'onchain', type: 'bool', indexed: false },
    ],
  },
]
