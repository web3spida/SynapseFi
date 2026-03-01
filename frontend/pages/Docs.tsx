
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Book, Shield, Zap, TrendingUp, Landmark, Scale, FileText, ChevronRight, Info, Building, Banknote, Briefcase } from 'lucide-react';

type DocSection = 'intro' | 'assets' | 'process' | 'legal';

export const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('intro');

  const menuItems = [
    { id: 'intro', label: 'Introduction', icon: Book },
    { id: 'assets', label: 'Asset Classes', icon: Building },
    { id: 'process', label: 'Investment Process', icon: TrendingUp },
    { id: 'legal', label: 'Legal & Compliance', icon: Scale },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Introduction to SynapseFi RWA</h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                SynapseFi is a premier decentralized platform for tokenized Real World Assets (RWAs). 
                We bridge the gap between traditional finance and DeFi by bringing high-quality, institutional-grade assets on-chain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent border-purple-500/20">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="text-purple-400" size={20} />
                  Secure & Compliant
                </h3>
                <p className="text-sm text-text-secondary">
                  Fully regulated environment with KYC/AML integration and legal recourse for all asset classes.
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-blue-900/10 to-transparent border-blue-500/20">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="text-blue-400" size={20} />
                  Instant Liquidity
                </h3>
                <p className="text-sm text-text-secondary">
                  Trade asset tokens 24/7 on our secondary market or use them as collateral in DeFi protocols.
                </p>
              </Card>
            </div>

            <div className="bg-bg-tertiary/50 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-3">Why Tokenize RWAs?</h3>
              <ul className="space-y-3">
                {[
                  "Fractional ownership of high-value assets",
                  "Automated yield distribution via smart contracts",
                  "Transparent provenance and audit trails",
                  "Reduced intermediaries and settlement times"
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

      case 'assets':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Supported Asset Classes</h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Our platform supports a diverse range of asset classes, allowing investors to build a balanced and resilient portfolio.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: "Real Estate", icon: Building, desc: "Commercial and residential properties generating rental yield." },
                    { title: "Private Credit", icon: Banknote, desc: "Short-term loans to established businesses with collateral backing." },
                    { title: "Government Bonds", icon: Landmark, desc: "Tokenized US Treasury Bills and other sovereign debt." },
                    { title: "Private Equity", icon: Briefcase, desc: "Shares in pre-IPO companies and growth-stage startups." }
                ].map((asset, i) => (
                    <Card key={i} className="p-6 hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <asset.icon size={24} className="text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{asset.title}</h3>
                        </div>
                        <p className="text-text-secondary text-sm">{asset.desc}</p>
                    </Card>
                ))}
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-100">
                  <span className="font-bold">Diversification Strategy:</span> Combining low-risk Bonds with high-yield Private Credit can optimize your risk-adjusted returns.
                </div>
              </div>
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Investment Process</h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                Investing in RWAs on SynapseFi is streamlined and secure. Follow these steps to start building your portfolio.
              </p>
            </div>

            <div className="space-y-0 relative border-l border-purple-500/30 ml-3">
              {[
                { title: "Complete KYC/KYB", desc: "Verify your identity or business entity to comply with regulations." },
                { title: "Connect Wallet", desc: "Link your Web3 wallet (MetaMask, WalletConnect) to the platform." },
                { title: "Browse Marketplace", desc: "Explore available assets, review documents, and analyze yields." },
                { title: "Invest USDC", desc: "Select an asset and invest USDC. Smart contracts mint asset tokens to your wallet." },
                { title: "Earn & Track", desc: "Receive yield distributions automatically and track performance in your Portfolio." }
              ].map((step, i) => (
                <div key={i} className="pl-8 pb-8 relative">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                  <h4 className="font-bold text-white text-lg mb-1">{step.title}</h4>
                  <p className="text-text-secondary text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Legal & Compliance</h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                We utilize a robust legal framework to ensure that on-chain tokens represent legally enforceable ownership rights in the real world.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">The SPV Structure</h3>
              <p className="text-text-secondary">
                  Each asset or pool of assets is held by a Special Purpose Vehicle (SPV). The SPV issues tokens that represent shares or debt instruments of that entity.
              </p>
              
              <div className="grid gap-4 mt-6">
                 {[
                     { title: "Bankruptcy Remote", desc: "Assets are isolated from SynapseFi's corporate balance sheet." },
                     { title: "Legal Recourse", desc: "Token holders have legal rights to the underlying assets." },
                     { title: "Regular Audits", desc: "Third-party firms audit both the smart contracts and the off-chain assets." }
                 ].map((item, i) => (
                     <div key={i} className="flex items-start gap-4 p-4 bg-bg-primary rounded-lg border border-white/5">
                         <Scale className="text-green-400 shrink-0 mt-1" size={20} />
                         <div>
                             <h4 className="font-bold text-white">{item.title}</h4>
                             <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                         </div>
                     </div>
                 ))}
              </div>
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
