export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { name: 'Portfolio', path: '/portfolio', icon: 'Briefcase' },
  { name: 'Marketplace', path: '/marketplace', icon: 'Building2' },
  { name: 'Staking', path: '/staking', icon: 'Coins' },
  { name: 'Governance', path: '/governance', icon: 'Vote' },
  { name: 'Admin', path: '/admin', icon: 'Shield' },
  { name: 'Docs', path: '/docs', icon: 'BookOpen' },
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
