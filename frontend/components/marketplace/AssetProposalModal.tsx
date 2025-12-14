import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/useStore';
import { X, Upload, FileText, Check } from 'lucide-react';

interface AssetProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetProposalModal: React.FC<AssetProposalModalProps> = ({ isOpen, onClose }) => {
  const { submitAssetProposal } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Real Estate' as const,
    apy: '',
    minInvestment: '',
    risk: 'Low' as const,
    maturity: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAssetProposal({
      name: formData.name,
      type: formData.type,
      apy: Number(formData.apy),
      minInvestment: Number(formData.minInvestment),
      risk: formData.risk,
      maturity: formData.maturity,
      description: formData.description,
      documents: ['valuation_report.pdf', 'legal_opinion.pdf'], // Mock documents
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-6 relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-tertiary hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-2">Submit Asset Proposal</h2>
        <p className="text-text-secondary text-sm mb-6">
          Propose a new real-world asset for tokenization. This will be reviewed by an admin before going live.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Asset Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-bg-tertiary border border-white/5 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none"
              placeholder="e.g. Brooklyn Commercial Lofts"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Asset Type</label>
              <select 
                className="w-full bg-bg-tertiary border border-white/5 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="Real Estate">Real Estate</option>
                <option value="Bond">Bond</option>
                <option value="Private Credit">Private Credit</option>
                <option value="Equity">Equity</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Risk Profile</label>
              <select 
                className="w-full bg-bg-tertiary border border-white/5 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none"
                value={formData.risk}
                onChange={e => setFormData({...formData, risk: e.target.value as any})}
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Expected APY (%)</label>
              <input 
                type="number" 
                step="0.1"
                required
                className="w-full bg-bg-tertiary border border-white/5 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none"
                placeholder="8.5"
                value={formData.apy}
                onChange={e => setFormData({...formData, apy: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Min Investment ($)</label>
              <input 
                type="number" 
                required
                className="w-full bg-bg-tertiary border border-white/5 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none"
                placeholder="5000"
                value={formData.minInvestment}
                onChange={e => setFormData({...formData, minInvestment: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Maturity Period</label>
            <input 
              type="text" 
              required
              className="w-full bg-bg-tertiary border border-white/5 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none"
              placeholder="e.g. 5 Years"
              value={formData.maturity}
              onChange={e => setFormData({...formData, maturity: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-xs font-medium text-text-secondary mb-2">Supporting Documents</label>
             <div className="border-2 border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/30 transition-colors">
                <Upload size={24} className="text-text-tertiary mb-2" />
                <p className="text-xs text-text-secondary">Click to upload Valuation Report & Ownership Proof</p>
                <p className="text-[10px] text-text-tertiary mt-1">(Mock upload for demo)</p>
             </div>
             <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-xs text-green-400">
                    <Check size={12} />
                    <span>valuation_report.pdf</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-400">
                    <Check size={12} />
                    <span>legal_opinion.pdf</span>
                </div>
             </div>
          </div>

          <div className="pt-4">
            <Button fullWidth type="submit">Submit Proposal</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
