'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { config } from '@/config/wagmi'
import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <input value={instrument} onChange={(e) => setInstrument(e.target.value)} placeholder="Instrument (e.g. XAU/USD)" className="border p-2 rounded" />
      <input value={setupTag} onChange={(e) => setSetupTag(e.target.value)} placeholder="Setup (e.g. Bullish Engulfing)" className="border p-2 rounded" />
      <input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="Entry price" type="number" step="0.01" className="border p-2 rounded" />
      <input value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} placeholder="Exit price" type="number" step="0.01" className="border p-2 rounded" />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isLong} onChange={(e) => setIsLong(e.target.checked)} />
        Long position
      </label>
      <button type="submit" disabled={isPending || isConfirming} className="border p-2 rounded font-medium">
        {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Logging...' : 'Log Trade'}
      </button>
      {isSuccess && <p>Trade logged onchain!</p>}
    </form>
  )
}