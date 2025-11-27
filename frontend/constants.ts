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
  { name: 'Passport', path: '/passport', icon: 'CreditCard' },
];

export const TOKENS = [
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'WETH', name: 'Wrapped Ether' },
];
