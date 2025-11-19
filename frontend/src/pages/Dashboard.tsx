import { useState } from 'react';
import type { FC } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { formatAddress } from '../utils/constants';
import { Settings, BarChart3, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { BridgePanel } from '../components/BridgePanel';
import { PolymarketPanel } from '../components/PolymarketPanel';

export const Dashboard: FC = () => {
  const { address, isConnected } = useAccount();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'governance' | 'polymarket'>('polymarket');

  const sidebarItems = [
    { key: 'polymarket' as const, icon: BarChart3, label: 'Polymarket', disabled: false },
    { key: 'dashboard' as const, icon: BarChart3, label: 'Dashboard', disabled: false },
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
                <h1 className="text-4xl font-bold text-white mb-2">Prediction Dashboard</h1>
                <p className="text-gray-400">Welcome back, {formatAddress(address || '')}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <p className="text-sm text-gray-400 mb-4">Bridge funds and then trade on Polymarket.</p>
                    <BridgePanel />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'polymarket' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <PolymarketPanel />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};