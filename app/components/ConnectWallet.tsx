'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (isConnected) setIsOpen(false)
  }, [isConnected])

  if (isConnected) {
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-mono text-xs px-4 py-2.5 border border-gold text-gold rounded hover:bg-gold hover:text-[#0A0E14] transition-colors"
      >
        Connect Wallet
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-surface border border-border rounded-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">
                Connect a wallet
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-text text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                  className="flex items-center gap-3 px-3 py-2.5 border border-border rounded hover:border-gold transition-colors disabled:opacity-40 text-left"
                >
                  {connector.icon ? (
                    <img src={connector.icon} alt="" className="w-6 h-6 rounded" />
                  ) : (
                    <span className="w-6 h-6 rounded bg-border flex items-center justify-center font-mono text-[10px] text-muted">
                      {connector.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="font-mono text-sm">{connector.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}