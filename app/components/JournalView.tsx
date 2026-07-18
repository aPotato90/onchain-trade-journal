'use client'

import { useAccount, useReadContract } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { TRADE_JOURNAL_ADDRESS, tradeJournalAbi } from '@/config/tradeJournal'

export function JournalView() {
  const { address, isConnected } = useAccount()

  const { data: trades, isLoading, refetch } = useReadContract({
    address: TRADE_JOURNAL_ADDRESS,
    abi: tradeJournalAbi,
    functionName: 'getTrades',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: { enabled: !!address },
  })

  if (!isConnected) return <p>Connect your wallet to see your journal.</p>
  if (isLoading) return <p>Loading trades...</p>
  if (!trades || trades.length === 0) return <p>No trades logged yet.</p>

  const wins = trades.filter((t) =>
    t.isLong ? t.exitPrice > t.entryPrice : t.exitPrice < t.entryPrice
  ).length

  return (
    <div className="w-full max-w-2xl">
      <p className="mb-4 font-medium">
        {trades.length} trades logged · {((wins / trades.length) * 100).toFixed(0)}% win rate
      </p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Instrument</th>
            <th className="p-2">Setup</th>
            <th className="p-2">Entry</th>
            <th className="p-2">Exit</th>
            <th className="p-2">Side</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{t.instrument}</td>
              <td className="p-2">{t.setupTag}</td>
              <td className="p-2">{(Number(t.entryPrice) / 100).toFixed(2)}</td>
              <td className="p-2">{(Number(t.exitPrice) / 100).toFixed(2)}</td>
              <td className="p-2">{t.isLong ? 'Long' : 'Short'}</td>
              <td className="p-2">
                {new Date(Number(t.timestamp) * 1000).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}