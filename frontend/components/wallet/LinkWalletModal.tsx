import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { useAccount, useSignMessage } from 'wagmi';
import { verifyMessage } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkWalletModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { linkWallet } = useStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { address: connected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleSignAndLink = async () => {
    if (!address.startsWith('0x') || address.length !== 42) {
      setError('Invalid Ethereum address format');
      return;
    }
    if (!connected || connected.toLowerCase() !== address.toLowerCase()) {
      setError('Please connect the wallet you want to link');
      return;
    }
    setError('');
    setStep(2);
    setIsLoading(true);

    try {
      const message = `Link address ${address} to SynapseFi at ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message, account: connected as `0x${string}` });
      const valid = await verifyMessage({ address: address as `0x${string}`, message, signature });
      if (!valid) throw new Error('Signature verification failed');
      await linkWallet(address);
      setIsLoading(false);
      setStep(3);
    } catch (e) {
      setIsLoading(false);
      setError('Failed to verify ownership. Please try again.');
      setStep(1);
    }
  };

  const reset = () => {
      setStep(1);
      setAddress('');
      setError('');
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={reset}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-[#15151E] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        <button onClick={reset} className="absolute right-4 top-4 text-gray-400 hover:text-white">
            <X size={20} />
        </button>

        <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Link New Wallet</h2>
            <p className="text-sm text-gray-400">Add another address to boost your credit score.</p>
        </div>

        <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-text-tertiary">Connect the wallet to link</div>
                      <ConnectButton chainStatus="none" showBalance={false} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Wallet Address</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <input 
                                type="text"
                                placeholder="0x..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-xs text-purple-200">
                        You will be asked to sign a message to verify ownership of this wallet. This action does not cost gas.
                    </div>
                    <Button fullWidth onClick={handleSignAndLink}>
                        Verify & Link
                    </Button>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center justify-center py-8 space-y-4"
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Wallet size={24} className="text-purple-400" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-white">Verifying Ownership</h3>
                        <p className="text-sm text-gray-400 mt-1">Please sign the request in your wallet...</p>
                    </div>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center justify-center py-4 space-y-4"
                >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                        <CheckCircle2 size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">Wallet Linked!</h3>
                        <p className="text-sm text-gray-400 mt-1">Your credit score has been updated.</p>
                    </div>
                    <Button fullWidth onClick={reset} variant="secondary">
                        Back to Wallets
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
