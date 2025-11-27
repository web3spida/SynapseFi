
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Book, Shield, Zap, ArrowLeftRight, CreditCard, ChevronRight, Info } from 'lucide-react';

type DocSection = 'intro' | 'score' | 'passport' | 'bridge';

export const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('intro');

  const menuItems = [
    { id: 'intro', label: 'Introduction', icon: Book },
    { id: 'score', label: 'Credit Scoring Model', icon: Zap },
    { id: 'passport', label: 'Credit Passport NFT', icon: Shield },
    { id: 'bridge', label: 'Cross-Chain Bridge', icon: ArrowLeftRight },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Introduction to SynapseFi</h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                SynapseFi is a decentralized credit intelligence platform built on the Polygon network. 
                We aggregate on-chain data across multiple wallets to generate a comprehensive credit score, 
                enabling users to access under-collateralized loans and premium DeFi rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent border-purple-500/20">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="text-purple-400" size={20} />
                  Privacy First
                </h3>
                <p className="text-sm text-text-secondary">
                  Your data never leaves the chain. We use Zero-Knowledge proofs to verify creditworthiness without exposing transaction details.
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-blue-900/10 to-transparent border-blue-500/20">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <ArrowLeftRight className="text-blue-400" size={20} />
                  Multi-Chain
                </h3>
                <p className="text-sm text-text-secondary">
                  Native support for Polygon PoS and zkEVM, with seamless bridging and unified scoring across networks.
                </p>
              </Card>
            </div>

            <div className="bg-bg-tertiary/50 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-3">Core Features</h3>
              <ul className="space-y-3">
                {[
                  "Multi-wallet identity aggregation",
                  "Real-time credit scoring updates",
                  "Soulbound NFT Passport (SBT)",
                  "Gas-efficient bridging infrastructure"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'score':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">The Credit Scoring Model</h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Your SynapseFi score (0-850) is calculated dynamically based on your on-chain behavior. 
                We analyze four key dimensions to determine your creditworthiness.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-bg-secondary/50 rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4">Scoring Factors</h3>
                <div className="space-y-6">
                  {[
                    { title: "Wallet Age & Activity (35%)", desc: "Duration of active usage and frequency of transactions over time." },
                    { title: "Liquidity & Assets (30%)", desc: "Average daily balance across stablecoins and blue-chip assets." },
                    { title: "DeFi Interaction (20%)", desc: "History of loan repayments and interactions with trusted protocols (Aave, Uniswap)." },
                    { title: "Liquidation History (15%)", desc: "Frequency of liquidations. Fewer liquidations result in a higher score." }
                  ].map((factor, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="text-2xl font-bold text-purple-500/50">0{i + 1}</div>
                      <div>
                        <h4 className="font-bold text-white">{factor.title}</h4>
                        <p className="text-sm text-text-secondary mt-1">{factor.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-100">
                  <span className="font-bold">Pro Tip:</span> Linking multiple wallets helps build a more complete profile, often resulting in a score increase of 20-50 points.
                </div>
              </div>
            </div>
          </div>
        );

      case 'passport':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Credit Passport NFT</h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                The SynapseFi Passport is a Soulbound Token (SBT) that acts as your portable on-chain identity. 
                It stores your credit metadata and allows third-party dApps to verify your reputation without re-calculating it.
              </p>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Passport Tiers</h3>
              <div className="grid gap-4">
                {[
                  { tier: "Gold", score: "750+", perk: "Zero-collateral loans up to $5k" },
                  { tier: "Silver", score: "650-749", perk: "50% LTV reduction on Aave" },
                  { tier: "Bronze", score: "0-649", perk: "Standard DeFi access" }
                ].map((t) => (
                  <div key={t.tier} className="flex items-center justify-between p-4 bg-bg-primary rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <CreditCard className={
                        t.tier === 'Gold' ? 'text-yellow-400' : 
                        t.tier === 'Silver' ? 'text-gray-300' : 'text-orange-700'
                      } />
                      <div>
                        <span className="font-bold text-white">{t.tier}</span>
                        <span className="text-xs text-text-tertiary ml-2">({t.score})</span>
                      </div>
                    </div>
                    <span className="text-sm text-text-secondary">{t.perk}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'bridge':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Cross-Chain Bridge</h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                Our bridge utilizes the official Polygon LxLy infrastructure to move assets securely between Polygon PoS and Polygon zkEVM.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">How to Bridge</h3>
              <div className="space-y-0 relative border-l border-purple-500/30 ml-3">
                {[
                  "Select the source and destination chains.",
                  "Choose the asset (USDC, MATIC, WETH) and amount.",
                  "Approve the token spend allowance (1st transaction).",
                  "Confirm the deposit transaction (2nd transaction).",
                  "Wait ~15-20 mins for the zk-proof finality."
                ].map((step, i) => (
                  <div key={i} className="pl-8 pb-8 relative">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                    <h4 className="font-bold text-white text-sm mb-1">Step {i + 1}</h4>
                    <p className="text-text-secondary text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-black rounded-xl border border-white/10 font-mono text-sm overflow-x-auto">
              <div className="text-gray-500 mb-2">// Example: Checking Bridge Status via SDK</div>
              <div className="text-purple-400">const<span className="text-white"> status </span>=<span className="text-blue-400"> await</span><span className="text-white"> bridge.</span><span className="text-yellow-300">getStatus</span><span className="text-white">({'{'}</span></div>
              <div className="pl-4 text-white">txHash: <span className="text-green-400">'0x123...abc'</span>,</div>
              <div className="pl-4 text-white">network: <span className="text-green-400">'zkEVM'</span></div>
              <div className="text-white">{'}'});</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto min-h-[80vh]">
      {/* Sidebar Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-2">
          <p className="px-4 text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Documentation</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as DocSection)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {activeSection === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div 
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-w-0"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};
