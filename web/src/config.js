import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { monadTestnet } from './chain'

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [injected()],
  transports: {
    [monadTestnet.id]: http(),
  },
})

// Filled in after `forge script script/Deploy.s.sol --broadcast` against Monad testnet.
export const LEDGER_ADDRESS = import.meta.env.VITE_LEDGER_ADDRESS || ''

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
