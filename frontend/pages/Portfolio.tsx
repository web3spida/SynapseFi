import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PieChart, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const { portfolio, rwaAssets, isConnected } = useStore();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
          <Wallet className="w-10 h-10 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white">Connect Your Wallet</h2>
        <p className="text-text-secondary max-w-md mb-8">
          Connect your wallet to view your portfolio and manage your real world asset investments.
        </p>
        <div className="flex justify-center">
          <ConnectButton label="Connect Wallet to Begin" />
        </div>
      </div>
    );
  }

  const totalValue = portfolio.reduce((acc, item) => acc + item.amount, 0);
  const totalYield = totalValue * 0.08; // Mock 8% yield

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-text-secondary">Manage your RWA holdings and track performance.</p>
        </div>
        <Button className="flex items-center gap-2">
          <TrendingUp size={18} />
          Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-bg-primary border-purple-500/20">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <Wallet size={24} />
            <h3 className="font-semibold">Total Value</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-success flex items-center gap-1">
            <ArrowUpRight size={14} /> +2.4% this week
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <PieChart size={24} />
            <h3 className="font-semibold">Projected Yield</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${totalYield.toLocaleString()}
          </p>
          <p className="text-sm text-text-tertiary">
            Annualized estimation
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 text-green-400">
            <TrendingUp size={24} />
            <h3 className="font-semibold">Active Assets</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {portfolio.length}
          </p>
          <p className="text-sm text-text-tertiary">
            Across {new Set(portfolio.map(p => p.assetId)).size} classes
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Your Holdings</h2>
        {portfolio.length === 0 ? (
           <Card className="p-12 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-text-tertiary">
               <PieChart size={32} />
             </div>
             <h3 className="text-lg font-semibold text-white mb-2">No Assets Found</h3>
             <p className="text-text-secondary max-w-sm mb-6">
               You haven't invested in any real world assets yet. Explore the marketplace to get started.
             </p>
             <Button onClick={() => window.location.hash = '#/marketplace'}>
               Go to Marketplace
             </Button>
           </Card>
        ) : (
          <div className="grid gap-4">
            {portfolio.map((item, idx) => {
              const asset = rwaAssets.find(a => a.id === item.assetId);
              return (
                <Card key={idx} className="p-4 flex items-center justify-between hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl font-bold text-purple-400">
                      {asset?.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{asset?.name || 'Unknown Asset'}</h4>
                      <p className="text-sm text-text-tertiary">Invested on {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${item.amount.toLocaleString()}</p>
                    <p className="text-sm text-success">+{asset?.apy}% APY</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
