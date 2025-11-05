import { useMemo } from 'react'
import type { FC } from 'react'
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, ShieldCheck, Coins, Repeat } from 'lucide-react'
import toast from 'react-hot-toast'
import { SYNAPSE_TOKEN_ABI } from '@/utils/abis'
import { ERC1155_MIN_ABI } from '@/utils/erc1155'
import { POLYMARKET_ADDRESSES, POLYGON_CHAIN_ID, formatNumber } from '@/utils/constants'

const MAX_UINT256 = (2n ** 256n - 1n)

export const PolymarketApprovals: FC = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const { writeContract, data: txHash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash })

  const isOnPolygon = chainId === POLYGON_CHAIN_ID

  const allowanceRes = useReadContract({
    address: POLYMARKET_ADDRESSES.USDC as `0x${string}`,
    abi: SYNAPSE_TOKEN_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, POLYMARKET_ADDRESSES.EXCHANGE as `0x${string}`],
  })

  const erc1155ApprovalRes = useReadContract({
    address: POLYMARKET_ADDRESSES.CONDITIONAL_TOKENS as `0x${string}`,
    abi: ERC1155_MIN_ABI,
    functionName: 'isApprovedForAll',
    args: [address as `0x${string}`, POLYMARKET_ADDRESSES.EXCHANGE as `0x${string}`],
  })

  const allowance = useMemo(() => {
    const v = allowanceRes?.data as unknown as bigint | undefined
    return typeof v === 'bigint' ? v : 0n
  }, [allowanceRes?.data])

  const hasUSDCApproval = allowance > 0n
  const hasERC1155Approval = (erc1155ApprovalRes?.data as unknown as boolean) === true

  const ensurePolygon = async () => {
    if (!isOnPolygon) await switchChainAsync({ chainId: POLYGON_CHAIN_ID })
  }

  const handleApproveUSDC = async () => {
    try {
      if (!address) return toast.error('Connect wallet')
      await ensurePolygon()
      await writeContract({
        address: POLYMARKET_ADDRESSES.USDC as `0x${string}`,
        abi: SYNAPSE_TOKEN_ABI,
        functionName: 'approve',
        args: [POLYMARKET_ADDRESSES.EXCHANGE as `0x${string}`, MAX_UINT256],
      })
      toast.success('Approve USDC submitted')
    } catch (err: any) {
      toast.error(err?.message || 'Approve USDC failed')
    }
  }

  const handleApproveERC1155 = async () => {
    try {
      if (!address) return toast.error('Connect wallet')
      await ensurePolygon()
      await writeContract({
        address: POLYMARKET_ADDRESSES.CONDITIONAL_TOKENS as `0x${string}`,
        abi: ERC1155_MIN_ABI,
        functionName: 'setApprovalForAll',
        args: [POLYMARKET_ADDRESSES.EXCHANGE as `0x${string}`, true],
      })
      toast.success('Approval for outcome tokens submitted')
    } catch (err: any) {
      toast.error(err?.message || 'SetApprovalForAll failed')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 rounded-xl border border-gray-700 bg-gray-900/50"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-300" />
          <div className="text-white font-medium">Trading Approvals</div>
        </div>
        {hasUSDCApproval && hasERC1155Approval ? (
          <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</span>
        ) : (
          <span className="text-xs text-yellow-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Action needed</span>
        )}
      </div>

      {!isOnPolygon && (
        <div className="text-xs text-yellow-400 flex items-center gap-2 mb-3">
          <Repeat className="w-4 h-4" /> Switch to Polygon Mainnet to approve
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="text-gray-300 flex items-center gap-2"><Coins className="w-4 h-4 text-purple-300" /> USDC Allowance</div>
          <div className="text-gray-400">{formatNumber(Number(allowance))}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-300">Outcome Tokens Operator</div>
          <div className={hasERC1155Approval ? 'text-green-400' : 'text-gray-400'}>{hasERC1155Approval ? 'Enabled' : 'Disabled'}</div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleApproveUSDC}
            disabled={isPending || isConfirming || !address}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-3 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition disabled:opacity-50"
          >
            {isPending || isConfirming ? 'Approving…' : 'Approve USDC'}
          </button>
          <button
            onClick={handleApproveERC1155}
            disabled={isPending || isConfirming || !address}
            className="inline-flex items-center gap-2 bg-gray-800/50 text-white px-3 py-2 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition disabled:opacity-50"
          >
            Enable Outcome Tokens
          </button>
        </div>
      </div>
    </motion.div>
  )
}