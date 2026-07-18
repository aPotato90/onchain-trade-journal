export const TRADE_JOURNAL_ADDRESS = '0xbF2dCB55Fe056bae99541F28ba1587f61D85a3F0' as const

export const tradeJournalAbi = [
  {
    type: 'function',
    name: 'logTrade',
    inputs: [
      { name: 'instrument', type: 'string' },
      { name: 'setupTag', type: 'string' },
      { name: 'entryPrice', type: 'uint256' },
      { name: 'exitPrice', type: 'uint256' },
      { name: 'isLong', type: 'bool' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getTrades',
    inputs: [{ name: 'trader', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'instrument', type: 'string' },
          { name: 'setupTag', type: 'string' },
          { name: 'entryPrice', type: 'uint256' },
          { name: 'exitPrice', type: 'uint256' },
          { name: 'isLong', type: 'bool' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const