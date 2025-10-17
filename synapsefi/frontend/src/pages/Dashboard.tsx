import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { CreditPassportCard } from '../components/CreditPassportCard';
import { CREDIT_PASSPORT_ABI } from '../utils/abis';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { formatAddress } from '../utils/constants';
import { RefreshCw, Settings, User, BarChart3 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState<number>(650);
  const [lastUpdated, setLastUpdated] = useState<number>(Math.floor(Date.now() / 1000));
  
  const { data: scoreData, refetch: refetchScore, isLoading: isReading } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_PASSPORT as `0x${string}`,
    abi: CREDIT_PASSPORT_ABI,
    functionName: 'getScore',
    args: address ? [address] : undefined,
    enabled: !!address,
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

  const handleUpdateScore = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const newScore = Math.floor(Math.random() * 300) + 550; // Random score between 550-850
      
      await updateContract({
        address: CONTRACT_ADDRESSES.CREDIT_PASSPORT as `0x${string}`,
        abi: CREDIT_PASSPORT_ABI,
        functionName: 'updateScore',
        args: [address, BigInt(newScore)],
      });
      
      toast.success('Score update submitted!');
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Failed to update score');
    }
  };

  const handleRefresh = () => {
    refetchScore();
    toast.success('Score refreshed!');
  };

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: User, label: 'My Passport', active: false },
    { icon: Settings, label: 'Governance', active: false, disabled: true },
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
          className="w-64 bg-gray-900/50 backdrop-blur-lg border-r border-purple-500/20 p-6"
        >
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: item.disabled ? 1 : 1.02 }}
                whileTap={{ scale: item.disabled ? 1 : 0.98 }}
              >
                <button
                  disabled={item.disabled}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.active
                      ? 'bg-purple-500/20 text-purple-400'
                      : item.disabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded">Soon</span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {formatAddress(address)}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Credit Passport Card */}
              <div>
                <CreditPassportCard
                  address={address}
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
                      className="w-full bg-gray-800/50 text-white px-6 py-3 rounded-xl font-medium border border-gray-700 hover:border-purple-500/40 transition-all duration-300 disabled:opacity-50"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <RefreshCw className={`w-4 h-4 ${isReading ? 'animate-spin' : ''}`} />
                        <span>Refresh Score</span>
                      </span>
                    </motion.button>
                  </div>
                </motion.div>

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
        </main>
      </div>
    </div>
  );
};