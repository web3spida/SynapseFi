import { CreditScoreData, Transaction, UserWallet } from './types';

export const MOCK_SCORE_DATA: CreditScoreData = {
  current: 752,
  max: 850,
  factors: {
    paymentHistory: 'Excellent',
    creditAge: '2.4 Years',
    liquidationRisk: 'Low',
    utilization: '12%',
  },
  trend: [
    { date: 'Jan 01', score: 700 },
    { date: 'Jan 08', score: 720 },
    { date: 'Jan 15', score: 735 },
    { date: 'Jan 22', score: 742 },
    { date: 'Jan 29', score: 752 },
  ],
};

export const MOCK_WALLETS: UserWallet[] = [
  {
    address: '0x71C...9A23',
    score: 752,
    linkedDate: '2023-11-12',
    isPrimary: true,
  },
  {
    address: '0xB2a...45e1',
    score: 680,
    linkedDate: '2024-01-15',
    isPrimary: false,
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'Bridge',
    amount: '100',
    token: 'USDC',
    from: 'Polygon PoS',
    to: 'zkEVM',
    status: 'Success',
    timestamp: '2024-01-20 14:30',
    hash: '0xabc...123',
  },
  {
    id: 'tx-2',
    type: 'Link',
    status: 'Success',
    timestamp: '2024-01-15 09:15',
    hash: '0xdef...456',
  },
];

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { name: 'Wallets', path: '/wallets', icon: 'Wallet' },
  { name: 'Bridge', path: '/bridge', icon: 'ArrowLeftRight' },
  { name: 'Marketplace', path: '/marketplace', icon: 'Building2' },
  { name: 'Admin', path: '/admin', icon: 'Shield' },
  { name: 'Passport', path: '/passport', icon: 'CreditCard' },
];

export const MOCK_RWA_ASSETS = [
  {
    id: '1',
    name: 'US Treasury Bill Token',
    type: 'Bond',
    apy: 5.2,
    tvl: 15000000,
    minInvestment: 100,
    risk: 'Low',
    maturity: '3 Months',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Manhattan Commercial Real Estate',
    type: 'Real Estate',
    apy: 8.5,
    tvl: 4500000,
    minInvestment: 5000,
    risk: 'Medium',
    maturity: '5 Years',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Tech Growth Private Credit',
    type: 'Private Credit',
    apy: 12.4,
    tvl: 2100000,
    minInvestment: 1000,
    risk: 'High',
    maturity: '18 Months',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Green Energy Infrastructure',
    type: 'Equity',
    apy: 9.8,
    tvl: 8500000,
    minInvestment: 500,
    risk: 'Medium',
    maturity: '10 Years',
    status: 'Coming Soon',
  },
];

export const TOKENS = [
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'WETH', name: 'Wrapped Ether' },
];

export const CHAIN_IDS = {
  'Polygon PoS': 137,
  'Polygon zkEVM': 1101,
} as const;

export const NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  'Polygon PoS': {
    MATIC: NATIVE_TOKEN_ADDRESS,
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  'Polygon zkEVM': {
    MATIC: NATIVE_TOKEN_ADDRESS,
    USDC: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
    WETH: '0x4f9A0e7fD2bF6067dB6994cf12e4495DF938e6e9',
  },
};

export const TOKEN_DECIMALS: Record<string, Record<string, number>> = {
  'Polygon PoS': {
    MATIC: 18,
    USDC: 6,
    WETH: 18,
  },
  'Polygon zkEVM': {
    MATIC: 18,
    USDC: 6,
    WETH: 18,
  },
};
