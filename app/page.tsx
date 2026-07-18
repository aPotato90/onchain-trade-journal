import { ConnectWallet } from './components/ConnectWallet'
import { TradeForm } from './components/TradeForm'
import { JournalView } from './components/JournalView'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">Onchain Trade Journal</h1>
      <ConnectWallet />
      <TradeForm />
      <JournalView />
    </main>
  )
}