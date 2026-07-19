'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { base } from 'wagmi/chains'
import { TRADE_JOURNAL_ADDRESS, tradeJournalAbi } from '@/config/tradeJournal'

export function TradeTable({ address }: { address: `0x${string}` }) {
  const { address: connectedAddress } = useAccount()
  const isOwner = connectedAddress?.toLowerCase() === address.toLowerCase()

  const { data: trades, isLoading } = useReadContract({
    address: TRADE_JOURNAL_ADDRESS,
    abi: tradeJournalAbi,
    functionName: 'getTrades',
    args: [address],
    chainId: base.id,
  })

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)

  useEffect(() => {
  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['readContract'] })
    // Safety net: RPC nodes can briefly lag behind the latest confirmed block,
    // so retry the refetch a couple more times over the next few seconds.
    const retry1 = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['readContract'] })
    }, 2000)
    const retry2 = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['readContract'] })
    }, 5000)
    return () => {
      clearTimeout(retry1)
      clearTimeout(retry2)
    }
  }
}, [isSuccess, queryClient])

  function handleVoid(index: number) {
    if (!confirm('Void this trade? This is permanent — it will stay visible but excluded from your stats.')) return
    setPendingIndex(index)
    writeContract({
      address: TRADE_JOURNAL_ADDRESS,
      abi: tradeJournalAbi,
      functionName: 'voidTrade',
      args: [BigInt(index)],
      chainId: base.id,
    })
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
      </div>
    )
  }

  // Only count non-voided trades toward stats
  const activeTrades = trades
    .map((t, i) => ({ ...t, originalIndex: i }))
    .filter((t) => !t.voided)

  const pnlPoints = activeTrades.map((t) => {
    const entry = Number(t.entryPrice) / 100
    const exit = Number(t.exitPrice) / 100
    return t.isLong ? exit - entry : entry - exit
  })

  const results = pnlPoints.map((p) => p > 0)
  const wins = results.filter(Boolean).length
  const winRate = activeTrades.length > 0 ? ((wins / activeTrades.length) * 100).toFixed(0) : '0'
  const totalPnl = pnlPoints.reduce((sum, p) => sum + p, 0)

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-wrap gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-widest text-muted uppercase mb-1">
            Journal
          </p>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
            {winRate}%{' '}
            <span className="text-sm text-muted font-normal font-[family-name:var(--font-body)]">
              win rate · {activeTrades.length} trades
              {trades.length !== activeTrades.length && ` · ${trades.length - activeTrades.length} voided`}
            </span>
          </p>
          <p className={`font-mono text-sm mt-1 ${totalPnl >= 0 ? 'text-win' : 'text-loss'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} pts total
          </p>
        </div>
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
            <th className="text-right font-mono text-[11px] tracking-widest text-muted uppercase px-3 py-3 font-medium">P&L</th>
            <th className="text-center font-mono text-[11px] tracking-widest text-muted uppercase px-3 py-3 font-medium">Side</th>
            <th className="text-right font-mono text-[11px] tracking-widest text-muted uppercase px-3 py-3 font-medium">Date</th>
            {isOwner && <th className="px-6 py-3"></th>}
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => {
            const entry = Number(t.entryPrice) / 100
            const exit = Number(t.exitPrice) / 100
            const pnl = t.isLong ? exit - entry : entry - exit

            return (
              <tr key={i} className={`border-b border-border last:border-0 ${t.voided ? 'opacity-40' : ''}`}>
                <td className={`px-6 py-3.5 font-medium ${t.voided ? 'line-through' : ''}`}>{t.instrument}</td>
                <td className={`px-3 py-3.5 text-muted ${t.voided ? 'line-through' : ''}`}>{t.setupTag}</td>
                <td className="px-3 py-3.5 text-right font-mono">{entry.toFixed(2)}</td>
                <td className="px-3 py-3.5 text-right font-mono">{exit.toFixed(2)}</td>
                <td className={`px-3 py-3.5 text-right font-mono ${pnl >= 0 ? 'text-win' : 'text-loss'}`}>
                  {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                </td>
                <td className="px-3 py-3.5 text-center">
                  <span className={`font-mono text-[11px] px-2 py-0.5 rounded uppercase ${t.isLong ? 'text-win bg-win/10' : 'text-loss bg-loss/10'}`}>
                    {t.isLong ? 'Long' : 'Short'}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-right font-mono text-muted text-xs">
                  {new Date(Number(t.timestamp) * 1000).toLocaleDateString()}
                </td>
                {isOwner && (
                  <td className="px-6 py-3.5 text-right">
                    {t.voided ? (
                      <span className="font-mono text-[10px] text-muted uppercase">Voided</span>
                    ) : (
                      <button
                        onClick={() => handleVoid(i)}
                        disabled={isPending || isConfirming}
                        className="font-mono text-[10px] text-muted hover:text-loss transition-colors uppercase disabled:opacity-40"
                      >
                        {pendingIndex === i && (isPending || isConfirming) ? '...' : 'Void'}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}