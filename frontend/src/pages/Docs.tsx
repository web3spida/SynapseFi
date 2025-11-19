import type { FC } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { CONTRACT_ADDRESSES } from '../utils/constants'

export const Docs: FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-white mb-4">SynapseFi Documentation</h1>
            <p className="text-gray-400 mb-8">Overview of contracts, environment setup, and integration details.</p>

            <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">Contracts</h2>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <span className="font-medium text-purple-300">SynapseToken</span> address: <code className="text-purple-300">{CONTRACT_ADDRESSES.SYNAPSE_TOKEN}</code>
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-sm">Chain: Polygon Amoy (Testnet). Ensure your wallet is connected to Amoy.</p>
            </section>

            <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">Environment Variables</h2>
              <p className="text-gray-300">Required variables for builds and local dev:</p>
              <ul className="text-gray-300 list-disc pl-6 mt-2 space-y-1">
                <li><code className="text-purple-300">VITE_CHAIN_ID</code> (e.g., 80002)</li>
                <li><code className="text-purple-300">VITE_RPC_URL</code> (Polygon Amoy RPC)</li>
                <li><code className="text-purple-300">VITE_SYNAPSE_TOKEN_ADDRESS</code></li>
                <li><code className="text-purple-300">VITE_WC_PROJECT_ID</code> (WalletConnect)</li>
                <li><code className="text-purple-300">VITE_ENVIRONMENT</code> (development/production)</li>
              </ul>
              <p className="text-gray-400 mt-3 text-sm">On Netlify, add these under Site settings → Build & deploy → Environment.</p>
            </section>

            

            <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">Polymarket Integration</h2>
              <p className="text-gray-300">The Dashboard includes a Polymarket tab for market discovery and viewing recent trades.</p>
              <ul className="text-gray-300 list-disc pl-6 mt-2 space-y-1">
                <li>Gamma Markets API: <code className="text-purple-300">{`VITE_POLYMARKET_GAMMA_API`}</code> (default: gamma-api.polymarket.com)</li>
                <li>Data API (trades): <code className="text-purple-300">{`VITE_POLYMARKET_DATA_API`}</code> (default: data-api.polymarket.com)</li>
                <li>CLOB API: <code className="text-purple-300">{`VITE_POLYMARKET_CLOB_API`}</code> (used for order params, book, and placing orders)</li>
              </ul>
              <p className="text-gray-400 mt-3 text-sm">Trading via API requires CLOB authentication and on-chain approvals. This app derives a CLOB API key from your browser wallet, checks USDC/Conditional Tokens approvals on Polygon, and enables placing limit orders from the Polymarket panel.</p>
            </section>

            <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">Frontend Integration</h2>
              <p className="text-gray-300">The Dashboard includes a Polymarket tab for market discovery, approvals, live orderbooks, and placing orders via CLOB API authentication.</p>
              <p className="text-gray-400 mt-3 text-sm">Make sure your wallet is funded and connected to Polygon.</p>
            </section>

            <section className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-3">Polygon PoS Bridge</h2>
              <p className="text-gray-300">Bridge actions (Approve, Deposit, Withdraw Start, Balance) are available in the Dashboard under Quick Actions via the Bridge panel.</p>
              <p className="text-gray-400 mt-3 text-sm">Deposits require a mapped root token on Ethereum and its child on Polygon. Withdrawals require checkpoint finality and an exit proof.</p>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Docs