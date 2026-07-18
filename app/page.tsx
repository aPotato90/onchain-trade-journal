import { ConnectWallet } from './components/ConnectWallet'
import { TradeForm } from './components/TradeForm'
import { JournalView } from './components/JournalView'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 gap-10">
      <header className="w-full max-w-3xl flex items-center justify-between border-b border-border pb-6">
        <div>
          <p className="font-mono text-xs tracking-widest text-gold uppercase mb-1">
            Onchain · Base Sepolia
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
            Trade Journal
          </h1>
        </div>
        <ConnectWallet />
      </header>

      <section className="w-full max-w-3xl">
        <TradeForm />
      </section>

      <section className="w-full max-w-3xl">
        <JournalView />
      </section>
    </main>
  )
}