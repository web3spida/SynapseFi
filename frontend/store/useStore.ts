import { create } from 'zustand';
import { RWAAsset, UserRole, PortfolioItem } from '../types';
import { MOCK_RWA_ASSETS } from '../constants';
import { getContract } from '../lib/ethers';
import RWARegistryAbi from '../contracts/abis/RWARegistry.json';
import RWAOracleAbi from '../contracts/abis/RWAOracle.json';
import { RWA_REGISTRY_ADDRESS, RWA_ORACLE_ADDRESS } from '../constants/contracts';

interface AppState {
  isConnected: boolean;
  isConnecting: boolean;
  disconnectWallet: () => void;
  connectedAddress?: string;
  
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  rwaAssets: RWAAsset[];
  portfolio: PortfolioItem[];
  
  rwaOnchainPrices: Record<string, number>;
  loadOnchainRwaPrices: () => Promise<void>;
  submitAssetProposal: (asset: Omit<RWAAsset, 'id' | 'status' | 'tvl'>) => void;
  approveAsset: (id: string) => void;
  rejectAsset: (id: string) => void;
  updateAssetPrice: (id: string, newApy: number) => void;
  investInAsset: (assetId: string, amount: number) => void;
  setWalletStatus: (isConnected: boolean, address?: string) => void;
}

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readRwaAssets = (): RWAAsset[] => {
  try {
    if (!canUseStorage()) return MOCK_RWA_ASSETS as RWAAsset[];
    const raw = localStorage.getItem('synapsefi_rwa_assets');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((asset) => {
          const docs = asset?.documents;
          if (Array.isArray(docs) && docs.length > 0 && typeof docs[0] === 'string') {
            return {
              ...asset,
              documents: docs.map((name: string) => ({
                name,
                url: '',
                mime: '',
                size: 0
              }))
            };
          }
          return asset;
        });
      }
    }
  } catch {}
  return MOCK_RWA_ASSETS as RWAAsset[];
};

const persistRwaAssets = (assets: RWAAsset[]) => {
  try {
    if (!canUseStorage()) return;
    localStorage.setItem('synapsefi_rwa_assets', JSON.stringify(assets));
  } catch {}
};

const readPortfolio = (): PortfolioItem[] => {
  try {
    if (!canUseStorage()) return [];
    const raw = localStorage.getItem('synapsefi_portfolio');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistPortfolio = (items: PortfolioItem[]) => {
  try {
    if (!canUseStorage()) return;
    localStorage.setItem('synapsefi_portfolio', JSON.stringify(items));
  } catch {}
};

export const useStore = create<AppState>((set, get) => ({
  isConnected: false,
  isConnecting: false,
  disconnectWallet: () => set({ isConnected: false, connectedAddress: undefined }),
  setWalletStatus: (isConnected, address) => set({ isConnected, connectedAddress: address }),

  userRole: 'User',
  setUserRole: (role) => set({ userRole: role }),
  rwaAssets: readRwaAssets(),
  portfolio: readPortfolio(),
  rwaOnchainPrices: {},
  loadOnchainRwaPrices: async () => {
    try {
      if (!RWA_ORACLE_ADDRESS) return;
      const state = get();
      const ids = state.rwaAssets
        .map((a) => a.id)
        .filter((id) => Number.isFinite(Number(id)));
      if (!ids.length) return;
      const contract = await getContract(RWA_ORACLE_ADDRESS, RWAOracleAbi);
      const updates: Record<string, number> = {};
      for (const id of ids) {
        try {
          const raw = await contract.getPrice(Number(id));
          const num = Number(raw);
          if (Number.isFinite(num) && num > 0) {
            updates[id] = num / 100;
          }
        } catch {}
      }
      if (Object.keys(updates).length) {
        set((state) => ({
          rwaOnchainPrices: { ...state.rwaOnchainPrices, ...updates }
        }));
      }
    } catch {}
  },
  submitAssetProposal: (asset) => set((state) => {
    const next: RWAAsset[] = [
      ...state.rwaAssets,
      {
        ...asset,
        id: Math.random().toString(36).substr(2, 9),
        status: 'Pending Approval',
        tvl: 0,
        proposer: state.connectedAddress || '0xUser',
      }
    ];
    persistRwaAssets(next);
    return { rwaAssets: next };
  }),
  approveAsset: (id) => {
    const admin = get().connectedAddress || '0xAdmin';
    const timestamp = new Date().toISOString();
    set((state) => {
      const next: RWAAsset[] = state.rwaAssets.map((a) => {
        if (a.id !== id) return a;
        const auditEntry: NonNullable<RWAAsset['auditTrail']>[number] = {
          action: 'Approved',
          admin,
          timestamp
        };
        const auditTrail = [...(a.auditTrail || []), auditEntry];
        return { ...a, status: 'Active', auditTrail };
      });
      persistRwaAssets(next);
      return { rwaAssets: next };
    });
    (async () => {
      try {
        if (!RWA_REGISTRY_ADDRESS) return;
        const numericId = Number(id);
        if (!Number.isFinite(numericId)) return;
        const contract = await getContract(RWA_REGISTRY_ADDRESS, RWARegistryAbi);
        const tx = await contract.approveAsset(numericId);
        await tx.wait();
      } catch {}
    })();
  },
  rejectAsset: (id) => {
    const admin = get().connectedAddress || '0xAdmin';
    const timestamp = new Date().toISOString();
    set((state) => {
      const next: RWAAsset[] = state.rwaAssets.map((a) => {
        if (a.id !== id) return a;
        const auditEntry: NonNullable<RWAAsset['auditTrail']>[number] = {
          action: 'Rejected',
          admin,
          timestamp
        };
        const auditTrail = [...(a.auditTrail || []), auditEntry];
        return { ...a, status: 'Rejected', auditTrail };
      });
      persistRwaAssets(next);
      return { rwaAssets: next };
    });
  },
  updateAssetPrice: (id, newApy) => {
    set((state) => {
      const next = state.rwaAssets.map(a => a.id === id ? { ...a, apy: newApy } : a);
      persistRwaAssets(next);
      return { rwaAssets: next };
    });
    (async () => {
      try {
        if (!RWA_ORACLE_ADDRESS) return;
        const numericId = Number(id);
        if (!Number.isFinite(numericId)) return;
        const contract = await getContract(RWA_ORACLE_ADDRESS, RWAOracleAbi);
        const scaled = Math.round(newApy * 100);
        const tx = await contract.setPrice(numericId, scaled);
        await tx.wait();
      } catch {}
    })();
  },
  investInAsset: (assetId, amount) => {
    set((state) => {
      const newItem: PortfolioItem = {
        assetId,
        amount,
        date: new Date().toISOString()
      };
      const next = [...state.portfolio, newItem];
      persistPortfolio(next);
      
      // Update asset TVL
      const updatedAssets = state.rwaAssets.map(a => 
        a.id === assetId ? { ...a, tvl: a.tvl + amount } : a
      );
      persistRwaAssets(updatedAssets);
      
      return { portfolio: next, rwaAssets: updatedAssets };
    });
  }
}));
