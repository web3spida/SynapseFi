import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Fingerprint, Share2, Shield, Calendar, Award, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const Passport: React.FC = () => {
  const { hasPassport, isMinting, mintPassport, creditScore, wallets, updatePassportMetadata } = useStore();
  const primaryWallet = wallets.find(w => w.isPrimary);
  
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleShare = () => {
    const text = `Check out my SynapseFi Credit Passport! Score: ${creditScore.current}/850. #DeFi #Polygon`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateMetadata = async () => {
    setIsUpdating(true);
    await updatePassportMetadata();
    setIsUpdating(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        
        {/* NFT Card Visualization */}
        <div className="flex-1 w-full max-w-md perspective-1000">
          <motion.div 
            initial={{ rotateY: 0 }}
            whileHover={{ rotateY: 5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-white/10 group"
          >
            {/* Holographic Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
            
            {/* Glowing Orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                        <span className="font-bold text-xl text-white">S</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-xs font-mono text-purple-200">
                            #{Math.floor(Math.random() * 1000).toString().padStart(4, '0')}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                         <p className="text-purple-300 text-sm font-semibold tracking-widest uppercase mb-1">Credit Score</p>
                         <h2 className="text-6xl font-bold text-white font-mono tracking-tighter">
                            {creditScore.current}
                         </h2>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Owner</p>
                        <p className="font-mono text-sm text-gray-200 truncate border-b border-white/10 pb-2">
                            {primaryWallet?.address}
                        </p>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                            <Shield className="text-purple-400" size={20} />
                            <span className="text-sm font-semibold text-white">Gold Tier</span>
                        </div>
                        <Fingerprint className="text-white/20 w-16 h-16" />
                    </div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Details & Actions */}
        <div className="flex-1 space-y-8 w-full">
            <div>
                <h1 className="text-4xl font-bold text-white mb-4">SynapseFi Passport</h1>
                <p className="text-text-secondary text-lg leading-relaxed">
                    Your on-chain credit identity. Minting this NFT aggregates your credit history across linked wallets and allows you to carry your reputation to any supported dApp.
                </p>
            </div>

            {!hasPassport ? (
                <Card className="p-8 border-purple-500/30 bg-purple-900/10">
                    <h3 className="text-xl font-bold text-white mb-4">Mint Your Passport</h3>
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-text-secondary">
                            <Shield size={18} className="text-purple-400" />
                            <span>Unlock under-collateralized loans</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary">
                            <Award size={18} className="text-purple-400" />
                            <span>Access institutional DeFi pools</span>
                        </div>
                    </div>
                    <Button 
                        fullWidth 
                        className="py-4 text-lg" 
                        onClick={mintPassport}
                        loading={isMinting}
                    >
                        Mint Passport (Free)
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                     <Card className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400">
                                 <Calendar size={20} />
                             </div>
                             <div>
                                 <p className="text-sm font-medium text-white">Minted On</p>
                                 <p className="text-xs text-text-tertiary">Jan 10, 2024</p>
                             </div>
                         </div>
                         <Button variant="ghost" size="sm">View TX</Button>
                     </Card>
                     <div className="flex gap-4">
                         <Button 
                            className="flex-1" 
                            variant="secondary"
                            onClick={handleShare}
                         >
                            {copied ? <Check size={18} className="mr-2 text-green-400" /> : <Share2 size={18} className="mr-2" />}
                            {copied ? "Copied!" : "Share"}
                         </Button>
                         <Button 
                            className="flex-1" 
                            variant="secondary"
                            onClick={handleUpdateMetadata}
                            loading={isUpdating}
                         >
                            {!isUpdating && <RefreshCw size={18} className="mr-2" />}
                            Update Metadata
                         </Button>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};