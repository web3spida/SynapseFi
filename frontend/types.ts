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

export interface RWAAsset {
  id: string;
  name: string;
  type: 'Real Estate' | 'Bond' | 'Private Credit' | 'Equity';
  apy: number;
  tvl: number;
  minInvestment: number;
  risk: 'Low' | 'Medium' | 'High';
  maturity: string;
  status: 'Active' | 'Sold Out' | 'Coming Soon' | 'Draft' | 'Pending Approval' | 'Rejected';
  proposer?: string; // Address of the user who proposed it
  documents?: string[]; // List of document names
  description?: string;
}

export type UserRole = 'Admin' | 'User';