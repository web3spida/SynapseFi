import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets';

export const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
  connectors: connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [injectedWallet],
    },
  ]),
});

