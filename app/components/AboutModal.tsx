'use client'

import { useEffect, useState } from 'react'

const HOW_TO_STEPS = [
  { title: 'Connect your wallet', body: 'Click "Connect Wallet" and pick MetaMask, Coinbase, or any wallet you have installed. No sign-up, no email.' },
  { title: 'Log a trade', body: 'Fill in the instrument, your setup (e.g. "Bullish Engulfing"), entry price, exit price, and whether you went long or short. Click "Log Trade" and confirm in your wallet.' },
  { title: "It's now permanent", body: 'Your trade is written onchain, timestamped, tied to your wallet. Nobody — including you — can secretly edit it afterward.' },
  { title: 'Made a mistake?', body: 'You can void a trade from your journal. It stays visible, struck through, but is excluded from your stats. Nothing is ever silently deleted.' },
  { title: 'Share your track record', body: 'Click "Share your public profile" to get a link anyone can view — no wallet needed on their end — showing your real win rate and P&L.' },
]

const FAQ_ITEMS = [
  {
    q: 'Is my wallet address public?',
    a: 'Yes — this is true of any onchain app, not just this one. Wallet addresses and their full history are public on Base by design. This app doesn\'t add extra exposure beyond what already exists on the blockchain.',
  },
  {
    q: 'Does logging a trade cost money?',
    a: 'Yes, a small network gas fee — usually a fraction of a cent to a few cents on Base. You pay this directly to the network, not to us.',
  },
  {
    q: 'Can I edit or delete a trade after logging it?',
    a: 'No — that would defeat the point of a provable record. You can void a trade instead, which excludes it from your stats but keeps it visible, so nothing is quietly erased.',
  },
  {
    q: 'Do I need to know how to code or use crypto?',
    a: 'No. You just need any browser wallet extension (like MetaMask) and a small amount of ETH on Base to cover gas fees.',
  },
  {
    q: 'Is this custodial? Do you hold my funds?',
    a: 'No. This app never touches your money — it only writes trade records to a smart contract. You always sign every action yourself in your own wallet.',
  },
]

export function AboutModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<'about' | 'how' | 'faq'>('about')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const tabs: { id: 'about' | 'how' | 'faq'; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'how', label: 'How to use' },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="About this app"
        className="w-8 h-8 rounded-full border border-border text-muted hover:border-gold hover:text-gold transition-colors font-mono text-xs flex items-center justify-center"
      >
        ?
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] flex flex-col bg-surface border border-border rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <p className="font-mono text-[11px] tracking-widest text-gold uppercase">
                Trade Journal
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-text text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="flex gap-1 px-5 pt-4 border-b border-border">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`font-mono text-xs uppercase tracking-wide px-3 py-2.5 border-b-2 transition-colors ${
                    tab === t.id
                      ? 'border-gold text-gold'
                      : 'border-transparent text-muted hover:text-text'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5 overflow-y-auto">
              {tab === 'about' && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium">Trade Journal</span> is a provable, tamper-proof
                    record of your trades — written directly onchain on Base. Every entry is
                    timestamped and tied to your wallet, so your track record can&apos;t be faked
                    or quietly edited after the fact.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border rounded p-3">
                      <p className="font-mono text-[10px] tracking-widest text-gold uppercase mb-1">Provable</p>
                      <p className="text-xs text-muted">Every trade is a real onchain transaction, not a screenshot.</p>
                    </div>
                    <div className="border border-border rounded p-3">
                      <p className="font-mono text-[10px] tracking-widest text-gold uppercase mb-1">Shareable</p>
                      <p className="text-xs text-muted">Public profile link anyone can view, no wallet required.</p>
                    </div>
                    <div className="border border-border rounded p-3">
                      <p className="font-mono text-[10px] tracking-widest text-gold uppercase mb-1">Honest</p>
                      <p className="text-xs text-muted">Mistakes can be voided, never silently deleted.</p>
                    </div>
                    <div className="border border-border rounded p-3">
                      <p className="font-mono text-[10px] tracking-widest text-gold uppercase mb-1">Non-custodial</p>
                      <p className="text-xs text-muted">We never touch your funds — only trade records.</p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'how' && (
                <ol className="flex flex-col gap-4">
                  {HOW_TO_STEPS.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-xs text-gold border border-gold/40 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium mb-0.5">{step.title}</p>
                        <p className="text-xs text-muted leading-relaxed">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {tab === 'faq' && (
                <div className="flex flex-col gap-2">
                  {FAQ_ITEMS.map((item, i) => (
                    <div key={i} className="border border-border rounded">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                      >
                        <span className="text-sm font-medium">{item.q}</span>
                        <span className="text-gold font-mono text-sm flex-shrink-0 ml-2">
                          {openFaq === i ? '−' : '+'}
                        </span>
                      </button>
                      {openFaq === i && (
                        <p className="px-3 pb-3 text-xs text-muted leading-relaxed">{item.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}