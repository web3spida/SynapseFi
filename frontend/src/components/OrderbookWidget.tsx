import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBook } from '@/lib/polymarket'

export const OrderbookWidget: FC<{ tokenId?: string }> = ({ tokenId }) => {
  const q = useQuery({
    queryKey: ['pm', 'book', tokenId],
    queryFn: () => (tokenId ? fetchBook(tokenId) : Promise.resolve(null)),
    enabled: !!tokenId,
    refetchInterval: 2000,
  })

  if (!tokenId) return <div className="text-gray-500 text-sm">Select an outcome to view orderbook.</div>
  if (q.isLoading) return <div className="text-gray-400 text-sm">Loading book…</div>
  const book = q.data as any
  if (!book) return <div className="text-gray-500 text-sm">No book data.</div>

  return (
    <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
      <div>
        <div className="text-white font-medium mb-1">Bids</div>
        <div className="space-y-1">
          {book.bids.slice(0, 10).map((b: any, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div>{(b.price * 100).toFixed(0)}%</div>
              <div>{b.size}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-white font-medium mb-1">Asks</div>
        <div className="space-y-1">
          {book.asks.slice(0, 10).map((a: any, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div>{(a.price * 100).toFixed(0)}%</div>
              <div>{a.size}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-2 text-gray-500 mt-2">Tick: {book.tick_size} · Neg Risk: {String(book.neg_risk)}</div>
    </div>
  )
}