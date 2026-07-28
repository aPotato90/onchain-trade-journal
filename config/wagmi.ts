import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { baseAccount, injected } from 'wagmi/connectors'
import { Attribution } from "ox/erc8021";

// Get your Builder Code from base.dev > Settings > Builder Codes
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_fiqn9fnf"],
});

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    baseAccount({
      appName: 'Onchain Trade Journal',
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  dataSuffix: DATA_SUFFIX,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}