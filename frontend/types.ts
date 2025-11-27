export interface UserWallet {
  address: string;
  score: number;
  linkedDate: string;
  isPrimary: boolean;
}

export interface Transaction {
  id: string;
  type: 'Bridge' | 'Mint' | 'Link' | 'Update';
  amount?: string;
  token?: string;
  from?: string;
  to?: string;
  status: 'Success' | 'Pending' | 'Failed';
  timestamp: string;
  hash: string;
}

export interface CreditScoreData {
  current: number;
  max: number;
  trend: { date: string; score: number }[];
  factors: {
    paymentHistory: string;
    creditAge: string;
    liquidationRisk: string;
    utilization: string;
  };
}

export interface BridgeState {
  fromChain: 'Polygon PoS';
  toChain: 'Polygon zkEVM';
  token: 'USDC' | 'MATIC' | 'DAI';
  amount: string;
}

export interface PassportData {
  id: string;
  mintedDate: string;
  owner: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  perks: string[];
}