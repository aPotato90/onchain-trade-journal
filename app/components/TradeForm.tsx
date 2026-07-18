'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { baseSepolia } from 'wagmi/chains'
import { TRADE_JOURNAL_ADDRESS, tradeJournalAbi } from '@/config/tradeJournal'

export function TradeForm() {
  const [instrument, setInstrument] = useState('XAU/USD')
  const [setupTag, setSetupTag] = useState('')
  const [entryPrice, setEntryPrice] = useState('')
  const [exitPrice, setExitPrice] = useState('')
  const [isLong, setIsLong] = useState(true)

  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['readContract'] })
    }
  }, [isSuccess, queryClient])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    writeContract({
      address: TRADE_JOURNAL_ADDRESS,
      abi: tradeJournalAbi,
      functionName: 'logTrade',
      args: [
        instrument,
        setupTag,
        BigInt(Math.round(parseFloat(entryPrice) * 100)),
        BigInt(Math.round(parseFloat(exitPrice) * 100)),
        isLong,
      ],
      chainId: baseSepolia.id,
    })
  }

  const inputClass =
    "w-full bg-transparent border border-border rounded px-3 py-2.5 font-mono text-sm placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
  const labelClass = "font-mono text-[11px] tracking-widest text-muted uppercase mb-1.5 block"

  return (
    <div className="border border-border rounded-lg bg-surface p-6">
      <p className="font-mono text-[11px] tracking-widest text-muted uppercase mb-5">
        New Entry
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Instrument</label>
            <input value={instrument} onChange={(e) => setInstrument(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Setup</label>
            <input value={setupTag} onChange={(e) => setSetupTag(e.target.value)} placeholder="Bullish Engulfing" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Entry price</label>
            <input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} type="number" step="0.01" placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Exit price</label>
            <input value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} type="number" step="0.01" placeholder="0.00" className={inputClass} />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsLong(true)}
            className={`flex-1 py-2 rounded font-mono text-xs tracking-wide uppercase border transition-colors ${
              isLong ? 'bg-win/10 border-win text-win' : 'border-border text-muted hover:border-win/50'
            }`}
          >
            Long
          </button>
          <button
            type="button"
            onClick={() => setIsLong(false)}
            className={`flex-1 py-2 rounded font-mono text-xs tracking-wide uppercase border transition-colors ${
              !isLong ? 'bg-loss/10 border-loss text-loss' : 'border-border text-muted hover:border-loss/50'
            }`}
          >
            Short
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="mt-2 py-3 rounded font-mono text-sm tracking-wide uppercase bg-gold text-[#0A0E14] font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {isPending ? 'Confirm in wallet...' : isConfirming ? 'Logging onchain...' : 'Log trade'}
        </button>

        {isSuccess && (
          <p className="font-mono text-xs text-win text-center">Trade logged onchain</p>
        )}
      </form>
    </div>
  )
}