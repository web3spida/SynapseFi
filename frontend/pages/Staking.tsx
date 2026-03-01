import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Coins, TrendingUp, ArrowRight, Percent } from 'lucide-react';

export const Staking: React.FC = () => {
  const { isConnected } = useStore();

  const stakingPools = [
    {
      id: 1,
      name: 'RWA Liquidity Pool',
      apy: 12.5,
      tvl: 5400000,
      staked: 0,
      rewardToken: 'SYN',
    },
    {
      id: 2,
      name: 'Real Estate Index',
      apy: 8.2,
      tvl: 2100000,
      staked: 0,
      rewardToken: 'USDC',
    },
    {
      id: 3,
      name: 'Treasury Yield Plus',
      apy: 5.8,
      tvl: 12500000,
      staked: 0,
      rewardToken: 'USDC',
    },
  ];

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
          <Coins className="w-10 h-10 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white">Connect Wallet to Stake</h2>
        <p className="text-text-secondary max-w-md mb-8">
          Stake your assets to earn additional yield from protocol revenue and incentives.
        </p>
        <div className="flex justify-center">
          <ConnectButton label="Connect Wallet" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Staking & Yield</h1>
          <p className="text-text-secondary">Earn passive income on your RWA holdings.</p>
        </div>
        <div className="flex gap-4">
            <Card className="px-6 py-3 bg-purple-500/10 border-purple-500/20 hidden sm:block">
              <p className="text-xs text-purple-300 uppercase font-semibold">Total Value Locked</p>
              <p className="text-xl font-bold text-white">$20.0M</p>
           </Card>
        </div>
      </div>

      <div className="grid gap-6">
        {stakingPools.map((pool) => (
          <Card key={pool.id} className="p-6 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-white font-bold text-xl border border-white/5 group-hover:scale-110 transition-transform">
                  <Coins size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{pool.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-text-tertiary mt-1">
                    <span className="flex items-center gap-1"><TrendingUp size={14} className="text-success" /> TVL: ${(pool.tvl / 1000000).toFixed(1)}M</span>
                    <span className="flex items-center gap-1"><Percent size={14} className="text-purple-400" /> Rewards in {pool.rewardToken}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-xs text-text-tertiary uppercase mb-1">APY</p>
                  <p className="text-2xl font-bold text-success">{pool.apy}%</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-text-tertiary uppercase mb-1">Your Stake</p>
                  <p className="text-xl font-bold text-white">${pool.staked}</p>
                </div>
                <Button className="md:w-32">Stake</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6 bg-gradient-to-br from-bg-secondary to-bg-primary">
          <h3 className="font-bold text-lg text-white mb-4">Why Stake with SynapseFi?</h3>
          <ul className="space-y-3">
            {[
              'Institutional-grade security and audits',
              'Real-time yield accrual from RWAs',
              'Governance rights for protocol decisions',
              'Compound your earnings automatically'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-text-secondary">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                  <ArrowRight size={12} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center bg-purple-900/10 border-purple-500/10">
          <h3 className="font-bold text-lg text-white mb-2">Need help getting started?</h3>
          <p className="text-text-secondary mb-6 max-w-xs">
            Check our documentation to learn more about RWA staking mechanics and risks.
          </p>
          <Button variant="outline" onClick={() => window.location.hash = '#/docs'}>
            Read Documentation
          </Button>
        </Card>
      </div>
    </div>
  );
};
