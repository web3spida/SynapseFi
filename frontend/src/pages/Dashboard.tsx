import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { CreditPassportCard } from '../components/CreditPassportCard';
import { CREDIT_PASSPORT_ABI } from '../utils/abis';
import { CONTRACT_ADDRESSES, ZERO_ADDRESS, formatAddress } from '../utils/constants';
import { RefreshCw, Settings, User, BarChart3, ChevronsLeft, ChevronsRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { BridgePanel } from '../components/BridgePanel';
import { PolymarketPanel } from '../components/PolymarketPanel';

export const Dashboard: FC = () => {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState<number>(650);
  const [lastUpdated, setLastUpdated] = useState<number>(Math.floor(Date.now() / 1000));
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'passport' | 'governance' | 'polymarket'>('dashboard');

  const isContractConfigured = useMemo(() => (
    CONTRACT_ADDRESSES.CREDIT_PASSPORT !== ZERO_ADDRESS
  ), [])
  
  const { data: scoreData, refetch, isLoading: isReading } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_PASSPORT as `0x${string}`,
    abi: CREDIT_PASSPORT_ABI,
    functionName: 'getScore',
    args: [address!],
    query: { enabled: !!address && isContractConfigured },
  });

  const { writeContract: updateScore, isPending: isWriting, data: txHash } = useWriteContract();
  
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (scoreData) {
      const [fetchedScore, fetchedTimestamp] = scoreData;
      setScore(Number(fetchedScore));
      setLastUpdated(Number(fetchedTimestamp));
    }
  }, [scoreData]);

  useEffect(() => {
    if (!isConfirming && txHash) {
      // After confirmation, refresh to get latest on-chain score
      refetch();
    }
  }, [isConfirming, txHash, refetch]);

  const handleUpdateScore = async () => {
    if (!address) return;
    try {
      updateScore({
        address: CONTRACT_ADDRESSES.CREDIT_PASSPORT as `0x${string}`,
        abi: CREDIT_PASSPORT_ABI,
        functionName: 'updateScore',
        args: [address, BigInt(Math.min(850, Math.max(300, score + 5)))],
      });
      toast.success('Score update transaction submitted');
    } catch (err) {
      toast.error('Failed to submit update');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Score refreshed!');
  };

  const sidebarItems = [
    { key: 'dashboard' as const, icon: BarChart3, label: 'Dashboard', disabled: false },
    { key: 'passport' as const, icon: User, label: 'My Passport', disabled: false },
    { key: 'polymarket' as const, icon: BarChart3, label: 'Polymarket', disabled: false },
    { key: 'governance' as const, icon: Settings, label: 'Governance', disabled: true },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to access the dashboard</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Toaster position="top-right" />
      
      <div className="flex pt-20">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900/50 backdrop-blur-lg border-r border-purple-500/20 p-4 lg:p-6 sticky top-20 h-[calc(100vh-5rem)]`}
        >
          <div className="flex items-center justify-between mb-4">
            {!collapsed && (
              <span className="text-sm text-gray-400">Menu</span>
            )}
            <button
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-700 hover:border-purple-500/40 hover:text-purple-400 transition"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.div
                key={item.key}
                whileHover={{ scale: item.disabled ? 1 : 1.02 }}
                whileTap={{ scale: item.disabled ? 1 : 0.98 }}
              >
                <button
                  disabled={item.disabled}
                  onClick={() => !item.disabled && setActiveTab(item.key)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.key
                      ? 'bg-purple-500/20 text-purple-400'
                      : item.disabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span>{item.label}</span>}
                  {item.disabled && !collapsed && (
                    <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded">Soon</span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back, {formatAddress(address || '')}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Credit Passport Card */}
                <div>
                  <CreditPassportCard
                    address={address || ''}
                    score={score}
                    lastUpdated={lastUpdated}
                    isLoading={isReading}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdateScore}
                        disabled={isWriting || isConfirming}
                        aria-disabled={isWriting || isConfirming}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isWriting || isConfirming ? (
                          <span className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </span>
                        ) : (
                          'Update My Score (Test)'
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRefresh}
                        disabled={isReading}
                        aria-disabled={isReading}
                        className="w-full bg-gray-800/50 text-white px-6 py-3 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition-all duration-300 disabled:opacity-50"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <RefreshCw className={`w-4 h-4 ${isReading ? 'animate-spin' : ''}`} />
                          <span>Refresh Score</span>
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Bridge Panel */}
                  <BridgePanel />

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Credit Insights</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Score Change</span>
                        <span className="text-green-400">+25 this week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Update</span>
                        <span className="text-gray-300">In 7 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wallet Age</span>
                        <span className="text-gray-300">2.3 years</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'passport' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">My Passport</h1>
                  <p className="text-gray-400">Address: {formatAddress(address || '')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRefresh}
                    disabled={isReading}
                    aria-disabled={isReading}
                    className="bg-gray-800/50 text-white px-4 py-2 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition-all duration-300 disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <RefreshCw className={`w-4 h-4 ${isReading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateScore}
                    disabled={isWriting || isConfirming}
                    aria-disabled={isWriting || isConfirming}
                    className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                  >
                    {isWriting || isConfirming ? 'Updating...' : 'Update Score (Test)'}
                  </motion.button>
                </div>
              </div>

              <CreditPassportCard
                address={address || ''}
                score={score}
                lastUpdated={lastUpdated}
                isLoading={isReading}
              />
            </motion.div>
          )}
          {activeTab === 'polymarket' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Polymarket</h1>
                <p className="text-gray-400">Discover markets and view recent trades</p>
              </div>
              <PolymarketPanel />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};