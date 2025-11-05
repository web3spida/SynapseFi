import { useState, useMemo } from 'react'
import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ClobClient } from '@polymarket/clob-client'
import { fetchClobMarkets } from '@/lib/polymarket'

type Props = {
  client: ClobClient
  marketId: string
  tokenId: string
  initialSide?: 'buy' | 'sell'
  initialPrice?: number
  initialSize?: number
}

export const PolymarketOrderForm: FC<Props> = ({ client, marketId, tokenId, initialSide, initialPrice, initialSize }) => {
  const [side, setSide] = useState<'buy' | 'sell'>(initialSide ?? 'buy')
  const [price, setPrice] = useState<number>(initialPrice ?? 0.5)
  const [size, setSize] = useState<number>(initialSize ?? 10)
  const [submitting, setSubmitting] = useState(false)

  const marketQuery = useQuery({
    queryKey: ['pm', 'clob', 'market', marketId],
    queryFn: () => fetchClobMarkets([marketId]),
    staleTime: 30_000,
  })

  const tickSize = useMemo(() => {
    const m = Array.isArray(marketQuery.data) ? marketQuery.data[0] : marketQuery.data
    return m?.tick_size ?? 0.01
  }, [marketQuery.data])

  const negRisk = useMemo(() => {
    const m = Array.isArray(marketQuery.data) ? marketQuery.data[0] : marketQuery.data
    return Boolean(m?.neg_risk)
  }, [marketQuery.data])

  const snapToTick = (p: number) => Math.round(p / tickSize) * tickSize

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const p = snapToTick(price)

      const orderReq: any = {
        token_id: tokenId,
        side,
        price: p,
        size,
        market_id: marketId,
        tick_size: tickSize,
        neg_risk: negRisk,
      }

      const res = await (client as any).createAndPostOrder(orderReq)
      toast.success(`Order submitted: ${res?.order_id || 'OK'}`)
    } catch (err: any) {
      toast.error(err?.message || 'Order failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 space-y-3">
      <div className="text-white font-medium">Create Order</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400">Side</label>
          <select value={side} onChange={e => setSide(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-gray-900/70 border border-gray-700 text-gray-200">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400">Price</label>
          <input type="number" step={tickSize} value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-gray-900/70 border border-gray-700 text-gray-200"/>
        </div>
        <div>
          <label className="text-xs text-gray-400">Size</label>
          <input type="number" min={0} step={1} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-gray-900/70 border border-gray-700 text-gray-200"/>
        </div>
        <div className="text-xs text-gray-500 self-end">Tick: {tickSize} · Neg Risk: {String(negRisk)}</div>
      </div>
      <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-3 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition disabled:opacity-50">
        {submitting ? 'Submitting…' : 'Submit Order'}
      </button>
    </form>
  )
}