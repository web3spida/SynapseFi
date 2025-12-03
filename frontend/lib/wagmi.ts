import { createConfig, http } from 'wagmi';
import { polygon, polygonAmoy, polygonZkEvm } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined;

const connectors = [
  injected(),
  ...(projectId ? [walletConnect({ projectId })] : []),
  coinbaseWallet({ appName: 'SynapseFi' }),
];

export const wagmiConfig = createConfig({
  chains: [polygon, polygonZkEvm, polygonAmoy],
  transports: {
    [polygon.id]: http(),
    [polygonZkEvm.id]: http(),
    [polygonAmoy.id]: http(),
  },
  connectors,
});
