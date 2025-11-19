export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const isHexAddress = (value: string): boolean => {
  return !!value && /^0x[a-fA-F0-9]{40}$/.test(value)
}

export const isZeroAddress = (address: string): boolean => {
  return isHexAddress(address) && address.toLowerCase() === ZERO_ADDRESS.toLowerCase()
}

export const addressEquals = (a?: string, b?: string): boolean => {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase()
}

const envAddress = (
  key: 'VITE_SYNAPSE_TOKEN_ADDRESS'
): string => {
  const value = import.meta.env[key] as string | undefined
  return value && isHexAddress(value) ? value : ZERO_ADDRESS
}

export const CONTRACT_ADDRESSES = {
  SYNAPSE_TOKEN: envAddress('VITE_SYNAPSE_TOKEN_ADDRESS'),
} as const

// Polygon mainnet chain id
export const POLYGON_CHAIN_ID = 137
export const isPolygonMainnet = (chainId?: number) => chainId === POLYGON_CHAIN_ID

// Polymarket core contracts on Polygon mainnet
export const POLYMARKET_ADDRESSES = {
  // USDC.e on Polygon (Polymarket settlement token)
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  // Polymarket CTF Exchange (spender/operator)
  EXCHANGE: '0x4bfb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E',
  // Gnosis Conditional Tokens (ERC1155) on Polygon
  CONDITIONAL_TOKENS: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
} as const


export const formatAddress = (address: string, leading = 6, trailing = 4): string => {
  if (!isHexAddress(address)) return ''
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`
}

export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  const n = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options,
  }).format(n)
}

export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string => {
  const n = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    ...options,
  }).format(n)
}

export const toPercent = (ratio: number, fractionDigits = 0): string => {
  const r = Number.isFinite(ratio) ? ratio : 0
  const clamped = Math.max(0, Math.min(1, r))
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
  }).format(clamped)
}

export const formatTimestamp = (timestamp: number): string => {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return ''
  const date = new Date(timestamp * 1000)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export const relativeTimeFromSeconds = (timestamp: number): string => {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return ''
  const ms = timestamp * 1000
  const diff = Date.now() - ms
  const ahead = diff < 0
  const abs = Math.abs(diff)
  const minutes = Math.floor(abs / 60000)
  const hours = Math.floor(abs / 3600000)
  const days = Math.floor(abs / 86400000)
  const suffix = ahead ? '' : ' ago'
  if (days) return `${ahead ? 'in ' : ''}${days} day${days > 1 ? 's' : ''}${suffix}`
  if (hours) return `${ahead ? 'in ' : ''}${hours} hour${hours > 1 ? 's' : ''}${suffix}`
  return `${ahead ? 'in ' : ''}${minutes} min${minutes > 1 ? 's' : ''}${suffix}`
}

export const ensureDefined = <T>(value: T | undefined | null, fallback: T): T => {
  return value ?? fallback
}