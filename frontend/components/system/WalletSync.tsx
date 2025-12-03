import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useStore } from '../../store/useStore';
import { ethers } from 'ethers';
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from '../../constants';

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

        const erc20Abi = [
          'function balanceOf(address) view returns (uint256)'
        ];
        const usdc = new ethers.Contract(TOKEN_ADDRESSES['Polygon PoS'].USDC, erc20Abi, provider);
        const weth = new ethers.Contract(TOKEN_ADDRESSES['Polygon PoS'].WETH, erc20Abi, provider);
        const [usdcBalRaw, wethBalRaw] = await Promise.all([
          usdc.balanceOf(address),
          weth.balanceOf(address)
        ]);
        const usdcBal = ethers.formatUnits(usdcBalRaw, TOKEN_DECIMALS['Polygon PoS'].USDC);
        const wethBal = ethers.formatUnits(wethBalRaw, TOKEN_DECIMALS['Polygon PoS'].WETH);

        setState((state) => {
          const wallets = [{ address, score: state.creditScore.current, linkedDate: new Date().toLocaleDateString(), isPrimary: true }];
          const balances = { ...state.balances, MATIC: Number(matic).toFixed(4), USDC: Number(usdcBal).toFixed(2), WETH: Number(wethBal).toFixed(4) };
          try {
            localStorage.setItem('synapsefi_wallets', JSON.stringify(wallets));
            localStorage.setItem('synapsefi_balances', JSON.stringify(balances));
          } catch {}
          return {
            wallets,
            balances,
            transactions: []
          };
        });
      } catch {}
    }

    sync();
  }, [isConnected, address, connectedAddress]);

  return null;
};
