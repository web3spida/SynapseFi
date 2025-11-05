/* Lightweight client for Polymarket public APIs (Gamma + Data API)
 * Sources:
 * - Gamma Markets API: https://gamma-api.polymarket.com (market discovery)
 * - Data API: https://data-api.polymarket.com (simple trades endpoint)
 * - CLOB API: https://clob.polymarket.com (not used for write ops here)
 */

export const POLYMARKET_ENDPOINTS = {
  GAMMA: (import.meta.env.VITE_POLYMARKET_GAMMA_API as string) || 'https://gamma-api.polymarket.com',
  DATA: (import.meta.env.VITE_POLYMARKET_DATA_API as string) || 'https://data-api.polymarket.com',
  CLOB: (import.meta.env.VITE_POLYMARKET_CLOB_API as string) || 'https://clob.polymarket.com',
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

async function apiGet<T>(base: string, path: string, params?: Record<string, any>, signal?: AbortSignal): Promise<T> {
  const url = new URL(path, base)
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

export const fetchMarkets = (params?: { tag_id?: string | number; closed?: boolean; limit?: number; offset?: number; slug?: string }) => {
  if (params?.slug) {
    return apiGet<PMMarket[]>(POLYMARKET_ENDPOINTS.GAMMA, '/markets', { slug: params.slug })
  }
  return apiGet<PMMarket[]>(POLYMARKET_ENDPOINTS.GAMMA, '/markets', {
    closed: params?.closed ?? false,
    limit: params?.limit ?? 25,
    offset: params?.offset ?? 0,
    tag_id: params?.tag_id,
  })
}

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