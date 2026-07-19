'use client'

import { useEffect, useState } from 'react'

export function ShareModal({ url }: { url: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const encodedUrl = encodeURIComponent(url)
  const shareText = encodeURIComponent('Check out my provable onchain trade journal')

  const shareTargets = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
      bg: '#25D366',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.876.52 3.633 1.42 5.13L2 22l4.994-1.394A9.947 9.947 0 0012.001 22C17.523 22 22 17.522 22 12S17.523 2 12.001 2zm0 18.117a8.09 8.09 0 01-4.127-1.128l-.296-.176-3.065.856.83-3.03-.192-.31A8.088 8.088 0 013.884 12c0-4.481 3.636-8.117 8.117-8.117 4.48 0 8.116 3.636 8.116 8.117 0 4.48-3.635 8.117-8.116 8.117z" />
        </svg>
      ),
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      bg: '#000000',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
      bg: '#26A5E4',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M21.998 3.5a1.5 1.5 0 00-2.06-1.39L2.36 9.36a1.5 1.5 0 00.1 2.79l4.55 1.6 1.86 5.8a1.5 1.5 0 002.5.62l2.5-2.4 4.4 3.24a1.5 1.5 0 002.36-.92l3.36-15.19a1.5 1.5 0 00-.02-.4zM8.9 13.5l9.1-6.9-7.6 8.3-.4 3.2z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: '#1877F2',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.25c0-.87.24-1.46 1.5-1.46h1.6V4.14C15.85 4.1 15.02 4 14.03 4 11.98 4 10.5 5.24 10.5 7.98V10.5H8v3h2.5V21h3z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-mono text-xs text-gold hover:underline"
      >
        Share your public profile →
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
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">
                Share your journal
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-text text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              {shareTargets.map((target) => (
                
                 <a key={target.name}
                  href={target.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: target.bg }}
                  >
                    {target.icon}
                  </span>
                  <span className="font-mono text-[10px] text-muted">{target.name}</span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 border border-border rounded px-3 py-2">
              <span className="flex-1 font-mono text-xs text-muted truncate">{url}</span>
              <button
                onClick={handleCopy}
                className="font-mono text-[11px] px-2.5 py-1 rounded bg-gold text-[#0A0E14] font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}