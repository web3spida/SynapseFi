import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchBook, type PMBook } from '@/lib/polymarket'

type RowChange = 'up' | 'down' | 'none'

const HeatCell: FC<{ value: number; max: number; change: RowChange; label: string }> = ({ value, max, change, label }) => {
  const pct = Math.min(1, Math.max(0, value / (max || 1)))
  const bg = `linear-gradient(to right, rgba(147, 51, 234, ${0.15 + pct * 0.5}) ${pct * 100}%, transparent ${pct * 100}%)`
  const pulse = change === 'up' ? 'ring-1 ring-green-500/50' : (change === 'down' ? 'ring-1 ring-red-500/50' : '')
  return (
    <motion.div layout className={`px-2 py-1 rounded-md border border-gray-800 bg-gray-900/50 ${pulse}`} style={{ backgroundImage: bg }}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-200">{value}</span>
      </div>
    </motion.div>
  )
}

export const StreamingOrderbook: FC<{ tokenId?: string }> = ({ tokenId }) => {
  const prevRef = useRef<PMBook | null>(null)
  const q = useQuery({
    queryKey: ['pm', 'book-stream', tokenId],
    queryFn: () => (tokenId ? fetchBook(tokenId) : Promise.resolve(null as any)),
    enabled: !!tokenId,
    refetchInterval: 1000,
  })

  useEffect(() => {
    if (q.data) prevRef.current = q.data as PMBook
  }, [q.data])

  if (!tokenId) return <div className="text-gray-500 text-sm">Select an outcome to view orderbook.</div>
  if (q.isLoading) return <div className="text-gray-400 text-sm">Loading live book…</div>
  const book = q.data as PMBook | null
  if (!book) return <div className="text-gray-500 text-sm">No book data.</div>

  const maxBidSize = Math.max(...(book.bids || []).slice(0, 20).map(b => Number(b.size) || 0), 1)
  const maxAskSize = Math.max(...(book.asks || []).slice(0, 20).map(a => Number(a.size) || 0), 1)

  const changeFor = (side: 'bids' | 'asks', idx: number): RowChange => {
    const prev = prevRef.current
    if (!prev) return 'none'
    const curRow = book[side]?.[idx]
    const prevRow = prev[side]?.[idx]
    if (!curRow || !prevRow) return 'none'
    const delta = Number(curRow.size) - Number(prevRow.size)
    if (delta > 0.0001) return 'up'
    if (delta < -0.0001) return 'down'
    return 'none'
  }

  return (
    <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-medium">Bids</div>
          <div className="text-gray-500">Tick {book.tick_size} · NegRisk {String(book.neg_risk)}</div>
        </div>
        <div className="space-y-1">
          {(book.bids || []).slice(0, 20).map((b, i) => (
            <HeatCell key={`b-${i}`} value={Number(b.size)} max={maxBidSize} change={changeFor('bids', i)} label={`${(b.price * 100).toFixed(0)}%`} />
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-medium">Asks</div>
          <div className="text-gray-500">Tick {book.tick_size} · NegRisk {String(book.neg_risk)}</div>
        </div>
        <div className="space-y-1">
          {(book.asks || []).slice(0, 20).map((a, i) => (
            <HeatCell key={`a-${i}`} value={Number(a.size)} max={maxAskSize} change={changeFor('asks', i)} label={`${(a.price * 100).toFixed(0)}%`} />
          ))}
        </div>
      </div>
    </div>
  )
}