import type { Chain } from 'viem'

export const polygonAmoy: Chain = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'Polygon', symbol: 'POL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
    public: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
}

export const polygon: Chain = {
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'] },
    public: { http: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://polygonscan.com' },
  },
  testnet: false,
}