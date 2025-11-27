import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useStore } from '../../store/useStore';
import { ethers } from 'ethers';

const erc20Abi = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

export const WalletSync: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connectedAddress } = useStore();
  const setState = useStore.setState;

  useEffect(() => {
    async function sync() {
      if (!isConnected || !address) return;

      setState({ isConnected: true, connectedAddress: address });

      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const maticWei = await provider.getBalance(address);
        const matic = ethers.formatEther(maticWei);

        setState((state) => ({
          wallets: [{ address, score: state.creditScore.current, linkedDate: new Date().toLocaleDateString(), isPrimary: true }],
          balances: { ...state.balances, MATIC: Number(matic).toFixed(4) },
          transactions: []
        }));
      } catch {}
    }

    sync();
  }, [isConnected, address, connectedAddress]);

  return null;
};

