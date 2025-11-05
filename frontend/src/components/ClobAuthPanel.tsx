import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, KeyRound, PlugZap, Wallet, AlertCircle } from 'lucide-react'
import { connectClobViaBrowser, getSavedClobCreds } from '@/lib/clob'
import { formatAddress } from '@/utils/constants'

export const ClobAuthPanel: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creds, setCreds] = useState<ReturnType<typeof getSavedClobCreds>>(null)

  useEffect(() => {
    setCreds(getSavedClobCreds())
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await connectClobViaBrowser()
      setCreds({ key: res.creds.key, passphrase: res.creds.passphrase, address: res.address, funder: res.funder, ts: Date.now() })
    } catch (e: any) {
      setError(e?.message || 'Failed to derive API credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/20 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-purple-300" />
          <div className="text-white font-medium">Polymarket CLOB Authentication</div>
        </div>
        {creds ? (
          <span className="text-xs text-green-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Connected
          </span>
        ) : (
          <span className="text-xs text-yellow-400 flex items-center gap-1">
            <PlugZap className="w-3 h-3" /> Not connected
          </span>
        )}
      </div>

      <div className="text-xs text-gray-400 mb-3">
        Uses a signed EIP-712 message to derive API credentials. This will briefly switch your wallet to Polygon Mainnet (chainId 137) to sign, then switch back.
      </div>

      {error && (
        <div className="text-xs text-red-400 flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {!creds && (
          <button
            disabled={loading}
            onClick={handleConnect}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition disabled:opacity-50"
          >
            {loading ? 'Deriving…' : (<><Wallet className="w-4 h-4" /> Derive API Key</>)}
          </button>
        )}

        {creds && (
          <div className="text-xs text-gray-300 space-y-1">
            <div>Address: <span className="text-gray-200">{formatAddress(creds.address)}</span></div>
            <div>Funder: <span className="text-gray-200">{formatAddress(creds.funder)}</span></div>
            <div>API Key: <span className="text-gray-400">{creds.key}</span></div>
          </div>
        )}
      </div>
    </motion.div>
  )
}