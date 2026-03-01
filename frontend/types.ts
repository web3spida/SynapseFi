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
  documents?: { name: string; url: string; mime: string; size: number }[];
  description?: string;
  auditTrail?: { action: 'Approved' | 'Rejected'; admin: string; timestamp: string }[];
}

export interface PortfolioItem {
  assetId: string;
  amount: number;
  date: string;
}

export type UserRole = 'Admin' | 'User';
