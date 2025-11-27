import React from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreditScoreGauge } from '../components/dashboard/CreditScoreGauge';
import { ScoreTrendChart } from '../components/dashboard/ScoreTrendChart';
import { ArrowUpRight, ShieldCheck, Activity, Wallet, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { creditScore, isConnected, connectWallet } = useStore();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
          <Wallet className="w-10 h-10 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Connect Your Wallet</h2>
        <p className="text-text-secondary max-w-md mb-8">
          Connect your wallet to view your decentralized credit score, manage assets, and access premium DeFi rates.
        </p>
        <Button onClick={connectWallet} className="!px-8 !py-4 text-lg">
          Connect Wallet to Begin
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Score Card */}
        <Card className="flex-1 min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-bg-secondary/80 to-bg-primary/50">
           <div className="absolute top-6 right-6">
             <Button variant="ghost" className="!p-2">
               <RefreshCw size={18} />
             </Button>
           </div>
           <CreditScoreGauge score={creditScore.current} />
           <div className="mt-8 grid grid-cols-2 gap-8 text-center w-full max-w-sm">
             <div>
               <p className="text-text-tertiary text-xs uppercase mb-1">Weekly Change</p>
               <p className="text-success font-mono font-medium flex items-center justify-center gap-1">
                 <ArrowUpRight size={14} /> +12 pts
               </p>
             </div>
             <div>
               <p className="text-text-tertiary text-xs uppercase mb-1">Next Update</p>
               <p className="text-white font-mono font-medium">4 Days</p>
             </div>
           </div>
        </Card>

        {/* Right Column: Stats & Actions */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Card hover className="p-4 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Utilization</p>
                <p className="text-xl font-bold font-mono">{creditScore.factors.utilization}</p>
              </div>
            </Card>
            <Card hover className="p-4 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Risk Level</p>
                <p className="text-xl font-bold font-mono text-white">{creditScore.factors.liquidationRisk}</p>
              </div>
            </Card>
          </div>

          <Card className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Score Trend</h3>
              <select className="bg-bg-tertiary border border-white/5 rounded-lg text-xs px-2 py-1 text-text-secondary outline-none">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <ScoreTrendChart data={creditScore.trend} />
          </Card>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <ArrowLeftRight size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-white">Bridge Assets</h4>
              <p className="text-xs text-text-tertiary">PoS ↔ zkEVM</p>
            </div>
          </div>
          <Link to="/bridge">
             <Button variant="secondary" className="!px-4 !py-2">Start</Button>
          </Link>
        </Card>

        <Card hover className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-white">Link Wallet</h4>
              <p className="text-xs text-text-tertiary">Boost score</p>
            </div>
          </div>
          <Link to="/wallets">
            <Button variant="secondary" className="!px-4 !py-2">Manage</Button>
          </Link>
        </Card>

        <Card hover className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-white">Passport</h4>
              <p className="text-xs text-text-tertiary">NFT Identity</p>
            </div>
          </div>
          <Link to="/passport">
            <Button variant="secondary" className="!px-4 !py-2">View</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};