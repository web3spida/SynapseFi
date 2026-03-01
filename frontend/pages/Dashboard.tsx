import React from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowUpRight, Activity, Wallet, PieChart, Coins, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { isConnected, portfolio, rwaAssets } = useStore();

  const totalPortfolioValue = portfolio.reduce((acc, item) => acc + item.amount, 0);
  const totalAssets = rwaAssets.filter(a => a.status === 'Active').length;
  const totalTVL = rwaAssets.reduce((acc, a) => acc + a.tvl, 0);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fadeIn">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)]">
          <Wallet className="w-10 h-10 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white">Welcome to SynapseFi</h2>
        <p className="text-text-secondary max-w-md mb-8">
          The premier marketplace for tokenized real-world assets. Connect your wallet to start investing.
        </p>
        <div className="flex justify-center">
            <ConnectButton label="Connect Wallet to Start" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
          <p className="text-text-secondary">Track your performance and market trends.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => window.location.hash = '#/portfolio'}>
            <PieChart size={16} /> Portfolio
          </Button>
          <Button className="gap-2" onClick={() => window.location.hash = '#/marketplace'}>
            <Coins size={16} /> Invest
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-bg-primary border-purple-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-purple-400">
              <Wallet size={24} />
              <h3 className="font-semibold">My Portfolio</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">${totalPortfolioValue.toLocaleString()}</p>
            <p className="text-sm text-success flex items-center gap-1">
              <ArrowUpRight size={14} /> +0.0% (24h)
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-900/10 to-bg-primary border-blue-500/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
           <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Activity size={24} />
              <h3 className="font-semibold">Protocol TVL</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">${(totalTVL / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-success flex items-center gap-1">
              <ArrowUpRight size={14} /> +5.2% (7d)
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-900/10 to-bg-primary border-green-500/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
           <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-green-400">
              <TrendingUp size={24} />
              <h3 className="font-semibold">Avg. Yield</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">8.4%</p>
            <p className="text-sm text-text-tertiary">
              Across {totalAssets} active assets
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity / Featured */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-white">Featured Assets</h3>
            <Link to="/marketplace" className="text-sm text-purple-400 hover:text-purple-300">View All</Link>
          </div>
          
          <div className="space-y-4">
            {rwaAssets.slice(0, 3).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => window.location.hash = '#/marketplace'}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center font-bold text-gray-400">
                    {asset.type.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{asset.name}</h4>
                    <p className="text-xs text-text-tertiary">{asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success text-sm">{asset.apy}% APY</p>
                  <p className="text-xs text-text-tertiary">Target</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-full bg-gradient-to-br from-bg-secondary to-bg-primary/50">
          <h3 className="font-bold text-lg text-white mb-4">Market Insights</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Treasury yields hold steady</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Short-term T-Bill rates remain attractive as inflation data suggests a "higher for longer" environment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Real Estate tokenization grows</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Volume for on-chain real estate has increased by 15% this quarter, driven by commercial properties.
                </p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">New Private Credit pools</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  We've onboarded 2 new credit originators focusing on emerging market fintech lending.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
