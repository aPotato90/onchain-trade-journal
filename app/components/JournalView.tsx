'use client'

import { useAccount, useReadContract } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { TRADE_JOURNAL_ADDRESS, tradeJournalAbi } from '@/config/tradeJournal'

export function JournalView() {
  const { address, isConnected } = useAccount()

  const { data: trades, isLoading } = useReadContract({
    address: TRADE_JOURNAL_ADDRESS,
    abi: tradeJournalAbi,
    functionName: 'getTrades',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: { enabled: !!address },
  })

  if (!isConnected) {
    return (
      <div className="border border-border rounded-lg bg-surface p-10 text-center">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Connect your wallet to see your journal
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg bg-surface p-10 text-center">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">Loading trades...</p>
      </div>
    )
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-surface p-10 text-center">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">No trades logged yet</p>
        <p className="text-sm text-muted mt-1">Log your first trade above to start your onchain record.</p>
      </div>
    )
  }

  const results = trades.map((t) =>
    t.isLong ? t.exitPrice > t.entryPrice : t.exitPrice < t.entryPrice
  )
  const wins = results.filter(Boolean).length
  const winRate = ((wins / trades.length) * 100).toFixed(0)

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <p className="font-mono text-[11px] tracking-widest text-muted uppercase mb-1">
            Journal
          </p>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
            {winRate}%{' '}
            <span className="text-sm text-muted font-normal font-[family-name:var(--font-body)]">
              win rate · {trades.length} trades
            </span>
          </p>
        </div>
        {/* Signature element: win/loss strip, most recent last */}
        <div className="flex items-end gap-[3px] h-8">
          {results.map((won, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-sm ${won ? 'bg-win' : 'bg-loss'}`}
              style={{ height: won ? '100%' : '55%' }}
            />
          ))}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left font-mono text-[11px] tracking-widest text-muted uppercase px-6 py-3 font-medium">Instrument</th>
            <th className="text-left font-mono text-[11px] tracking-widest text-muted uppercase px-3 py-3 font-medium">Setup</th>
            <th className="text-right font-mono text-[11px] tracking-widest text-muted uppercase px-3 py-3 font-medium">Entry</th>
            <th className="text-right font-mono text-[11px] tracking-widest text-muted uppercase px-3 py-3 font-medium">Exit</th>
            <th className="text-center font-mono text-[11px] tracking-widest text-muted uppercase px-3 py-3 font-medium">Side</th>
            <th className="text-right font-mono text-[11px] tracking-widest text-muted uppercase px-6 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-6 py-3.5 font-medium">{t.instrument}</td>
              <td className="px-3 py-3.5 text-muted">{t.setupTag}</td>
              <td className="px-3 py-3.5 text-right font-mono">{(Number(t.entryPrice) / 100).toFixed(2)}</td>
              <td className="px-3 py-3.5 text-right font-mono">{(Number(t.exitPrice) / 100).toFixed(2)}</td>
              <td className="px-3 py-3.5 text-center">
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded uppercase ${t.isLong ? 'text-win bg-win/10' : 'text-loss bg-loss/10'}`}>
                  {t.isLong ? 'Long' : 'Short'}
                </span>
              </td>
              <td className="px-6 py-3.5 text-right font-mono text-muted text-xs">
                {new Date(Number(t.timestamp) * 1000).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}