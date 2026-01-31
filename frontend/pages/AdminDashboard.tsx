import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, X, Edit, Trash2, Search, Filter, AlertCircle, FileText, ArrowUpRight, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { rwaAssets, approveAsset, rejectAsset, updateAssetPrice } = useStore();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  const filteredAssets = rwaAssets.filter(asset => {
    const matchesFilter = filter === 'All' || asset.status === filter;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdatePrice = (id: string) => {
    if (newPrice) {
      updateAssetPrice(id, Number(newPrice));
      setEditingPriceId(null);
      setNewPrice('');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Active': return 'text-green-400 bg-green-500/10 border-green-500/20';
        case 'Pending Approval': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
        case 'Draft': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        default: return 'text-text-tertiary bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Console</h1>
          <p className="text-text-secondary">Manage assets, approvals, and official price feeds.</p>
        </div>
        <div className="flex gap-4">
           <Card className="px-6 py-3 bg-yellow-500/10 border-yellow-500/20">
              <p className="text-xs text-yellow-300 uppercase font-semibold">Pending Review</p>
              <p className="text-xl font-bold text-white">
                {rwaAssets.filter(a => a.status === 'Pending Approval').length}
              </p>
           </Card>
           <Card className="px-6 py-3 bg-green-500/10 border-green-500/20">
              <p className="text-xs text-green-300 uppercase font-semibold">Active Assets</p>
              <p className="text-xl font-bold text-white">
                {rwaAssets.filter(a => a.status === 'Active').length}
              </p>
           </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-tertiary border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-text-tertiary focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
           {['All', 'Pending Approval', 'Active', 'Rejected'].map((status) => (
             <button
               key={status}
               onClick={() => setFilter(status)}
               className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                 filter === status
                   ? 'bg-purple-600 text-white'
                   : 'bg-bg-tertiary text-text-secondary hover:bg-white/5'
               }`}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      <Card className="overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase text-text-tertiary">
                <th className="p-4 font-semibold">Asset Name</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Documents</th>
                <th className="p-4 font-semibold">APY / Price</th>
                <th className="p-4 font-semibold">TVL</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-tertiary">
                    No assets found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">{asset.name}</div>
                        <div className="text-xs text-text-tertiary">ID: {asset.id}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">{asset.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-text-secondary align-top">
                      {asset.documents && asset.documents.length > 0 ? (
                        <div className="flex flex-col gap-1 max-w-xs">
                          {asset.documents.map((doc, index) => (
                            doc.url ? (
                              <a
                                key={`${doc.name}-${index}`}
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                                download={doc.name}
                                className="flex items-center gap-2 hover:text-white transition-colors"
                              >
                                <FileText size={14} className="text-text-tertiary shrink-0" />
                                <span className="truncate">{doc.name}</span>
                              </a>
                            ) : (
                              <div key={`${doc.name}-${index}`} className="flex items-center gap-2 text-text-secondary">
                                <FileText size={14} className="text-text-tertiary shrink-0" />
                                <span className="truncate">{doc.name}</span>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-text-tertiary italic">No documents</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingPriceId === asset.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            className="w-16 bg-bg-primary border border-white/10 rounded px-2 py-1 text-sm text-white"
                            placeholder={String(asset.apy)}
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            autoFocus
                          />
                          <button onClick={() => handleUpdatePrice(asset.id)} className="text-green-400 hover:text-green-300">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditingPriceId(null)} className="text-red-400 hover:text-red-300">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-white font-mono">
                          {asset.apy}%
                          {asset.status === 'Active' && (
                             <button 
                                onClick={() => { setEditingPriceId(asset.id); setNewPrice(String(asset.apy)); }}
                                className="text-text-tertiary hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <Edit size={14} />
                             </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-text-secondary font-mono">
                      ${(asset.tvl / 1000000).toFixed(1)}M
                    </td>
                    <td className="p-4 text-right">
                      {asset.status === 'Pending Approval' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            className="!px-3 bg-green-600 hover:bg-green-700 h-8"
                            onClick={() => approveAsset(asset.id)}
                          >
                            <Check size={14} className="mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="!px-3 h-8 hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => rejectAsset(asset.id)}
                          >
                            <X size={14} className="mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                      {asset.status === 'Active' && (
                         <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="secondary" className="h-8">
                               Manage
                            </Button>
                         </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
