import { TradeTable } from '../../components/TradeTable'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address } = await params

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 gap-10">
      <header className="w-full max-w-3xl border-b border-border pb-6">
        <p className="font-mono text-xs tracking-widest text-gold uppercase mb-1">
          Public profile · Base Sepolia
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </h1>
      </header>

      <section className="w-full max-w-3xl">
        <TradeTable address={address as `0x${string}`} />
      </section>

      <footer className="w-full max-w-3xl text-center">
        <a href="/" className="font-mono text-xs text-muted hover:text-gold transition-colors">
          ← Start your own onchain journal
        </a>
      </footer>
    </main>
  )
}