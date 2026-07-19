'use client'

import { useAccount } from 'wagmi'
import { TradeTable } from './TradeTable'
import { ShareModal } from './ShareModal'

export function JournalView() {
  const { address, isConnected } = useAccount()

  if (!isConnected || !address) {
    return (
      <div className="border border-border rounded-lg bg-surface p-10 text-center">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Connect your wallet to see your journal
        </p>
      </div>
    )
  }

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${address}` : ''

  return (
    <div>
      <div className="flex justify-end mb-3">
        <ShareModal url={profileUrl} />
      </div>
      <TradeTable address={address} />
    </div>
  )
}