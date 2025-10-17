import type { Chain } from 'viem'

export const polygonZkEvmCardona: Chain = {
  id: 2442,
  name: 'Polygon zkEVM Cardona Testnet',
  network: 'polygon-zkevm-cardona',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.cardona.zkevm-rpc.com'] },
    public: { http: ['https://rpc.cardona.zkevm-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://cardona-zkevm.polygonscan.com' },
  },
  testnet: true,
}