import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, ExternalLink, RefreshCw } from 'lucide-react'
import { fetchMarkets, fetchTags, fetchTrades, polymarketUrlForMarket, type PMMarket, type PMTrade } from '@/lib/polymarket'
import { ClobAuthPanel } from './ClobAuthPanel'
import { PolymarketApprovals } from './PolymarketApprovals'
import { OrderbookWidget } from './OrderbookWidget'
import { PolymarketOrderForm } from './PolymarketOrderForm'
import { reconnectClobWithSavedCreds } from '@/lib/clob'

export const PolymarketPanel: FC = () => {
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<number | 'all'>('all')
  const [selected, setSelected] = useState<PMMarket | null>(null)
  const [clob, setClob] = useState<Awaited<ReturnType<typeof reconnectClobWithSavedCreds>>>(null)

  useEffect(() => {
    (async () => setClob(await reconnectClobWithSavedCreds()))()
  }, [])

  const tagsQuery = useQuery({
    queryKey: ['pm', 'tags'],
    queryFn: () => fetchTags(),
    staleTime: 5 * 60_000,
  })

  const marketsQuery = useQuery({
    queryKey: ['pm', 'markets', { tag: selectedTag, q: query }],
    queryFn: async () => {
      // Prefer tag filter; fallback to general browse; slug search if query looks like slug
      if (query && query.length > 2 && query.includes('-')) {
        const res = await fetchMarkets({ slug: query.trim() })
        return res.filter(Boolean)
      }
      const res = await fetchMarkets({ closed: false, limit: 25, offset: 0, tag_id: selectedTag === 'all' ? undefined : selectedTag })
      // Naive client-side query filter on question text
      return res.filter(m => !query || (m.question?.toLowerCase().includes(query.toLowerCase())))
    },
    staleTime: 30_000,
  })

  const tradesQuery = useQuery({
    queryKey: ['pm', 'trades', selected?.id],
    queryFn: () => (selected?.id ? fetchTrades({ market: selected.id, limit: 50 }) : Promise.resolve([] as PMTrade[])),
    enabled: !!selected?.id,
    refetchInterval: 10_000,
  })

  const tags = tagsQuery.data ?? []
  const markets = marketsQuery.data ?? []

  const handleSelect = (m: PMMarket) => {
    setSelected(m)
  }

  // Choose first outcome token for demo orderbook/order form
  const tokenId = selected?.outcomes?.[0]?.tokenId || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Polymarket</h3>
        <a href="https://docs.polymarket.com/" target="_blank" rel="noreferrer" className="text-xs text-purple-300 hover:underline">Learn more</a>
      </div>

      {/* Auth + Approvals + Search */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 space-y-4">
          <ClobAuthPanel />
          <PolymarketApprovals />
        </div>
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets (e.g. us-election-2024)"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900/70 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>
        <div>
          <select
            value={selectedTag}
            onChange={(e) => {
              setSelected(null)
              const val = e.target.value
              setSelectedTag(val === 'all' ? 'all' : Number(val))
            }}
            className="w-full px-3 py-2 rounded-xl bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="all">All tags</option>
            {tags.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-white font-medium">Markets</div>
            <button
              disabled={marketsQuery.isFetching}
              className="text-xs text-gray-400 hover:text-purple-300 flex items-center gap-1"
              onClick={() => marketsQuery.refetch()}
            >
              <RefreshCw className={`w-3 h-3 ${marketsQuery.isFetching ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
          <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
            {marketsQuery.isLoading && (
              <div className="text-gray-400 text-sm">Loading markets…</div>
            )}
            {!marketsQuery.isLoading && markets.length === 0 && (
              <div className="text-gray-500 text-sm">No markets match your filter.</div>
            )}
            {markets.map(m => (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${selected?.id === m.id ? 'border-purple-500/50 bg-purple-500/10' : 'border-gray-700 hover:border-purple-500/30 bg-gray-900/50'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-medium">{m.question || 'Untitled market'}</div>
                    <div className="text-xs text-gray-400 mt-1">{m.category || 'General'}</div>
                  </div>
                  <a
                    href={polymarketUrlForMarket(m.slug, m.id)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-purple-300 hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50">
            <div className="text-white font-medium">Selected Market</div>
            {!selected && (
              <div className="text-gray-500 text-sm mt-2">Select a market to view details and recent trades.</div>
            )}
            {!!selected && (
              <div className="text-sm text-gray-300 mt-2">
                <div className="text-white">{selected.question || 'Untitled market'}</div>
                <div className="text-xs text-gray-400 mt-1">{selected.category || 'General'}</div>
                {selected.outcomes && selected.outcomes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selected.outcomes.map((o, i) => (
                      <div key={i} className="px-3 py-1 rounded-full bg-gray-800 text-xs text-gray-300 border border-gray-700">
                        {(o.name || 'Outcome')} {typeof o.price === 'number' ? `· ${Math.round(o.price * 100)}%` : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 max-h-[280px] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">Recent Trades</div>
              <button
                disabled={!selected?.id}
                onClick={() => tradesQuery.refetch()}
                className="text-xs text-gray-400 hover:text-purple-300"
              >
                Refresh
              </button>
            </div>
            {!selected?.id && (
              <div className="text-gray-500 text-sm">Select a market to load recent trades.</div>
            )}
            {!!selected?.id && (
              <div className="space-y-2 text-xs text-gray-300">
                {tradesQuery.isLoading && (
                  <div className="text-gray-400">Loading trades…</div>
                )}
                {tradesQuery.data?.length === 0 && !tradesQuery.isLoading && (
                  <div className="text-gray-500">No recent trades found for this market.</div>
                )}
                {tradesQuery.data?.map((t, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <div className="text-gray-400">{new Date(t.match_time || '').toLocaleString()}</div>
                    <div className={`font-medium ${t.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{t.side?.toUpperCase()}</div>
                    <div>{typeof t.price === 'number' ? `${Math.round(t.price * 100)}%` : '-'}</div>
                    <div>{t.size ?? '-'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Orderbook + Order Form */}
          <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50">
            <div className="text-white font-medium mb-2">Orderbook</div>
            <OrderbookWidget tokenId={tokenId} />
          </div>
          <div>
            {clob?.client && selected?.id && tokenId ? (
              <PolymarketOrderForm client={clob.client} marketId={selected.id} tokenId={tokenId} />
            ) : (
              <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 text-sm text-gray-500">
                Derive API key, select a market, and choose an outcome to place orders.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}