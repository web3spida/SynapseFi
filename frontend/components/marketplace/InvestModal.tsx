import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { X, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { RWAAsset } from '../../types';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: RWAAsset | null;
}

export const InvestModal: React.FC<InvestModalProps> = ({ isOpen, onClose, asset }) => {
  const { investInAsset, rwaOnchainPrices } = useStore();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !asset) return null;

  const currentApy = rwaOnchainPrices[asset.id] ?? asset.apy;

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    const investAmount = Number(amount);

    if (isNaN(investAmount) || investAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (investAmount < asset.minInvestment) {
      setError(`Minimum investment is $${asset.minInvestment.toLocaleString()}`);
      return;
    }

    investInAsset(asset.id, investAmount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-tertiary hover:text-white"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Investment Successful!</h2>
            <p className="text-text-secondary">
              You have successfully invested ${Number(amount).toLocaleString()} in {asset.name}.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-1">Invest in {asset.name}</h2>
            <p className="text-text-secondary text-sm mb-6">{asset.type} • {asset.risk} Risk</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-bg-tertiary p-3 rounded-lg border border-white/5">
                <p className="text-text-tertiary text-xs mb-1">Target APY</p>
                <p className="text-green-400 font-bold text-lg">{currentApy}%</p>
              </div>
              <div className="bg-bg-tertiary p-3 rounded-lg border border-white/5">
                <p className="text-text-tertiary text-xs mb-1">Min Investment</p>
                <p className="text-white font-bold text-lg">${asset.minInvestment.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleInvest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Investment Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                  <input 
                    type="number" 
                    required
                    className="w-full bg-bg-tertiary border border-white/5 rounded-lg py-3 pl-10 pr-4 text-white focus:border-purple-500/50 outline-none"
                    placeholder="Enter amount..."
                    value={amount}
                    onChange={e => {
                      setAmount(e.target.value);
                      setError('');
                    }}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
                    <AlertCircle size={12} />
                    {error}
                  </div>
                )}
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-300">Estimated Annual Return</span>
                  <span className="text-white font-medium">
                    ${amount ? ((Number(amount) * currentApy) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                  </span>
                </div>
                <p className="text-[10px] text-purple-300/60">Based on current APY. Returns are not guaranteed.</p>
              </div>

              <Button fullWidth type="submit" className="mt-2">
                Confirm Investment
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};
