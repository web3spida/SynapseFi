import type { Fill, FillSide } from './pnl'
import { POLYMARKET_ENDPOINTS } from './polymarket'
import { getSavedClobCreds } from './clob'

const keyForToken = (address: string, tokenId: string) => `pm:fills:${address}:${tokenId}`

export function getLocalFills(address?: string | null, tokenId?: string | null): Fill[] {
  if (!address || !tokenId) return []
  try {
    const raw = localStorage.getItem(keyForToken(address, tokenId))
    return raw ? (JSON.parse(raw) as Fill[]) : []
  } catch {
    return []
  }
}

export function saveLocalFill(address?: string | null, tokenId?: string | null, fill?: Fill) {
  if (!address || !tokenId || !fill) return
  try {
    const key = keyForToken(address, tokenId)
    const existing = getLocalFills(address, tokenId)
    const next = [...existing, fill]
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // no-op
  }
}

// Attempt to fetch authenticated user fills from the Polymarket CLOB API.
// Falls back to local storage when remote is unavailable.
export async function fetchUserFills(address: string, tokenId?: string): Promise<Fill[]> {
  try {
    const creds = getSavedClobCreds()
    if (!creds?.key || !creds?.passphrase) {
      return getLocalFills(address, tokenId || '')
    }

    const base = POLYMARKET_ENDPOINTS.CLOB
    const tryEndpoints = ['/fills', '/get-fills', '/fills-by-owner']
    const params: Record<string, any> = { owner: address }
    if (tokenId) params.token_id = tokenId

    // Attach common headers used by the CLOB API for authenticated requests
    const headers: Record<string, string> = {
      'X-API-KEY': creds.key,
      'X-API-PASSPHRASE': creds.passphrase,
      'Content-Type': 'application/json',
    }

    for (const path of tryEndpoints) {
      try {
        const url = new URL(path, base)
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
        })
        const res = await fetch(url.toString(), { headers })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const arr: any[] = Array.isArray(data) ? data : (Array.isArray(data?.fills) ? data.fills : [])
        if (!Array.isArray(arr)) continue
        const mapped: Fill[] = arr.map((f: any) => ({
          tokenId: String(f.token_id || tokenId || ''),
          side: (((f.side as string) === 'buy' ? 'buy' : 'sell') as FillSide),
          price: Number(f.price ?? 0),
          size: Number(f.size ?? 0),
          timestamp: typeof f.match_time === 'string' ? Math.floor(new Date(f.match_time).getTime() / 1000) : Number(f.timestamp ?? 0),
        })).filter(x => x.size > 0 && x.price >= 0)
        if (mapped.length > 0) return mapped
      } catch (e) {
        // Try the next endpoint on any failure
        continue
      }
    }

    // Remote fetch failed or returned empty; fallback to local cache
    return getLocalFills(address, tokenId || '')
  } catch {
    return getLocalFills(address, tokenId || '')
  }
}