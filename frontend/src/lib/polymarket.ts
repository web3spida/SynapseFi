/* Lightweight client for Polymarket public APIs (Gamma + Data API)
 * Sources:
 * - Gamma Markets API: https://gamma-api.polymarket.com (market discovery)
 * - Data API: https://data-api.polymarket.com (simple trades endpoint)
 * - CLOB API: https://clob.polymarket.com (order params + book)
 */

export const POLYMARKET_ENDPOINTS = {
  // Prefer same-origin proxy paths by default; fall back to absolute if env provides one
  GAMMA: (import.meta.env.VITE_POLYMARKET_GAMMA_API as string) || '/api/gamma',
  DATA: (import.meta.env.VITE_POLYMARKET_DATA_API as string) || '/api/data',
  CLOB: (import.meta.env.VITE_POLYMARKET_CLOB_API as string) || '/api/clob',
} as const

export type PMMarket = {
  id: string
  question?: string
  slug?: string
  category?: string
  endDate?: string
  image?: string
  outcomes?: Array<{ id?: string; name?: string; price?: number; tokenId?: string }>
  enableOrderBook?: boolean
}

export type PMEvent = {
  id: string
  title?: string
  slug?: string
  markets?: PMMarket[]
}

export type PMTrade = {
  id?: string
  market?: string
  token_id?: string
  price?: number
  size?: number
  side?: 'buy' | 'sell'
  match_time?: string
}

// Gamma get-markets parameters (aligned with public docs)
export type GetMarketsParams = {
  search?: string
  tag_id?: string | number
  event_id?: string | number
  closed?: boolean
  archived?: boolean
  limit?: number
  offset?: number
  slug?: string
  order?: 'liquidity' | 'volume' | 'end_date' | 'created' | 'updated'
  ascending?: boolean
}

function resolveBase(base: string) {
  try {
    // If base is absolute (http/https), this will succeed
    // eslint-disable-next-line no-new
    new URL(base)
    // Ensure trailing slash so relative paths append correctly
    return base.endsWith('/') ? base : `${base}/`
  } catch {
    // Treat as relative to current origin
    const abs = new URL(base, window.location.origin).toString()
    return abs.endsWith('/') ? abs : `${abs}/`
  }
}

async function apiGet<T>(base: string, path: string, params?: Record<string, any>, signal?: AbortSignal): Promise<T> {
  const pathNormalized = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(pathNormalized, resolveBase(base))
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    })
  }
  const res = await fetch(url.toString(), { signal })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Polymarket API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// Gamma: Efficient market discovery via events
export const fetchEvents = (params?: { closed?: boolean; limit?: number; offset?: number }) => {
  return apiGet<PMEvent[]>(POLYMARKET_ENDPOINTS.GAMMA, '/events', {
    order: 'id',
    ascending: false,
    closed: params?.closed ?? false,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
  })
}

// New: fully-typed helper aligned to Gamma docs
export const getMarkets = (params?: GetMarketsParams) => {
  const p: Record<string, any> = {
    closed: params?.closed ?? false,
    archived: params?.archived ?? false,
    limit: params?.limit ?? 25,
    offset: params?.offset ?? 0,
  }
  if (params?.slug) p.slug = params.slug
  if (params?.tag_id !== undefined) p.tag_id = params.tag_id
  if (params?.event_id !== undefined) p.event_id = params.event_id
  if (params?.order) p.order = params.order
  if (params?.ascending !== undefined) p.ascending = params.ascending
  if (params?.search) p.search = params.search
  return apiGet<PMMarket[]>(POLYMARKET_ENDPOINTS.GAMMA, '/markets', p)
}

// Backwards-compatible alias used across the app
export const fetchMarkets = (params?: { tag_id?: string | number; closed?: boolean; limit?: number; offset?: number; slug?: string }) => {
  return getMarkets({
    tag_id: params?.tag_id,
    closed: params?.closed,
    limit: params?.limit,
    offset: params?.offset,
    slug: params?.slug,
  })
}

// Single market lookups
export const getMarketById = (id: string) => apiGet<PMMarket[]>(POLYMARKET_ENDPOINTS.GAMMA, '/markets', { id })
export const getMarketBySlug = (slug: string) => apiGet<PMMarket[]>(POLYMARKET_ENDPOINTS.GAMMA, '/markets', { slug })

export const fetchTags = () => apiGet<{ id: number; name: string }[]>(POLYMARKET_ENDPOINTS.GAMMA, '/tags')
export const fetchSports = () => apiGet<any>(POLYMARKET_ENDPOINTS.GAMMA, '/sports')

// Data-API: simple trades endpoint that doesn’t require L2 headers (read-only)
export const fetchTrades = (params?: { market?: string; token_id?: string; limit?: number; offset?: number }) => {
  return apiGet<PMTrade[]>(POLYMARKET_ENDPOINTS.DATA, '/trades', {
    market: params?.market,
    token_id: params?.token_id,
    limit: params?.limit ?? 50,
    offset: params?.offset ?? 0,
  })
}

// Convenience wrappers
export const getTradesByMarket = (marketId: string, limit = 50, offset = 0) =>
  fetchTrades({ market: marketId, limit, offset })
export const getTradesByToken = (tokenId: string, limit = 50, offset = 0) =>
  fetchTrades({ token_id: tokenId, limit, offset })

// CLOB helpers: fetch market parameters and order book snapshot
export type PMBookLevel = { price: number; size: number }
export type PMBook = {
  bids: PMBookLevel[]
  asks: PMBookLevel[]
  tick_size: number
  neg_risk: boolean
}

export const fetchClobMarkets = (ids: string[]) => {
  return apiGet<any>(POLYMARKET_ENDPOINTS.CLOB, '/get-markets', { ids: ids.join(',') })
}

export const fetchBook = (token_id: string) => {
  return apiGet<PMBook>(POLYMARKET_ENDPOINTS.CLOB, '/get-book', { token_id })
}

export const polymarketUrlForMarket = (slug?: string, id?: string) => {
  if (slug) return `https://polymarket.com/market/${slug}`
  if (id) return `https://polymarket.com/market/${id}`
  return 'https://polymarket.com/markets'
}