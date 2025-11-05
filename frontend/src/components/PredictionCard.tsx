import { useRef, useState } from 'react'
import type { FC } from 'react'
import { ClipboardCopy, Check } from 'lucide-react'
import { toPng } from 'html-to-image'

type Props = {
  marketId?: string
  tokenId?: string
}

export const PredictionCard: FC<Props> = ({ marketId, tokenId }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice] = useState<number>(0.5)
  const [size, setSize] = useState<number>(10)
  const [copied, setCopied] = useState(false)
  const [capturing, setCapturing] = useState(false)

  const url = (() => {
    const u = new URL(window.location.href)
    if (marketId) u.searchParams.set('marketId', marketId)
    if (tokenId) u.searchParams.set('tokenId', tokenId!)
    u.searchParams.set('side', side)
    u.searchParams.set('price', String(price))
    u.searchParams.set('size', String(size))
    return u.toString()
  })()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const handleSnapshot = async () => {
    if (!cardRef.current) return
    setCapturing(true)
    try {
      const dataUrl = await toPng(cardRef.current, { backgroundColor: '#0f172a', pixelRatio: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `prediction-${marketId || 'market'}-${tokenId || 'token'}.png`
      a.click()
    } catch (err) {
      // silent
    } finally {
      setCapturing(false)
    }
  }

  const handleShareX = () => {
    try {
      const text = encodeURIComponent('Exploring this Polymarket setup on SynapseFi ✦')
      const shareUrl = encodeURIComponent(url)
      const intent = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`
      window.open(intent, '_blank')
    } catch {}
  }

  return (
    <div ref={cardRef} className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 space-y-3">
      <div className="text-white font-medium">Shareable Prediction Card</div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-gray-400">Side</label>
          <select value={side} onChange={e => setSide(e.target.value as any)} className="w-full px-2 py-1 rounded-md bg-gray-900/70 border border-gray-700 text-gray-200">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400">Price</label>
          <input type="number" step={0.01} value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full px-2 py-1 rounded-md bg-gray-900/70 border border-gray-700 text-gray-200"/>
        </div>
        <div>
          <label className="text-gray-400">Size</label>
          <input type="number" min={1} step={1} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full px-2 py-1 rounded-md bg-gray-900/70 border border-gray-700 text-gray-200"/>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input readOnly value={url} className="flex-1 text-xs px-2 py-1 rounded-md bg-gray-900/70 border border-gray-700 text-gray-300"/>
        <button onClick={handleCopy} className="inline-flex items-center gap-2 bg-gray-800/50 text-white px-3 py-2 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition">
          {copied ? <Check className="w-4 h-4"/> : <ClipboardCopy className="w-4 h-4"/>}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button onClick={handleSnapshot} className="inline-flex items-center gap-2 bg-purple-600/80 text-white px-3 py-2 rounded-xl font-medium border border-purple-500/50 hover:bg-purple-500 transition disabled:opacity-50" disabled={capturing}>
          {capturing ? 'Capturing…' : 'Download Image'}
        </button>
        <button onClick={handleShareX} className="inline-flex items-center gap-2 bg-blue-600/80 text-white px-3 py-2 rounded-xl font-medium border border-blue-500/50 hover:bg-blue-500 transition">
          Share to X
        </button>
      </div>
      <p className="text-xs text-gray-500">This link pre-fills the order form for the selected market/outcome.</p>
    </div>
  )
}