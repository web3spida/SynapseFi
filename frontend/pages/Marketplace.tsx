import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, TrendingUp, ShieldCheck, PieChart, Info, ArrowUpRight, Plus, UserCog, Check, X, FileText } from 'lucide-react';
import { RWAAsset } from '../types';
import { AssetProposalModal } from '../components/marketplace/AssetProposalModal';

export const Marketplace: React.FC = () => {
  const { rwaAssets, userRole, setUserRole, approveAsset, rejectAsset, updateAssetPrice, rwaOnchainPrices, loadOnchainRwaPrices } = useStore();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadOnchainRwaPrices();
  }, [loadOnchainRwaPrices]);

  // Filter logic based on role and status
  const filteredAssets = rwaAssets.filter(asset => {
    const matchesFilter = filter === 'All' || asset.type === filter;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    
    // User sees Active and Coming Soon
    // Admin sees everything including Pending and Drafts
    // Proposer sees their own drafts/pending? (Simplified for now: Admin sees pending, User sees Active)
    
    let matchesStatus = false;
    if (userRole === 'Admin') {
       matchesStatus = true; // Admin sees all
    } else {
       matchesStatus = asset.status === 'Active' || asset.status === 'Coming Soon';
    }

    if (filter === 'Pending Approval' && userRole === 'Admin') {
        return asset.status === 'Pending Approval';
    }

    return matchesFilter && matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Active': return 'text-green-400 bg-green-500/10 border-green-500/20';
          case 'Pending Approval': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
          case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
          default: return 'text-text-tertiary bg-white/5 border-white/10';
      }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <AssetProposalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">RWA Marketplace</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <UserCog size={14} className={userRole === 'Admin' ? 'text-purple-400' : 'text-text-tertiary'} />
                <button 
                    onClick={() => setUserRole(userRole === 'Admin' ? 'User' : 'Admin')}
                    className="text-xs font-medium hover:text-white transition-colors"
                >
                    View as: <span className={userRole === 'Admin' ? 'text-purple-400' : 'text-white'}>{userRole}</span>
                </button>
            </div>
          </div>
          <p className="text-text-secondary">Access institutional-grade real world assets on-chain.</p>
        </div>
        
        <div className="flex gap-4">
           {userRole === 'User' && (
               <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                   <Plus size={18} />
                   Propose Asset
               </Button>
           )}
           <Card className="px-6 py-3 bg-purple-500/10 border-purple-500/20 hidden sm:block">
              <p className="text-xs text-purple-300 uppercase font-semibold">Total TVL</p>
              <p className="text-xl font-bold text-white">$30.1M</p>
           </Card>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-tertiary border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-text-tertiary focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Bond', 'Real Estate', 'Private Credit', 'Equity', ...(userRole === 'Admin' ? ['Pending Approval'] : [])].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === type
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-bg-tertiary text-text-secondary hover:bg-white/5 hover:text-white border border-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const displayedApy = rwaOnchainPrices[asset.id] ?? asset.apy;
          return (
          <Card key={asset.id} hover className="flex flex-col h-full group relative overflow-hidden">
            {/* Admin Status Badge */}
            {userRole === 'Admin' && (
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold border-b border-l rounded-bl-xl ${getStatusColor(asset.status)}`}>
                    {asset.status}
                </div>
            )}

            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-purple-500/30 transition-colors">
                  {asset.type === 'Real Estate' && <TrendingUp size={24} className="text-blue-400" />}
                  {asset.type === 'Bond' && <ShieldCheck size={24} className="text-green-400" />}
                  {asset.type === 'Private Credit' && <PieChart size={24} className="text-purple-400" />}
                  {asset.type === 'Equity' && <ArrowUpRight size={24} className="text-orange-400" />}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  asset.risk === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  asset.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {asset.risk} Risk
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{asset.name}</h3>
              <p className="text-text-tertiary text-sm mb-6">{asset.type}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-primary/50 p-3 rounded-lg border border-white/5">
                  <p className="text-text-tertiary text-xs mb-1">Target APY</p>
                  <p className="text-green-400 font-bold text-lg">
                    {userRole === 'Admin' && asset.status === 'Active' ? (
                      <div className="flex items-center gap-2">
                        {displayedApy}%
                        <button className="text-text-tertiary hover:text-white" title="Update Price">
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    ) : (
                      `${displayedApy}%`
                    )}
                  </p>
                </div>
                <div className="bg-bg-primary/50 p-3 rounded-lg border border-white/5">
                  <p className="text-text-tertiary text-xs mb-1">Maturity</p>
                  <p className="text-white font-bold text-lg">{asset.maturity}</p>
                </div>
                <div className="bg-bg-primary/50 p-3 rounded-lg border border-white/5">
                  <p className="text-text-tertiary text-xs mb-1">Min Investment</p>
                  <p className="text-white font-medium">{formatCurrency(asset.minInvestment)}</p>
                </div>
                <div className="bg-bg-primary/50 p-3 rounded-lg border border-white/5">
                  <p className="text-text-tertiary text-xs mb-1">TVL</p>
                  <p className="text-white font-medium">{formatCurrency(asset.tvl)}</p>
                </div>
              </div>

              {/* Status or Progress Bar */}
              {asset.status === 'Coming Soon' || asset.status === 'Pending Approval' ? (
                 <div className="flex items-center gap-2 text-text-tertiary text-sm bg-white/5 p-2 rounded-lg justify-center">
                    <Info size={16} />
                    {asset.status === 'Pending Approval' ? 'Awaiting Admin Review' : 'Coming Soon'}
                 </div>
              ) : (
                  <>
                    <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-text-tertiary mb-4">
                        <span>65% Filled</span>
                        <span>{formatCurrency(asset.tvl)} / {formatCurrency(asset.tvl * 1.5)}</span>
                    </div>
                  </>
              )}
              
              {/* Documents Section for Admin */}
              {userRole === 'Admin' && asset.documents && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-xs text-text-secondary mb-2">Attached Documents:</p>
                      <div className="flex flex-wrap gap-2">
                          {asset.documents.map((doc, i) => (
                              <div key={i} className="flex items-center gap-1 text-[10px] bg-bg-primary px-2 py-1 rounded border border-white/5 text-purple-300">
                                  <FileText size={10} />
                                  {doc}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            <div className="p-6 pt-0 mt-auto">
              {userRole === 'Admin' && asset.status === 'Pending Approval' ? (
                  <div className="flex gap-2">
                      <Button 
                        fullWidth 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => approveAsset(asset.id)}
                      >
                        <Check size={16} className="mr-2" /> Approve
                      </Button>
                      <Button 
                        fullWidth 
                        variant="secondary"
                        className="hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => rejectAsset(asset.id)}
                      >
                        <X size={16} className="mr-2" /> Reject
                      </Button>
                  </div>
              ) : (
                  <Button 
                    fullWidth 
                    variant={asset.status === 'Coming Soon' || asset.status === 'Pending Approval' ? 'secondary' : 'primary'}
                    disabled={asset.status === 'Coming Soon' || asset.status === 'Pending Approval'}
                  >
                    {asset.status === 'Coming Soon' ? 'Notify Me' : 
                     asset.status === 'Pending Approval' ? 'Under Review' : 'Invest Now'}
                  </Button>
              )}
            </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
};
