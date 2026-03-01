import React from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Vote, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export const Governance: React.FC = () => {
  const { rwaAssets, userRole, approveAsset, rejectAsset } = useStore();

  const proposals = rwaAssets.filter(a => a.status === 'Pending Approval');
  const activeProposals = proposals.length;
  const passedProposals = rwaAssets.filter(a => a.status === 'Active').length;
  const rejectedProposals = rwaAssets.filter(a => a.status === 'Rejected').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Governance</h1>
          <p className="text-text-secondary">Vote on asset proposals and protocol updates.</p>
        </div>
        <div className="flex gap-4">
           {userRole === 'Admin' && (
             <div className="px-4 py-2 bg-purple-500/20 rounded-lg text-purple-400 font-semibold text-sm">
               Admin Mode Active
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center gap-3 mb-2 text-yellow-400">
            <Clock size={24} />
            <h3 className="font-semibold">Active Proposals</h3>
          </div>
          <p className="text-3xl font-bold text-white">{activeProposals}</p>
        </Card>
        <Card className="p-6 border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-3 mb-2 text-green-400">
            <CheckCircle size={24} />
            <h3 className="font-semibold">Passed</h3>
          </div>
          <p className="text-3xl font-bold text-white">{passedProposals}</p>
        </Card>
        <Card className="p-6 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 mb-2 text-red-400">
            <XCircle size={24} />
            <h3 className="font-semibold">Rejected</h3>
          </div>
          <p className="text-3xl font-bold text-white">{rejectedProposals}</p>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Latest Proposals</h2>
      
      {proposals.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-text-tertiary">
            <Vote size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Active Proposals</h3>
          <p className="text-text-secondary max-w-sm">
            There are currently no proposals waiting for approval.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {proposals.map((asset) => (
            <Card key={asset.id} className="p-6">
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                      Pending Approval
                    </span>
                    <span className="text-xs text-text-tertiary">ID: {asset.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{asset.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary mb-4 max-w-md">
                    <div>
                      <span className="block text-text-tertiary text-xs uppercase">Type</span>
                      {asset.type}
                    </div>
                    <div>
                      <span className="block text-text-tertiary text-xs uppercase">Target APY</span>
                      {asset.apy}%
                    </div>
                    <div>
                      <span className="block text-text-tertiary text-xs uppercase">Risk</span>
                      {asset.risk}
                    </div>
                    <div>
                      <span className="block text-text-tertiary text-xs uppercase">Maturity</span>
                      {asset.maturity}
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {asset.description || 'No description provided for this asset proposal.'}
                  </p>
                </div>

                <div className="flex flex-col justify-center gap-3 min-w-[200px]">
                  {userRole === 'Admin' ? (
                    <>
                      <Button onClick={() => approveAsset(asset.id)} className="w-full bg-green-600 hover:bg-green-700">
                        Approve Asset
                      </Button>
                      <Button onClick={() => rejectAsset(asset.id)} variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
                        Reject Asset
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-lg text-center">
                      <p className="text-sm text-text-secondary mb-2">Voting requires governance tokens</p>
                      <Button variant="ghost" disabled className="w-full opacity-50 cursor-not-allowed">
                        Vote (Coming Soon)
                      </Button>
                    </div>
                  )}
                  <Button variant="ghost" className="w-full text-sm">
                    <FileText size={14} className="mr-2" /> View Documents
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
