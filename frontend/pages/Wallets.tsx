import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Link as LinkIcon, Trash2, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { LinkWalletModal } from '../components/wallet/LinkWalletModal';

export const Wallets: React.FC = () => {
  const { wallets, unlinkWallet, refreshWalletScore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const handleRefresh = async (address: string) => {
    setRefreshingId(address);
    await refreshWalletScore(address);
    setRefreshingId(null);
  };

  const handleUnlink = (address: string) => {
    if (confirm('Are you sure you want to unlink this wallet? This may lower your credit score.')) {
        unlinkWallet(address);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet Management</h1>
          <p className="text-text-secondary">Link multiple addresses to aggregate your credit history.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Link New Wallet
        </Button>
      </div>

      <div className="grid gap-6">
        {wallets.map((wallet, idx) => (
          <Card key={idx} className={`p-0 overflow-hidden ${wallet.isPrimary ? 'border-purple-500/50 shadow-purple-500/10' : ''}`}>
             <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${wallet.isPrimary ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40' : 'bg-bg-tertiary text-text-secondary'}`}>
                        {wallet.isPrimary ? <CheckCircle2 size={24} /> : <LinkIcon size={24} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-mono font-bold text-white tracking-wide">
                                {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                            </h3>
                            {wallet.isPrimary && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                                    Primary
                                </span>
                            )}
                        </div>
                        <p className="text-text-tertiary text-sm mt-1">Linked on {wallet.linkedDate}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 bg-bg-tertiary/30 p-4 md:p-0 md:bg-transparent rounded-lg">
                    <div className="text-right">
                        <p className="text-xs text-text-tertiary uppercase mb-1">Contribution</p>
                        <div className="flex items-center justify-end gap-2">
                            <p className="text-xl font-bold text-white">{wallet.score} pts</p>
                            <button 
                                onClick={() => handleRefresh(wallet.address)}
                                disabled={!!refreshingId}
                                className={`p-1 hover:bg-white/5 rounded-full text-text-tertiary hover:text-white transition-colors ${refreshingId === wallet.address ? 'animate-spin text-purple-400' : ''}`}
                                title="Refresh Score"
                            >
                                <RefreshCw size={14} />
                            </button>
                        </div>
                    </div>
                    
                    {!wallet.isPrimary && (
                        <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                    )}

                    {!wallet.isPrimary && (
                        <button 
                            onClick={() => handleUnlink(wallet.address)}
                            className="p-2 hover:bg-red-500/10 text-text-tertiary hover:text-red-500 rounded-lg transition-colors group"
                            title="Unlink Wallet"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
             </div>
             {wallet.isPrimary && (
                 <div className="bg-purple-500/5 border-t border-purple-500/10 p-3 text-center text-xs text-purple-300 font-medium">
                     This wallet controls your Credit Passport settings
                 </div>
             )}
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-900/10 to-purple-900/10 border-blue-500/10">
          <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-blue-500/10 rounded-lg text-blue-400 h-fit">
                  <CheckCircle2 size={20} />
              </div>
              <div>
                  <h4 className="text-white font-semibold mb-1">Why link wallets?</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                      By linking multiple Polygon addresses, SynapseFi can scan a broader history of your on-chain activity. This typically results in a higher credit score by demonstrating more liquidity and transaction history.
                  </p>
              </div>
          </div>
      </Card>

      <LinkWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};