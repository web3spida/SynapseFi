import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { initPOSClient, getPOSClient, depositERC20ForUser, withdrawERC20, balanceOfChildERC20 } from '@/lib/polygon'
import { CONTRACT_ADDRESSES } from '@/utils/constants'

export const BridgePanel: FC = () => {
  const { address, isConnected } = useAccount()

  const [rootTokenAddress, setRootTokenAddress] = useState<string>('')
  const [childTokenAddress, setChildTokenAddress] = useState<string>(CONTRACT_ADDRESSES.SYNAPSE_TOKEN)
  const [amount, setAmount] = useState<string>('1') // default 1 token
  const [loading, setLoading] = useState<{ approve?: boolean; deposit?: boolean; withdraw?: boolean; balance?: boolean }>({})

  useEffect(() => {
    const init = async () => {
      try {
        if (isConnected) {
          await initPOSClient()
        }
      } catch (err) {
        console.error('POSClient init error:', err)
        toast.error('Failed to init Polygon PoS client')
      }
    }
    init()
  }, [isConnected])

  const parseAmountWei = () => {
    try {
      // assumes 18 decimals
      return ethers.utils.parseUnits(amount || '0', 18).toString()
    } catch {
      return '0'
    }
  }

  const handleApprove = async () => {
    if (!address) return toast.error('Connect wallet')
    if (!rootTokenAddress) return toast.error('Enter parent (root) token address')
    setLoading(prev => ({ ...prev, approve: true }))
    try {
      const client = getPOSClient()
      const erc20Root = client.erc20(rootTokenAddress, false) as any
      const tx = await erc20Root.approve(parseAmountWei())
      const receipt = await tx.getReceipt()
      toast.success(`Approve submitted: ${receipt.transactionHash ?? 'tx'}`)
    } catch (err: any) {
      console.error('approve error', err)
      toast.error(err?.message || 'Approve failed')
    } finally {
      setLoading(prev => ({ ...prev, approve: false }))
    }
  }

  const handleDeposit = async () => {
    if (!address) return toast.error('Connect wallet')
    if (!rootTokenAddress) return toast.error('Enter parent (root) token address')
    setLoading(prev => ({ ...prev, deposit: true }))
    try {
      const receipt = await depositERC20ForUser(rootTokenAddress, parseAmountWei(), address)
      toast.success(`Deposit started: ${receipt.transactionHash ?? 'tx'}`)
    } catch (err: any) {
      console.error('deposit error', err)
      toast.error(err?.message || 'Deposit failed')
    } finally {
      setLoading(prev => ({ ...prev, deposit: false }))
    }
  }

  const handleWithdrawStart = async () => {
    setLoading(prev => ({ ...prev, withdraw: true }))
    try {
      const receipt = await withdrawERC20(childTokenAddress, parseAmountWei())
      toast.success(`Withdraw started: ${receipt.transactionHash ?? 'tx'}`)
    } catch (err: any) {
      console.error('withdraw error', err)
      toast.error(err?.message || 'Withdraw failed')
    } finally {
      setLoading(prev => ({ ...prev, withdraw: false }))
    }
  }

  const handleCheckBalance = async () => {
    if (!address) return toast.error('Connect wallet')
    setLoading(prev => ({ ...prev, balance: true }))
    try {
      const bal = await balanceOfChildERC20(childTokenAddress, address)
      const value = typeof bal === 'string' ? bal : (bal?.toString?.() ?? '0')
      const pretty = ethers.utils.formatUnits(value, 18)
      toast.success(`Child balance: ${pretty}`)
    } catch (err: any) {
      console.error('balance error', err)
      toast.error(err?.message || 'Balance check failed')
    } finally {
      setLoading(prev => ({ ...prev, balance: false }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
    >
      <h3 className="text-xl font-bold text-white mb-4">Polygon PoS Bridge (ERC20)</h3>
      <p className="text-xs text-gray-400 mb-4">
        Requires mapped tokens across parent/child chains. Use a known PoS-mapped ERC20 for deposit/withdraw.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Parent Token (root)</label>
          <input
            value={rootTokenAddress}
            onChange={(e) => setRootTokenAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Child Token (Polygon)</label>
          <input
            value={childTokenAddress}
            onChange={(e) => setChildTokenAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Amount</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1.0"
          className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApprove}
          disabled={!!loading.approve}
          className="w-full bg-gray-800/50 text-white px-6 py-3 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition-all duration-300 disabled:opacity-50"
        >
          {loading.approve ? 'Approving...' : 'Approve (Parent)'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeposit}
          disabled={!!loading.deposit}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
        >
          {loading.deposit ? 'Depositing...' : 'Deposit to Polygon'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWithdrawStart}
          disabled={!!loading.withdraw}
          className="w-full bg-gray-800/50 text-white px-6 py-3 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition-all duration-300 disabled:opacity-50"
        >
          {loading.withdraw ? 'Withdrawing...' : 'Withdraw Start (Polygon)'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckBalance}
          disabled={!!loading.balance}
          className="w-full bg-gray-800/50 text-white px-6 py-3 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition-all duration-300 disabled:opacity-50"
        >
          {loading.balance ? 'Checking...' : 'Check Child Balance'}
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Note: Withdraw flow needs checkpoint finality and an exit transaction after proofs are ready.
      </p>
    </motion.div>
  )
}