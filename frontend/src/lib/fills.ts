import type { Fill } from './pnl'

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

// Placeholder for future integration with CLOB fills API
// When available, prefer remote user fills over local storage.
export async function fetchUserFills(_address: string, _tokenId?: string): Promise<Fill[]> {
  // TODO: Implement via CLOB/Data API. Fallback to local for now.
  return []
}