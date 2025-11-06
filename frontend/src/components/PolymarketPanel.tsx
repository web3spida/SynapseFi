import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, ExternalLink, RefreshCw } from 'lucide-react'
import { fetchMarkets, fetchTags, fetchTrades, fetchEvents, polymarketUrlForMarket, type PMMarket, type PMTrade } from '@/lib/polymarket'
import { ClobAuthPanel } from './ClobAuthPanel'
import { PolymarketApprovals } from './PolymarketApprovals'
import { StreamingOrderbook } from './StreamingOrderbook'
import { PolymarketOrderForm } from './PolymarketOrderForm'
import { NegativeRiskExplorer } from './NegativeRiskExplorer'
import { PortfolioView } from './PortfolioView'
import { PredictionCard } from './PredictionCard'
import { StrategyStudio } from './StrategyStudio'
import { reconnectClobWithSavedCreds } from '@/lib/clob'

export const PolymarketPanel: FC = () => {
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<number | 'all'>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'endDate'>('relevance')
  const [selected, setSelected] = useState<PMMarket | null>(null)
  const [selectedTokenId, setSelectedTokenId] = useState<string>('')
  const [clob, setClob] = useState<Awaited<ReturnType<typeof reconnectClobWithSavedCreds>>>(null)
  const [offset, setOffset] = useState(0)
  const [limit] = useState(48)
  const [allMarkets, setAllMarkets] = useState<PMMarket[]>([])

  useEffect(() => {
    (async () => setClob(await reconnectClobWithSavedCreds()))()
  }, [])

  const tagsQuery = useQuery({
    queryKey: ['pm', 'tags'],
    queryFn: () => fetchTags(),
    staleTime: 5 * 60_000,
  })

  const marketsQuery = useQuery({
    queryKey: ['pm', 'markets', { tag: selectedTag, q: query, offset, limit }],
    queryFn: async () => {
      // Prefer slug search if query looks like a market slug
      if (query && query.length > 2 && query.includes('-')) {
        const res = await fetchMarkets({ slug: query.trim() })
        return res.filter(Boolean)
      }
      let res = await fetchMarkets({ closed: false, limit, offset, tag_id: selectedTag === 'all' ? undefined : selectedTag })
      // Fallback: if Gamma markets endpoint returns 0, try events and flatten markets
      if (!res || res.length === 0) {
        const events = await fetchEvents({ closed: false, limit: 20, offset: 0 })
        const flattened = events.flatMap(e => e.markets || [])
        res = flattened
      }
      // Naive client-side query filter on question text
      res = res.filter(m => !query || (m.question?.toLowerCase().includes(query.toLowerCase())))
      // Optional sorting
      if (sortBy === 'endDate') {
        res.sort((a, b) => new Date(a.endDate || 0).getTime() - new Date(b.endDate || 0).getTime())
      }
      return res
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

  // Aggregate markets across pages
  useEffect(() => {
    if (markets && Array.isArray(markets)) {
      setAllMarkets(prev => {
        const next = offset === 0 ? markets : [...prev, ...markets]
        const deduped = next.filter((m, idx, arr) => arr.findIndex(x => x.id === m.id) === idx)
        return deduped
      })
    }
  }, [markets, offset])

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0)
    setAllMarkets([])
  }, [selectedTag, query, sortBy])

  const handleSelect = (m: PMMarket) => {
    setSelected(m)
    setSelectedTokenId(m?.outcomes?.[0]?.tokenId || '')
  }

  // Choose first outcome token for demo orderbook/order form
  const tokenId = selectedTokenId || selected?.outcomes?.[0]?.tokenId || ''

  // Deep-link parsing: marketId, slug, tokenId, side, price, size
  useEffect(() => {
    const u = new URL(window.location.href)
    const qMarketId = u.searchParams.get('marketId') || undefined
    const qSlug = u.searchParams.get('slug') || undefined
    const qTokenId = u.searchParams.get('tokenId') || undefined
    const qSide = (u.searchParams.get('side') as 'buy' | 'sell' | null) || null
    const qPrice = u.searchParams.get('price')
    const qSize = u.searchParams.get('size')

    if ((qMarketId || qSlug) && markets.length > 0 && !selected) {
      const found = markets.find(m => (qMarketId && m.id === qMarketId) || (qSlug && m.slug === qSlug))
      if (found) {
        setSelected(found)
        if (qTokenId) setSelectedTokenId(qTokenId)
      }
    }
    if (qTokenId && selected) setSelectedTokenId(qTokenId)
    // Store prefill states for order form in state scoped to panel
    if (qSide || qPrice || qSize) {
      setPrefill({
        side: (qSide ?? undefined) as any,
        price: qPrice ? Number(qPrice) : undefined,
        size: qSize ? Number(qSize) : undefined,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markets, selected])

  const [prefill, setPrefill] = useState<{ side?: 'buy' | 'sell'; price?: number; size?: number }>({})

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 min-h-[calc(100vh-8rem)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Polymarket Markets</h3>
          <p className="text-xs text-gray-400">Discover, filter, and trade with live data</p>
        </div>
        <a href="https://docs.polymarket.com/" target="_blank" rel="noreferrer" className="text-xs text-purple-300 hover:underline">Learn more</a>
      </div>

      {/* Auth + Approvals + Search */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 space-y-4">
          <ClobAuthPanel />
          <PolymarketApprovals />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div className="relative md:col-span-2">
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="endDate">Sort: End Date</option>
            </select>
          </div>
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

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-medium">Markets</div>
            <div className="flex items-center gap-3">
              {marketsQuery.error && (
                <div className="text-xs text-red-400">Error loading markets</div>
              )}
              <button
                disabled={marketsQuery.isFetching}
                className="text-xs text-gray-400 hover:text-purple-300 flex items-center gap-1"
                onClick={() => marketsQuery.refetch()}
              >
                <RefreshCw className={`w-3 h-3 ${marketsQuery.isFetching ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </div>

          {/* Grid of market cards */}
          {marketsQuery.isLoading && offset === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-700 bg-gray-900/50 animate-pulse h-40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allMarkets.length === 0 && (
                <div className="col-span-full text-gray-500 text-sm">No markets match your filter.</div>
              )}
              {allMarkets.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`group w-full text-left rounded-xl border transition-colors overflow-hidden ${selected?.id === m.id ? 'border-purple-500/50 bg-purple-500/10' : 'border-gray-700 hover:border-purple-500/30 bg-gray-900/50'}`}
                >
                  {/* Image/thumbnail */}
                  <div className="h-24 bg-gray-800/60">
                    {m.image ? (
                      <img src={m.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <div className="text-white font-medium line-clamp-2">{m.question || 'Untitled market'}</div>
                    <div className="text-xs text-gray-400 mt-1">{m.category || 'General'}</div>
                    {m.outcomes && m.outcomes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {m.outcomes.slice(0, 2).map((o, i) => (
                          <div key={i} className="px-2 py-1 rounded-full bg-gray-800 text-xs text-gray-300 border border-gray-700">
                            {(o.name || 'Outcome')} {typeof o.price === 'number' ? `· ${Math.round(o.price * 100)}%` : ''}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition">
                      <a
                        href={polymarketUrlForMarket(m.slug, m.id)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        View on Polymarket <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={() => setOffset(o => o + limit)}
              disabled={marketsQuery.isFetching}
              className="px-4 py-2 text-xs rounded-xl border border-gray-700 text-gray-300 hover:border-purple-500/40 hover:text-purple-300 disabled:opacity-50"
            >
              {marketsQuery.isFetching ? 'Loading…' : 'Load more'}
            </button>
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
            <div className="text-white font-medium mb-2">Orderbook (Live)</div>
            <StreamingOrderbook tokenId={tokenId} />
          </div>
          <div>
            {clob?.client && selected?.id && tokenId ? (
              <PolymarketOrderForm
                client={clob.client}
                marketId={selected.id}
                tokenId={tokenId}
                initialSide={prefill.side}
                initialPrice={prefill.price}
                initialSize={prefill.size}
              />
            ) : (
              <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 text-sm text-gray-500">
                Derive API key, select a market, and choose an outcome to place orders.
              </div>
            )}
          </div>
          <div>
            <PortfolioView market={selected || undefined} />
          </div>
          <div>
            <NegativeRiskExplorer market={selected || undefined} client={clob?.client || undefined} />
          </div>
          <div>
            <StrategyStudio client={clob?.client || null} />
          </div>
          <div>
            <PredictionCard marketId={selected?.id} tokenId={tokenId} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}