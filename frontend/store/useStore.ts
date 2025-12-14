import { create } from 'zustand';
import { CreditScoreData, UserWallet, Transaction, RWAAsset, UserRole } from '../types';
import { MOCK_SCORE_DATA, MOCK_WALLETS, MOCK_TRANSACTIONS, MOCK_RWA_ASSETS, CHAIN_IDS, TOKEN_ADDRESSES, NATIVE_TOKEN_ADDRESS, TOKEN_DECIMALS } from '../constants';
import { getContract, getSigner } from '../lib/ethers';
import { ethers } from 'ethers';
import CreditPassportAbi from '../contracts/abis/CreditPassport.json';
import { CREDIT_PASSPORT_ADDRESS } from '../constants/contracts';

interface AppState {
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  connectedAddress?: string;
  
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  rwaAssets: RWAAsset[];
  submitAssetProposal: (asset: Omit<RWAAsset, 'id' | 'status' | 'tvl'>) => void;
  approveAsset: (id: string) => void;
  rejectAsset: (id: string) => void;
  updateAssetPrice: (id: string, newApy: number) => void;

  creditScore: CreditScoreData;
  wallets: UserWallet[];
  transactions: Transaction[];
  balances: Record<string, string>;
  
  hasPassport: boolean;
  isMinting: boolean;
  mintPassport: () => Promise<void>;
  updatePassportMetadata: () => Promise<void>;
  
  bridgeLoading: boolean;
  executeBridge: (amount: string, token: string) => Promise<void>;

  linkWallet: (address: string) => Promise<void>;
  unlinkWallet: (address: string) => void;
  refreshWalletScore: (address: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {
    set({ isConnecting: true });
    try {
      if (!('ethereum' in window)) throw new Error('No wallet found');
      const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts?.[0];
      set({ isConnected: true, isConnecting: false, connectedAddress: address });
      try {
        if (CREDIT_PASSPORT_ADDRESS) {
          const contract = await getContract(CREDIT_PASSPORT_ADDRESS, CreditPassportAbi);
          const has = await contract.hasPassport(address);
          set({ hasPassport: Boolean(has) });
        }
      } catch {}
    } finally {
      set({ isConnecting: false });
    }
  },
  disconnectWallet: () => set({ isConnected: false }),

  userRole: 'User',
  setUserRole: (role) => set({ userRole: role }),
  rwaAssets: MOCK_RWA_ASSETS as RWAAsset[], // Cast to RWAAsset[] to match type
  submitAssetProposal: (asset) => set((state) => ({
    rwaAssets: [
      ...state.rwaAssets,
      {
        ...asset,
        id: Math.random().toString(36).substr(2, 9),
        status: 'Pending Approval',
        tvl: 0,
        proposer: state.connectedAddress || '0xUser',
      }
    ]
  })),
  approveAsset: (id) => set((state) => ({
    rwaAssets: state.rwaAssets.map(a => a.id === id ? { ...a, status: 'Active' } : a)
  })),
  rejectAsset: (id) => set((state) => ({
    rwaAssets: state.rwaAssets.map(a => a.id === id ? { ...a, status: 'Rejected' } : a)
  })),
  updateAssetPrice: (id, newApy) => set((state) => ({
    rwaAssets: state.rwaAssets.map(a => a.id === id ? { ...a, apy: newApy } : a)
  })),

  creditScore: MOCK_SCORE_DATA,
  wallets: (() => {
    try { return JSON.parse(localStorage.getItem('synapsefi_wallets') || '[]'); } catch { return MOCK_WALLETS; }
  })(),
  transactions: (() => {
    try { return JSON.parse(localStorage.getItem('synapsefi_transactions') || '[]'); } catch { return MOCK_TRANSACTIONS; }
  })(),
  balances: (() => {
    try { return JSON.parse(localStorage.getItem('synapsefi_balances') || '{}'); } catch { return { USDC: '0.00', MATIC: '0.00', WETH: '0.00' }; }
  })(),

  hasPassport: false,
  isMinting: false,
  mintPassport: async () => {
    set({ isMinting: true });
    try {
      if (!CREDIT_PASSPORT_ADDRESS) throw new Error('Passport contract address not configured');
      const contract = await getContract(CREDIT_PASSPORT_ADDRESS, CreditPassportAbi);
      const addr = get().connectedAddress;
      if (!addr) throw new Error('Wallet not connected');

      const defaultUri = `https://synapsefi.app/passport/${addr}`;
      const tx = await contract.mintPassport(defaultUri);
      await tx.wait();
      set({ hasPassport: true });
    } finally {
      set({ isMinting: false });
    }
  },
  updatePassportMetadata: async () => {
    try {
      if (!CREDIT_PASSPORT_ADDRESS) return;
      const contract = await getContract(CREDIT_PASSPORT_ADDRESS, CreditPassportAbi);
      const addr = get().connectedAddress;
      if (!addr) return;
      const tokenId = await contract.passportOf(addr);
      if (Number(tokenId) > 0) {
        await contract.tokenURI(tokenId);
        const [score] = await contract.getScore(addr);
        set((state) => ({
          creditScore: { ...state.creditScore, current: Number(score) || state.creditScore.current }
        }));
      }
    } catch {}
  },

  bridgeLoading: false,
  executeBridge: async (amount, token) => {
    set({ bridgeLoading: true });
    try {
      const addr = get().connectedAddress;
      if (!addr) throw new Error('Wallet not connected');

      const fromChainId = CHAIN_IDS['Polygon PoS'];
      const toChainId = CHAIN_IDS['Polygon zkEVM'];

      const fromTokenAddress = TOKEN_ADDRESSES['Polygon PoS'][token];
      const toTokenAddress = TOKEN_ADDRESSES['Polygon zkEVM'][token];

      if (!fromTokenAddress || !toTokenAddress) {
        throw new Error('Selected token not supported for bridging');
      }

      const isNative = fromTokenAddress === NATIVE_TOKEN_ADDRESS;
      const decimals = TOKEN_DECIMALS['Polygon PoS'][token] ?? 18;
      const fromAmountWei = ethers.parseUnits(amount, decimals).toString();

      const currentChainHex = await (window as any).ethereum.request({ method: 'eth_chainId' });
      const targetChainHex = '0x' + fromChainId.toString(16);
      if (currentChainHex !== targetChainHex) {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainHex }],
        });
      }

      const routesRes = await fetch('https://li.quest/v1/advanced/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromChainId,
          toChainId,
          fromTokenAddress,
          toTokenAddress,
          fromAmount: fromAmountWei,
          fromAddress: addr,
          toAddress: addr,
          options: { allowSwitchChain: true, order: 'FASTEST' }
        })
      });
      const routes = await routesRes.json();
      const route = routes?.routes?.[0];
      if (!route || !route.steps?.length) throw new Error('No route available');

      const step = route.steps[0];
      const approvalAddress = step?.estimate?.approvalAddress as string | undefined;
      if (!isNative && approvalAddress) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const erc20Abi = [
          'function allowance(address owner, address spender) view returns (uint256)',
          'function approve(address spender, uint256 amount) returns (bool)'
        ];
        const tokenContract = new ethers.Contract(fromTokenAddress, erc20Abi, signer);
        const allowance: bigint = await tokenContract.allowance(addr, approvalAddress);
        if (allowance < BigInt(fromAmountWei)) {
          const approveTx = await tokenContract.approve(approvalAddress, fromAmountWei);
          await approveTx.wait();
        }
      }
      const stepRes = await fetch('https://li.quest/v1/advanced/stepTransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(step)
      });
      const populatedStep = await stepRes.json();
      const txReq = populatedStep?.transactionRequest;
      if (!txReq?.to || !txReq?.data) throw new Error('Failed to populate transaction');

      const signer = await getSigner();
      const tx = await signer.sendTransaction({
        to: txReq.to,
        data: txReq.data,
        value: txReq.value ? BigInt(txReq.value) : undefined
      });

      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Bridge',
        amount,
        token,
        from: 'Polygon PoS',
        to: 'Polygon zkEVM',
        status: 'Pending',
        timestamp: new Date().toLocaleString(),
        hash: tx.hash,
      };

      set((state) => {
        const updated = [newTx, ...state.transactions];
        try { localStorage.setItem('synapsefi_transactions', JSON.stringify(updated)); } catch {}
        return { transactions: updated };
      });

      let done = false;
      for (let i = 0; i < 60 && !done; i++) {
        await new Promise((r) => setTimeout(r, 15000));
        try {
          const statusRes = await fetch(
            `https://li.quest/v1/status?transactionHash=${tx.hash}&fromChain=${fromChainId}&toChain=${toChainId}`
          );
          const statusJson = await statusRes.json();
          const status = statusJson?.status;
          if (status === 'DONE' || status === 'PARTIAL') {
            done = true;
            set((state) => ({
              transactions: state.transactions.map((t) => (t.hash === tx.hash ? { ...t, status: 'Success' } : t))
            }));
          }
        } catch {}
      }
      if (!done) {
        set((state) => ({
          transactions: state.transactions.map((t) => (t.hash === tx.hash ? { ...t, status: 'Failed' } : t))
        }));
      }

      if (done && route.steps?.length > 1) {
        const nextStep = route.steps[1];
        const destChainHex = '0x' + toChainId.toString(16);
        const curr = await (window as any).ethereum.request({ method: 'eth_chainId' });
        if (curr !== destChainHex) {
          await (window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: destChainHex }] });
        }
        const nextRes = await fetch('https://li.quest/v1/advanced/stepTransaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextStep)
        });
        const nextPopulated = await nextRes.json();
        const nextTxReq = nextPopulated?.transactionRequest;
        if (nextTxReq?.to && nextTxReq?.data) {
          const nextTx = await signer.sendTransaction({
            to: nextTxReq.to,
            data: nextTxReq.data,
            value: nextTxReq.value ? BigInt(nextTxReq.value) : undefined
          });
          await nextTx.wait();
        }
      }

      const currentBalance = parseFloat(get().balances[token] || '0');
      const bridgeAmount = parseFloat(amount);
      const newBalance = Math.max(0, currentBalance - bridgeAmount).toFixed(2);
      set((state) => {
        const updated = { ...state.balances, [token]: newBalance };
        try { localStorage.setItem('synapsefi_balances', JSON.stringify(updated)); } catch {}
        return { balances: updated };
      });
    } finally {
      set({ bridgeLoading: false });
    }
  },

  linkWallet: async (address: string) => {
    // Simulate linking process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newWallet: UserWallet = {
      address,
      score: Math.floor(Math.random() * (780 - 580) + 580), // Random score
      linkedDate: new Date().toLocaleDateString(),
      isPrimary: false
    };

    set((state) => {
      const updatedWallets = [...state.wallets, newWallet];
      // Recalculate global score (Simple Average for demo)
      const totalScore = updatedWallets.reduce((acc, w) => acc + w.score, 0);
      const avgScore = Math.round(totalScore / updatedWallets.length);

      try { localStorage.setItem('synapsefi_wallets', JSON.stringify(updatedWallets)); } catch {}
      return {
        wallets: updatedWallets,
        creditScore: { ...state.creditScore, current: avgScore }
      };
    });
  },

  unlinkWallet: (address: string) => {
    set((state) => {
      const updatedWallets = state.wallets.filter(w => w.address !== address);
      const totalScore = updatedWallets.reduce((acc, w) => acc + w.score, 0);
      const avgScore = updatedWallets.length > 0 ? Math.round(totalScore / updatedWallets.length) : 0;

      try { localStorage.setItem('synapsefi_wallets', JSON.stringify(updatedWallets)); } catch {}
      return {
        wallets: updatedWallets,
        creditScore: { ...state.creditScore, current: avgScore }
      };
    });
  },

  refreshWalletScore: async (address: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    set((state) => {
      const updatedWallets = state.wallets.map(w => {
        if (w.address === address) {
          // Simulate slight score change
          const change = Math.floor(Math.random() * 10) - 5;
          return { ...w, score: Math.min(850, Math.max(300, w.score + change)) };
        }
        return w;
      });

      const totalScore = updatedWallets.reduce((acc, w) => acc + w.score, 0);
      const avgScore = Math.round(totalScore / updatedWallets.length);

      try { localStorage.setItem('synapsefi_wallets', JSON.stringify(updatedWallets)); } catch {}
      return {
        wallets: updatedWallets,
        creditScore: { ...state.creditScore, current: avgScore }
      };
    });
  },
}));
