export type FillSide = 'buy' | 'sell'
export type Fill = {
  tokenId: string
  side: FillSide
  price: number // 0..1
  size: number // integer units
  timestamp?: number
}

export type PnlResult = {
  realized: number
  remainingQty: number
  avgCost: number
}

// FIFO realized P&L calculator per token
export function computeRealizedPnl(fills: Fill[]): PnlResult {
  const ordered = [...(fills || [])].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
  let realized = 0
  const inv: { qty: number; price: number }[] = []

  for (const f of ordered) {
    const size = Math.max(0, Math.floor(f.size || 0))
    if (size === 0 || !(f.price >= 0)) continue
    if (f.side === 'buy') {
      inv.push({ qty: size, price: f.price })
    } else {
      let remaining = size
      while (remaining > 0 && inv.length > 0) {
        const lot = inv[0]
        const take = Math.min(remaining, lot.qty)
        realized += (f.price - lot.price) * take
        lot.qty -= take
        remaining -= take
        if (lot.qty === 0) inv.shift()
      }
      // If selling more than inventory, treat extra as short with zero cost
      if (remaining > 0) {
        realized += (f.price - 0) * remaining
        // No inventory tracked for short beyond this point
      }
    }
  }

  const remainingQty = inv.reduce((acc, l) => acc + l.qty, 0)
  const remainingCost = inv.reduce((acc, l) => acc + l.qty * l.price, 0)
  const avgCost = remainingQty > 0 ? (remainingCost / remainingQty) : 0
  return { realized, remainingQty, avgCost }
}

export function computeMarkToMarket(units: number, midPrice: number, avgCost: number) {
  return (midPrice - avgCost) * units
}