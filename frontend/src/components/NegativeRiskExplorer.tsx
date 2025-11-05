import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ClobClient } from '@polymarket/clob-client'
import { fetchBook, fetchClobMarkets, type PMMarket } from '@/lib/polymarket'

type Props = {
  market?: PMMarket | null
  client?: ClobClient | null
}

export const NegativeRiskExplorer: FC<Props> = ({ market, client }) => {
  const [size, setSize] = useState<number>(5)
  const outcomes = market?.outcomes || []

  const marketParamsQ = useQuery({
    queryKey: ['pm', 'clob', 'market-params', market?.id],
    queryFn: () => (market?.id ? fetchClobMarkets([market.id]) : Promise.resolve(null)),
    enabled: !!market?.id,
    staleTime: 60_000,
  })

  const tickSize = useMemo(() => {
    const m = Array.isArray(marketParamsQ.data) ? marketParamsQ.data[0] : marketParamsQ.data
    return m?.tick_size ?? 0.01
  }, [marketParamsQ.data])

  const booksQ = useQueries({
    queries: outcomes.map((o) => ({
      queryKey: ['pm', 'book', o.tokenId],
      queryFn: () => (o.tokenId ? fetchBook(o.tokenId) : Promise.resolve(null)),
      enabled: Boolean(o.tokenId),
      refetchInterval: 2500,
    })),
  })

  const bests = useMemo(() => {
    return booksQ.map((q, i) => {
      const book = q.data as any
      const bestBid = book?.bids?.[0]?.price ?? null
      const bestAsk = book?.asks?.[0]?.price ?? null
      return { outcome: outcomes[i], bestBid, bestAsk }
    }).filter(Boolean)
  }, [booksQ.map(b => b.data).join('|')])

  const sumBid = useMemo(() => bests.reduce((acc, b) => acc + (typeof b.bestBid === 'number' ? b.bestBid : 0), 0), [bests])
  const sumAsk = useMemo(() => bests.reduce((acc, b) => acc + (typeof b.bestAsk === 'number' ? b.bestAsk : 0), 0), [bests])

  const buyArb = sumAsk > 0 && sumAsk < 1
  const sellArb = sumBid > 1
  const buyMargin = buyArb ? (1 - sumAsk) : 0
  const sellMargin = sellArb ? (sumBid - 1) : 0

  const snapToTick = (p: number) => Math.round(p / tickSize) * tickSize

  const placeBasket = async () => {
    if (!client || !market?.id) return toast.error('CLOB not connected')
    const side: 'buy' | 'sell' = buyArb ? 'buy' : 'sell'
    const targets = bests.map(b => ({
      token_id: b.outcome.tokenId!,
      price: snapToTick((side === 'buy' ? b.bestAsk : b.bestBid) ?? 0),
      size,
      market_id: market.id,
      tick_size: tickSize,
      neg_risk: true,
      side,
    })).filter(t => t.price > 0)

    if (targets.length !== outcomes.length) {
      toast.error('Missing best prices for some outcomes')
      return
    }

    try {
      for (const t of targets) {
        await (client as any).createAndPostOrder(t)
      }
      toast.success(`${side === 'buy' ? 'Buy-all' : 'Sell-all'} basket submitted (${targets.length} orders)`) 
    } catch (err: any) {
      toast.error(err?.message || 'Basket submission failed')
    }
  }

  if (!market) return (
    <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 text-sm text-gray-500">Select a market to analyze negative risk.</div>
  )

  return (
    <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 space-y-3">
      <div className="text-white font-medium">Negative Risk Explorer</div>
      <div className="text-xs text-gray-400">Detect buy-all or sell-all arbitrage across outcomes at top-of-book.</div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-gray-300">Sum(best asks)</div>
          <div className="relative h-2 rounded bg-gray-800 overflow-hidden mt-1">
            <div className={`h-full ${buyArb ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${Math.min(100, Math.max(0, sumAsk * 100))}%` }} />
          </div>
          <div className="text-gray-400 mt-1">{(sumAsk * 100).toFixed(1)}% {buyArb ? `· Margin ${(buyMargin * 100).toFixed(2)}%` : ''}</div>
        </div>
        <div>
          <div className="text-gray-300">Sum(best bids)</div>
          <div className="relative h-2 rounded bg-gray-800 overflow-hidden mt-1">
            <div className={`h-full ${sellArb ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${Math.min(100, Math.max(0, sumBid * 100))}%` }} />
          </div>
          <div className="text-gray-400 mt-1">{(sumBid * 100).toFixed(1)}% {sellArb ? `· Margin ${(sellMargin * 100).toFixed(2)}%` : ''}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs text-gray-300">
        {outcomes.map((o, i) => {
          const b = bests[i]
          return (
            <div key={o.tokenId || i} className="p-2 rounded-lg border border-gray-800">
              <div className="text-white text-xs font-medium">{o.name || `Outcome ${i+1}`}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-400">Bid</span>
                <span>{typeof b?.bestBid === 'number' ? `${Math.round(b.bestBid * 100)}%` : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ask</span>
                <span>{typeof b?.bestAsk === 'number' ? `${Math.round(b.bestAsk * 100)}%` : '-'}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 items-end">
        <div>
          <label className="text-xs text-gray-400">Per-outcome size</label>
          <input type="number" min={1} step={1} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-gray-900/70 border border-gray-700 text-gray-200"/>
          <div className="text-xs text-gray-500 mt-1">Tick: {tickSize}</div>
        </div>
        <div className="col-span-2">
          <button
            disabled={!client || (!buyArb && !sellArb)}
            onClick={placeBasket}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-400 text-white px-3 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition disabled:opacity-50"
          >
            {buyArb ? 'Place Buy-All Basket' : (sellArb ? 'Place Sell-All Basket' : 'No Arbitrage Detected')}
          </button>
        </div>
      </div>
    </div>
  )
}