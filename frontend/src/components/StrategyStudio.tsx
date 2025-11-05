import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ClobClient } from '@polymarket/clob-client'
import { fetchMarkets, fetchBook, fetchClobMarkets, type PMMarket } from '@/lib/polymarket'

type MarketSnapshot = {
  market: PMMarket
  tick_size: number
  neg_risk: boolean
  sumAsk: number
  sumBid: number
  buyArb: boolean
  sellArb: boolean
}

export const StrategyStudio: FC<{ client?: ClobClient | null }> = ({ client }) => {
  const [limit, setLimit] = useState<number>(12)
  const [selectedMarkets, setSelectedMarkets] = useState<Record<string, PMMarket>>({})

  const marketsQ = useQuery({
    queryKey: ['pm', 'studio', 'markets', limit],
    queryFn: () => fetchMarkets({ closed: false, limit, offset: 0 }),
    staleTime: 15_000,
  })

  const markets = (marketsQ.data || []) as PMMarket[]

  const paramsQs = useQueries({
    queries: markets.map(m => ({
      queryKey: ['pm', 'studio', 'params', m.id],
      queryFn: () => fetchClobMarkets([m.id]),
      staleTime: 60_000,
    })),
  })

  const booksQs = useQueries({
    queries: markets.flatMap(m => (m.outcomes || []).map(o => ({
      queryKey: ['pm', 'studio', 'book', m.id, o.tokenId],
      queryFn: () => (o.tokenId ? fetchBook(o.tokenId) : Promise.resolve(null)),
      refetchInterval: 2500,
    }))),
  })

  const snapshots: MarketSnapshot[] = useMemo(() => {
    return markets.map((m, mi) => {
      const p = Array.isArray(paramsQs[mi]?.data) ? (paramsQs[mi]?.data as any)[0] : (paramsQs[mi]?.data as any)
      const tick = p?.tick_size ?? 0.01
      const negRisk = Boolean(p?.neg_risk)
      const outs = m.outcomes || []
      let sumAsk = 0, sumBid = 0
      outs.forEach((o, oi) => {
        const qIndex = markets.slice(0, mi).reduce((acc, prev) => acc + (prev.outcomes?.length || 0), 0) + oi
        const book = booksQs[qIndex]?.data as any
        const bestBid = book?.bids?.[0]?.price ?? 0
        const bestAsk = book?.asks?.[0]?.price ?? 0
        sumAsk += bestAsk
        sumBid += bestBid
      })
      const buyArb = sumAsk > 0 && sumAsk < 1
      const sellArb = sumBid > 1
      return { market: m, tick_size: tick, neg_risk: negRisk, sumAsk, sumBid, buyArb, sellArb }
    })
  }, [markets, paramsQs.map(q => q.data).join('|'), booksQs.map(q => q.data).join('|')])

  const toggleSelect = (m: PMMarket) => {
    setSelectedMarkets(prev => {
      const next = { ...prev }
      if (next[m.id]) delete next[m.id]
      else next[m.id] = m
      return next
    })
  }

  const composeAndSubmit = async (mode: 'buy' | 'sell') => {
    if (!client) return toast.error('CLOB not connected')
    const targets = [] as any[]
    for (const m of Object.values(selectedMarkets)) {
      const pQ = paramsQs[markets.findIndex(x => x.id === m.id)]
      const tick = Array.isArray(pQ?.data) ? (pQ?.data as any)[0]?.tick_size : (pQ?.data as any)?.tick_size
      for (const o of (m.outcomes || [])) {
        const book = booksQs[markets.flatMap(x => x.outcomes || []).findIndex(x => x.tokenId === o.tokenId)]?.data as any
        const price = mode === 'buy' ? (book?.asks?.[0]?.price ?? 0) : (book?.bids?.[0]?.price ?? 0)
        targets.push({ token_id: o.tokenId!, price, size: 5, market_id: m.id, tick_size: tick ?? 0.01, neg_risk: true, side: mode })
      }
    }
    try {
      for (const t of targets) {
        await (client as any).createAndPostOrder(t)
      }
      toast.success(`Submitted ${targets.length} basket orders (${mode}-all across ${Object.keys(selectedMarkets).length} markets)`) 
    } catch (err: any) {
      toast.error(err?.message || 'Basket submission failed')
    }
  }

  return (
    <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-white font-medium">Strategy Studio</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Markets</span>
          <select value={limit} onChange={e => setLimit(Number(e.target.value))} className="bg-gray-900/70 border border-gray-700 text-gray-200 rounded-md px-2 py-1">
            {[6, 12, 24].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {snapshots.map(s => (
          <button
            key={s.market.id}
            onClick={() => toggleSelect(s.market)}
            className={`text-left p-3 rounded-lg border ${selectedMarkets[s.market.id] ? 'border-green-500/50 bg-green-500/10' : 'border-gray-700 bg-gray-900/50 hover:border-purple-500/40'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white text-sm font-medium">{s.market.question}</div>
                <div className="text-xs text-gray-400 mt-1">Outcomes: {s.market.outcomes?.length || 0}</div>
              </div>
              <div className="text-xs text-gray-300">
                <div>Sum Asks: {(s.sumAsk * 100).toFixed(1)}%</div>
                <div>Sum Bids: {(s.sumBid * 100).toFixed(1)}%</div>
                <div className={`${s.buyArb ? 'text-green-400' : 'text-gray-500'}`}>Buy-all {s.buyArb ? '✓' : '—'}</div>
                <div className={`${s.sellArb ? 'text-green-400' : 'text-gray-500'}`}>Sell-all {s.sellArb ? '✓' : '—'}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={!client || Object.keys(selectedMarkets).length === 0}
          onClick={() => composeAndSubmit('buy')}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-400 text-white px-3 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition disabled:opacity-50"
        >
          Buy-All Baskets
        </button>
        <button
          disabled={!client || Object.keys(selectedMarkets).length === 0}
          onClick={() => composeAndSubmit('sell')}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-400 text-white px-3 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/25 transition disabled:opacity-50"
        >
          Sell-All Baskets
        </button>
      </div>
    </div>
  )
}