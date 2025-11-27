import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';

export const Header: React.FC<{ toggleMobileMenu: () => void }> = ({ toggleMobileMenu }) => {
  const { isConnected, isConnecting, connectWallet, disconnectWallet, wallets } = useStore();
  const primaryWallet = wallets.find(w => w.isPrimary);

  return (
    <header className="sticky top-0 z-40 w-full h-20 border-b border-white/5 bg-bg-primary/80 backdrop-blur-md">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleMobileMenu} className="p-2 text-text-secondary">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">SynapseFi</span>
        </div>

        <div className="hidden md:flex items-center bg-bg-secondary/50 rounded-full px-4 py-2 border border-white/5 w-96">
          <Search size={18} className="text-text-tertiary mr-3" />
          <input 
            type="text" 
            placeholder="Search transactions, wallets..." 
            className="bg-transparent border-none outline-none text-sm text-text-primary w-full placeholder-text-tertiary"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-xs font-medium text-purple-300">Polygon Amoy</span>
          </div>

          <button className="p-2 rounded-full hover:bg-white/5 text-text-secondary relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-primary"></span>
          </button>

          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">
                  {primaryWallet?.address}
                </div>
                <div className="text-xs text-text-tertiary">Connected</div>
              </div>
              <Button variant="secondary" onClick={disconnectWallet} className="!py-2 !px-4">
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              loading={isConnecting}
              className="!py-2"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};