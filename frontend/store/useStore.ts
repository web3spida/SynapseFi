import { create } from 'zustand';
import { CreditScoreData, UserWallet, Transaction } from '../types';
import { MOCK_SCORE_DATA, MOCK_WALLETS, MOCK_TRANSACTIONS } from '../constants';

interface AppState {
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
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
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isConnected: true, isConnecting: false });
  },
  disconnectWallet: () => set({ isConnected: false }),

  creditScore: MOCK_SCORE_DATA,
  wallets: MOCK_WALLETS,
  transactions: MOCK_TRANSACTIONS,
  balances: {
    'USDC': '1420.50',
    'MATIC': '542.10',
    'WETH': '0.45',
  },

  hasPassport: false,
  isMinting: false,
  mintPassport: async () => {
    set({ isMinting: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    set({ hasPassport: true, isMinting: false });
  },
  updatePassportMetadata: async () => {
    // Simulate metadata refresh from chain
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },

  bridgeLoading: false,
  executeBridge: async (amount, token) => {
    set({ bridgeLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    // Update transactions
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Bridge',
      amount,
      token,
      from: 'Polygon PoS',
      to: 'zkEVM',
      status: 'Success',
      timestamp: new Date().toLocaleString(),
      hash: '0x' + Math.random().toString(16).substr(2, 40),
    };

    // Update balance
    const currentBalance = parseFloat(get().balances[token] || '0');
    const bridgeAmount = parseFloat(amount);
    const newBalance = Math.max(0, currentBalance - bridgeAmount).toFixed(2);
    
    set((state) => ({
      bridgeLoading: false,
      transactions: [newTx, ...state.transactions],
      balances: {
        ...state.balances,
        [token]: newBalance
      }
    }));
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

      return {
        wallets: updatedWallets,
        creditScore: { ...state.creditScore, current: avgScore }
      };
    });
  },
}));