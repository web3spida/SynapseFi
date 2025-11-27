import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowDown, ArrowRight, Settings2, History, ChevronDown, Fuel, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKENS } from '../constants';

export const Bridge: React.FC = () => {
  const { executeBridge, bridgeLoading, transactions, balances } = useStore();
  const [amount, setAmount] = useState('');
  const [fromChain, setFromChain] = useState('Polygon PoS');
  const [toChain, setToChain] = useState('Polygon zkEVM');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  
  // Gas Estimation State
  const [gasFee, setGasFee] = useState<{ eth: string; usd: string } | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  // Validation
  const currentBalance = parseFloat(balances[selectedToken.symbol] || '0');
  const hasInsufficientBalance = parseFloat(amount || '0') > currentBalance;

  // Simulate Gas Estimation when amount or token changes
  useEffect(() => {
    if (!amount) {
      setGasFee(null);
      return;
    }
    
    setIsEstimating(true);
    const timer = setTimeout(() => {
      // Mock calculation based on token type
      const baseFee = 0.002;
      const randomFluctuation = Math.random() * 0.001;
      const estimated = (baseFee + randomFluctuation).toFixed(4);
      
      setGasFee({
        eth: estimated,
        usd: (parseFloat(estimated) * 0.85).toFixed(4) // Mock MATIC price of ~0.85
      });
      setIsEstimating(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [amount, selectedToken]);

  const handleSwap = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  const handleBridge = async () => {
    if (!amount || hasInsufficientBalance) return;
    await executeBridge(amount, selectedToken.symbol);
    setAmount('');
  };

  const handleMax = () => {
    setAmount(balances[selectedToken.symbol] || '0');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Bridge Assets</h1>
        <button className="p-2 hover:bg-bg-tertiary rounded-full text-text-secondary transition-colors">
            <History size={20} />
        </button>
      </div>

      <Card className="p-6 mb-8 relative overflow-visible shadow-2xl shadow-black/40 border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              Bridge Route
            </span>
            <button className="text-text-tertiary hover:text-white transition-colors">
                <Settings2 size={16} />
            </button>
        </div>

        <div className="space-y-2 relative">
            {/* From Input */}
            <div className="bg-bg-tertiary/50 rounded-2xl p-4 border border-white/5 hover:border-purple-500/30 transition-all focus-within:border-purple-500/50">
                <div className="flex justify-between mb-3">
                    <span className="text-xs font-medium text-text-tertiary">From {fromChain}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-tertiary">Balance: {balances[selectedToken.symbol]}</span>
                      <button 
                        onClick={handleMax}
                        className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded hover:bg-purple-500/20 transition-colors"
                      >
                        MAX
                      </button>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                     {/* Token Selector Trigger */}
                     <div className="relative">
                       <button 
                          onClick={() => setShowTokenSelect(!showTokenSelect)}
                          className="flex items-center gap-2 bg-bg-secondary hover:bg-white/5 rounded-xl px-3 py-2 border border-white/10 transition-colors"
                       >
                           <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold">
                             {selectedToken.symbol[0]}
                           </div>
                           <span className="font-semibold text-white">{selectedToken.symbol}</span>
                           <ChevronDown size={14} className="text-text-tertiary" />
                       </button>

                       {/* Dropdown Menu */}
                       <AnimatePresence>
                         {showTokenSelect && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 10 }}
                             className="absolute top-full left-0 mt-2 w-48 bg-bg-secondary border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                           >
                             {TOKENS.map(token => (
                               <button
                                 key={token.symbol}
                                 onClick={() => {
                                   setSelectedToken(token);
                                   setShowTokenSelect(false);
                                 }}
                                 className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 transition-colors"
                               >
                                  <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center text-[10px]">
                                    {token.symbol[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-white">{token.symbol}</div>
                                    <div className="text-xs text-text-tertiary">{token.name}</div>
                                  </div>
                               </button>
                             ))}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>

                     <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-transparent text-right text-3xl font-bold text-white w-full outline-none placeholder-white/10"
                        disabled={bridgeLoading}
                     />
                </div>
            </div>

            {/* Swap Button */}
            <div className="relative h-2 flex items-center justify-center z-10">
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSwap}
                    className="absolute w-8 h-8 bg-bg-primary border border-white/10 rounded-lg flex items-center justify-center text-purple-400 shadow-lg hover:border-purple-500/50 hover:text-purple-300 transition-colors"
                >
                    <ArrowDown size={16} />
                </motion.button>
            </div>

            {/* To Input (ReadOnly) */}
            <div className="bg-bg-tertiary/30 rounded-2xl p-4 border border-white/5 pt-6">
                <div className="flex justify-between mb-3">
                    <span className="text-xs font-medium text-text-tertiary">To {toChain}</span>
                    <span className="text-xs text-text-tertiary">You will receive</span>
                </div>
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 px-2">
                         <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-300">
                             {selectedToken.symbol[0]}
                         </div>
                         <span className="font-medium text-text-secondary">{selectedToken.symbol}</span>
                     </div>
                     <div className="text-right text-2xl font-bold text-text-tertiary/80">
                        {amount || '0.00'}
                     </div>
                </div>
            </div>
        </div>

        {/* Gas Estimation & Info */}
        <div className="mt-6 p-4 rounded-xl bg-bg-primary/50 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Fuel size={14} className="text-purple-400" />
                  <span>Estimated Gas Fee</span>
                </div>
                <div className="font-mono text-white">
                  {isEstimating ? (
                    <span className="flex items-center gap-2 text-text-tertiary">
                      <Loader2 size={12} className="animate-spin" /> Calculating...
                    </span>
                  ) : gasFee ? (
                    <span className="flex items-center gap-2">
                      {gasFee.eth} MATIC <span className="text-text-tertiary text-xs">(${gasFee.usd})</span>
                    </span>
                  ) : (
                    <span className="text-text-tertiary">--</span>
                  )}
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Info size={14} className="text-blue-400" />
                  <span>Bridge Time</span>
                </div>
                <span className="text-success font-medium">~15 mins</span>
            </div>
        </div>

        {/* Error Message */}
        {hasInsufficientBalance && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-medium"
          >
            Insufficient {selectedToken.symbol} balance
          </motion.div>
        )}

        <Button 
            fullWidth 
            className="mt-6 py-4 text-lg shadow-lg shadow-purple-900/20" 
            onClick={handleBridge}
            loading={bridgeLoading}
            disabled={!amount || hasInsufficientBalance || bridgeLoading}
        >
            {bridgeLoading ? 'Confirming Transaction...' : 'Bridge Assets Now'}
        </Button>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider pl-1">Recent Activity</h3>
        <div className="space-y-3">
            {transactions.filter(t => t.type === 'Bridge').map((tx) => (
                <Card key={tx.id} className="p-4 flex items-center justify-between !bg-bg-secondary/40 hover:!bg-bg-secondary/60 transition-colors border-l-2 border-l-purple-500">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-purple-400 border border-white/5">
                            <ArrowRight size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white">{tx.amount} {tx.token}</p>
                              {tx.status === 'Success' && <span className="w-1.5 h-1.5 rounded-full bg-success"></span>}
                            </div>
                            <p className="text-xs text-text-tertiary font-mono mt-0.5">{tx.from} → {tx.to}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <a href="#" className="flex items-center justify-end gap-1 text-[10px] text-purple-400 hover:text-purple-300 mb-1">
                          View Explorer <Settings2 size={10} />
                        </a>
                        <p className="text-[10px] text-text-tertiary">{tx.timestamp}</p>
                    </div>
                </Card>
            ))}
            {transactions.filter(t => t.type === 'Bridge').length === 0 && (
              <div className="text-center py-8 text-text-tertiary text-sm bg-bg-secondary/20 rounded-xl border border-dashed border-white/5">
                No recent transactions
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
