# Squared

An onchain IOU tracker for the small debts that live in group chats and memory —
transport money, data top-ups, a lunch someone covered.

Built for the Spark Hackathon (BuildAnything × Monad).

**Live app:** https://squared-alpha.vercel.app
**Repo:** https://github.com/nuele4409-cmyk/squared

## Problem

Small informal debts between friends, roommates, and hostel-mates have no shared
record, no dispute trail, and produce constant "I already paid you" arguments.

## Solution

Two people log a debt onchain. It shows up on both sides. It gets settled either by
an actual onchain MON payment, or by the person who's owed confirming they got paid
another way — so no one can unilaterally erase a debt they owe. Every entry is a
transaction on Monad Testnet, so the history can't be quietly edited later.

## How it works

1. Connect a wallet — MetaMask, Coinbase Wallet, or any mobile wallet via WalletConnect's
   QR code, through a proper multi-wallet picker (not a single hardcoded connector).
2. **Add a debt** — pick who you owe, an amount in MON, and a short reason.
3. **Dashboard** — see what you owe and what's owed to you, grouped per person.
4. **Settle** a debt two ways:
   - Pay onchain — sends MON through the contract, auto-marked settled.
   - Confirm offline — only the creditor can confirm a debt was paid another way
     (cash, transfer), so a debtor can never clear their own debt.
5. **History** — a read-only, timestamped log of every debt ever logged.

## Project structure

```
contracts/   Foundry project — SquaredLedger.sol, tests, deploy script
web/         React + Vite frontend — wagmi + viem, injected() wallet connector
```

## Network

| | |
|---|---|
| Network | Monad Testnet |
| Chain ID | 10143 |
| RPC URL | https://testnet-rpc.monad.xyz |
| Explorer | https://testnet.monadexplorer.com |
| Faucet | https://faucet.monad.xyz |
| Currency | MON |

## Contract

**Address:** [`0x7EBbBb52D8f68FB826f2AE8364961fc42e3bEDaa`](https://testnet.monadexplorer.com/address/0x7EBbBb52D8f68FB826f2AE8364961fc42e3bEDaa) (Monad Testnet)

Verified on [MonadVision](https://testnet.monadvision.com/address/0x7EBbBb52D8f68FB826f2AE8364961fc42e3bEDaa)
and [Monadscan](https://testnet.monadscan.com/address/0x7EBbBb52D8f68FB826f2AE8364961fc42e3bEDaa).

`SquaredLedger.sol` (Solidity 0.8.24) — see [`contracts/src/SquaredLedger.sol`](contracts/src/SquaredLedger.sol).
This is an MVP contract for a testnet hackathon, not an audited contract — don't reuse
it as-is for anything holding real value.

### Build & test locally

Requires [Foundry](https://getfoundry.sh).

```bash
cd contracts
forge build
forge test
```

### Deploy

```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url monad_testnet --broadcast --account <your-keystore-account>
```

The same script also works against `--rpc-url monad_mainnet` (chain 143) — the contract
address resolution in the frontend (`web/src/config.js`) already supports both networks,
but Mainnet isn't deployed yet and is hidden from the app's network switcher until it is.

Then set the deployed address in `web/.env` (see `web/.env.example`):

```
VITE_LEDGER_ADDRESS_TESTNET=0x...
VITE_LEDGER_ADDRESS_MAINNET=0x...   # leave blank until actually deployed
```

## Frontend

Requires Node.js.

```bash
cd web
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

`.env` needs:
- `VITE_LEDGER_ADDRESS_TESTNET` — the deployed contract address (see above)
- `VITE_REOWN_PROJECT_ID` — a free project ID from [cloud.reown.com](https://cloud.reown.com), powers the multi-wallet connect modal (MetaMask, WalletConnect QR for mobile wallets, Coinbase, etc.)

## Testing the full loop

You need two funded testnet wallets (get MON from the faucet for both):

1. Wallet A logs a debt owed to Wallet B.
2. Wallet B sees it on their Dashboard as "owed to you."
3. Settle it either by having Wallet A pay onchain, or by having Wallet B confirm an
   offline settlement.
4. Check the History tab from either wallet — the entry shows as settled.
