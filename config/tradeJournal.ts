export const TRADE_JOURNAL_ADDRESS = '0x8448Ba05d1a39B9c409A50DC1F9f8961897E6F49' as const

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
    name: 'voidTrade',
    inputs: [{ name: 'index', type: 'uint256' }],
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
          { name: 'voided', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const