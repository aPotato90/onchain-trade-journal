'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-2 items-end">
        {connectors.slice(0, 3).map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="font-mono text-xs px-3 py-2 border border-border rounded hover:border-gold hover:text-gold transition-colors disabled:opacity-40"
          >
            Connect {connector.name}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 font-mono text-sm">
      <span className="px-3 py-1.5 bg-surface border border-border rounded text-gold">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="text-muted hover:text-loss transition-colors"
      >
        Disconnect
      </button>
    </div>
  )
}