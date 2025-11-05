import { useMemo } from 'react'
import type { FC } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useQueries } from '@tanstack/react-query'
import { POLYMARKET_ADDRESSES, formatNumber } from '@/utils/constants'
import { ERC1155_MIN_ABI } from '@/utils/erc1155'
import { fetchBook, type PMMarket } from '@/lib/polymarket'
import { computeRealizedPnl } from '@/lib/pnl'
import { getLocalFills } from '@/lib/fills'

const getCostKey = (addr: string, tokenId: string) => `pm:cost:${addr}:${tokenId}`

export const PortfolioView: FC<{ market?: PMMarket | null }> = ({ market }) => {
  const { address } = useAccount()
  const outcomes = market?.outcomes || []

  const balances = outcomes.map((o) => {
    return useReadContract({
      address: POLYMARKET_ADDRESSES.CONDITIONAL_TOKENS as `0x${string}`,
      abi: ERC1155_MIN_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`, BigInt(o.tokenId || '0')],
      query: { enabled: !!address && !!o.tokenId },
    })
  })

  const booksQ = useQueries({
    queries: outcomes.map((o) => ({
      queryKey: ['pm', 'portfolio', 'book', o.tokenId],
      queryFn: () => (o.tokenId ? fetchBook(o.tokenId) : Promise.resolve(null)),
      enabled: !!o.tokenId,
      refetchInterval: 3000,
    })),
  })

  const rows = useMemo(() => {
    return outcomes.map((o, i) => {
      const bal = balances[i]?.data as unknown as bigint | undefined
      const book = booksQ[i]?.data as any
      const bestBid = book?.bids?.[0]?.price ?? 0
      const bestAsk = book?.asks?.[0]?.price ?? 0
      const mid = bestBid && bestAsk ? (bestBid + bestAsk) / 2 : (bestBid || bestAsk || 0)
      const qty = typeof bal === 'bigint' ? Number(bal) : 0
      const costKey = address && o.tokenId ? getCostKey(address, o.tokenId) : ''
      const stored = costKey ? Number(localStorage.getItem(costKey) || '0') : 0
      const fills = getLocalFills(address, o.tokenId || '')
      const { realized, avgCost } = computeRealizedPnl(fills)
      const costBasis = (fills.length ? avgCost : stored) || 0
      const pnlUnrealized = (mid - costBasis) * qty
      const breakeven = costBasis
      return { o, qty, bestBid, bestAsk, mid, pnlUnrealized, realized, breakeven, costKey }
    })
  }, [outcomes, balances.map(b => b?.data).join('|'), booksQ.map(q => q.data).join('|'), address])

  const setCost = (key: string, val: number) => {
    if (!key) return
    localStorage.setItem(key, String(val))
  }

  if (!market) return <div className="text-gray-500 text-sm">Select a market to view your positions.</div>
  if (!address) return <div className="text-gray-500 text-sm">Connect wallet to view your positions.</div>

  const totalQty = rows.reduce((acc, r) => acc + r.qty, 0)
  const totalVal = rows.reduce((acc, r) => acc + r.mid * r.qty, 0)
  const totalUnrealized = rows.reduce((acc, r) => acc + r.pnlUnrealized, 0)
  const totalRealized = rows.reduce((acc, r) => acc + r.realized, 0)

  return (
    <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 space-y-3">
      <div className="text-white font-medium">Portfolio</div>
      <div className="text-xs text-gray-400">Balances from ERC1155 Conditional Tokens; valuations based on mid price.</div>

      <div className="grid grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/50">
          <div className="text-gray-400">Total Qty</div>
          <div className="text-white font-medium">{formatNumber(totalQty)}</div>
        </div>
        <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/50">
          <div className="text-gray-400">Total Value</div>
          <div className="text-white font-medium">{formatNumber(totalVal)}</div>
        </div>
        <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/50">
          <div className="text-gray-400">Unrealized P&L</div>
          <div className={`font-medium ${totalUnrealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatNumber(totalUnrealized)}</div>
        </div>
        <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/50">
          <div className="text-gray-400">Realized P&L</div>
          <div className={`font-medium ${totalRealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatNumber(totalRealized)}</div>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={r.o.tokenId || i} className="grid grid-cols-7 gap-2 items-center text-xs p-2 rounded-lg border border-gray-800 bg-gray-900/50">
            <div className="col-span-2">
              <div className="text-white font-medium">{r.o.name || `Outcome ${i+1}`}</div>
              <div className="text-gray-400">Token {r.o.tokenId}</div>
            </div>
            <div>
              <div className="text-gray-400">Qty</div>
              <div className="text-white font-medium">{formatNumber(r.qty)}</div>
            </div>
            <div>
              <div className="text-gray-400">Mid</div>
              <div className="text-white font-medium">{(r.mid * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-gray-400">Unrealized</div>
              <div className={`font-medium ${r.pnlUnrealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatNumber(r.pnlUnrealized)}</div>
            </div>
            <div>
              <div className="text-gray-400">Realized</div>
              <div className={`font-medium ${r.realized >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatNumber(r.realized)}</div>
            </div>
            <div>
              <label className="text-gray-400">Cost</label>
              <input type="number" step={0.01} defaultValue={Number(localStorage.getItem(r.costKey || '') || '0') || 0} onBlur={(e) => setCost(r.costKey, Number(e.target.value))} className="w-full mt-1 px-2 py-1 rounded-md bg-gray-900/70 border border-gray-700 text-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}