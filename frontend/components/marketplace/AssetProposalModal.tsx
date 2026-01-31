import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/useStore';
import { X, Upload, Check } from 'lucide-react';
import { RWAAsset } from '../../types';

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
  const [selectedDocuments, setSelectedDocuments] = useState<NonNullable<RWAAsset['documents']>>([]);
  const [fileError, setFileError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILES = 5;
  const MAX_SIZE_MB = 10;
  const MAX_FILE_SIZE = MAX_SIZE_MB * 1024 * 1024;

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const uploadDocument = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const payload = {
      name: file.name,
      mime: file.type || 'application/octet-stream',
      size: file.size,
      dataUrl,
    };
    try {
      const res = await fetch('/.netlify/functions/asset-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        return {
          name: json.name || file.name,
          url: json.url || dataUrl,
          mime: json.mime || payload.mime,
          size: Number(json.size || file.size),
        };
      }
    } catch {}
    return {
      name: payload.name,
      url: payload.dataUrl,
      mime: payload.mime,
      size: payload.size,
    };
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setFileError('');
    const incoming = Array.from(files);
    const remainingSlots = Math.max(0, MAX_FILES - selectedDocuments.length);
    if (remainingSlots === 0) {
      setFileError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }
    const usable = incoming.slice(0, remainingSlots);
    if (incoming.length > usable.length) {
      setFileError(`Only ${MAX_FILES} files allowed. Extra files were ignored.`);
    }
    const invalid: string[] = [];
    const valid = usable.filter((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImage = file.type.startsWith('image/');
      if (!isPdf && !isImage) {
        invalid.push(`${file.name}: unsupported type`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        invalid.push(`${file.name}: exceeds ${MAX_SIZE_MB}MB`);
        return false;
      }
      return true;
    });
    if (invalid.length) {
      setFileError(invalid.slice(0, 3).join(' • '));
    }
    if (!valid.length) return;
    setIsUploading(true);
    try {
      const uploaded = await Promise.all(valid.map(uploadDocument));
      setSelectedDocuments((prev) => [...prev, ...uploaded].slice(0, MAX_FILES));
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      setFileError('Upload in progress. Please wait.');
      return;
    }
    submitAssetProposal({
      name: formData.name,
      type: formData.type,
      apy: Number(formData.apy),
      minInvestment: Number(formData.minInvestment),
      risk: formData.risk,
      maturity: formData.maturity,
      description: formData.description,
      documents: selectedDocuments.length ? selectedDocuments : undefined,
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
            <label className="border-2 border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/30 transition-colors">
              <Upload size={24} className="text-text-tertiary mb-2" />
              <p className="text-xs text-text-secondary">Click to upload Valuation Report & Ownership Proof</p>
              <p className="text-[10px] text-text-tertiary mt-1">PDF or image files, up to 5 files, 10MB each</p>
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
            {!!fileError && (
              <div className="mt-2 text-[11px] text-red-400">{fileError}</div>
            )}
            {!!selectedDocuments.length && (
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                {selectedDocuments.map((file) => (
                  <div key={file.name + file.size} className="flex items-center gap-2 text-xs text-green-400">
                    <Check size={12} />
                    <span className="truncate">{file.name}</span>
                    <span className="text-[10px] text-text-tertiary">{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button fullWidth type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Submit Proposal'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
