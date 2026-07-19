# Onchain Trade Journal

A provable, tamper-proof trade journal built on Base. Every trade you log is timestamped and written onchain — turning private trade notes into a public, honest track record that can't be faked or quietly edited after the fact.

**Live app:** [onchain-trade-journal.vercel.app](https://onchain-trade-journal.vercel.app)

## The problem

Traders who journal manually (spreadsheets, Notion, screenshots) run into two issues:

1. **No proof.** A screenshot claiming "I called this trade" is trivially fakeable.
2. **No shareable record.** Private journals can't be shown off or verified by anyone else.

## What this does

- **Connect your wallet** — no sign-up, no email, just your existing Base wallet.
- **Log a trade** — instrument, setup tag, entry/exit price, long or short. Written directly onchain, timestamped, tied to your wallet.
- **Personal journal** — win rate, points-based P&L, and full trade history, read live from the contract.
- **Public profile** — a shareable link (`/u/0xYourAddress`) anyone can view, no wallet required on their end.
- **Void, never delete** — mistakes happen. A trade can be voided (excluded from stats) but stays visible, struck through — nothing is ever silently erased.

## Tech stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Onchain:** Solidity, Foundry (compile/deploy), wagmi + viem (wallet + contract interaction)
- **Network:** Base mainnet
- **Hosting:** Vercel

## Smart contract

`contracts/src/TradeJournal.sol` — a single contract storing each trader's trades in a `Trade[]` mapped to their address. Key functions:

- `logTrade(instrument, setupTag, entryPrice, exitPrice, isLong)` — writes a new trade for `msg.sender`
- `voidTrade(index)` — permanently flags one of your own trades as voided (cannot be undone or double-voided)
- `getTrades(address)` — public view function, returns a trader's full history (including voided trades, since nothing is hidden)

Deployed on Base mainnet: `0x6a0104bAbbf7dB86AA65EC3F82b28BeF42186d9E`

## Known limitations / roadmap

- **P&L is points-based, not dollar-based.** The contract doesn't currently track position size or leverage, so P&L reflects raw price movement (exit − entry), not actual money gained or lost. Adding position size + leverage for real dollar/margin-adjusted P&L is a planned v2 change.
- **No setup leaderboard yet.** Aggregating win-rate by setup tag across all traders (e.g. "which patterns actually work") was scoped as a stretch goal — not in this version.
- **No custom username/handle.** Public profiles currently use the raw wallet address in the URL. A display-name layer is a planned UX improvement (note: this would not make wallet activity private — that's not possible on a public blockchain — just nicer to read and share).

## Running locally

```bash
git clone https://github.com/aPotato90/onchain-trade-journal.git
cd onchain-trade-journal/my-base-app
npm install
npm run dev
```

Requires a browser wallet extension (MetaMask, Coinbase Wallet, etc.) and a small amount of ETH on Base mainnet to log trades (gas fees only — this app is non-custodial and never touches your funds).