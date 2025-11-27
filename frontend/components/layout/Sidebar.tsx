
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, ExternalLink, HelpCircle } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../constants';

export const Sidebar: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard size={20} />,
    Wallet: <Wallet size={20} />,
    ArrowLeftRight: <ArrowLeftRight size={20} />,
    CreditCard: <CreditCard size={20} />,
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-secondary/30 backdrop-blur-md border-r border-white/5 hidden md:flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg shadow-purple-500/50">
              <path d="M20 4L5 12.6603V29.9808L20 38.641L35 29.9808V12.6603L20 4Z" fill="url(#logo_gradient)" stroke="#7C3AED" strokeWidth="1.5"/>
              <path d="M20 14L27 18M20 14L13 18M20 14V23" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="14" r="2.5" fill="#F9FAFB"/>
              <circle cx="13" cy="18" r="2.5" fill="#F9FAFB"/>
              <circle cx="27" cy="18" r="2.5" fill="#F9FAFB"/>
              <circle cx="20" cy="23" r="2.5" fill="#F9FAFB"/>
              <defs>
                <linearGradient id="logo_gradient" x1="20" y1="4" x2="20" y2="38.641" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5B21B6"/>
                  <stop offset="1" stopColor="#1E1B4B" stopOpacity="0.8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
            SynapseFi
          </h1>
        </div>

        <nav className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
                }
              `}
            >
              {iconMap[item.icon]}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-bg-primary border border-purple-500/10">
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <HelpCircle size={16} />
            <span className="text-sm font-semibold">Need Help?</span>
          </div>
          <p className="text-xs text-text-tertiary mb-3">Check our documentation for guides.</p>
          <Link to="/docs" className="text-xs text-white hover:underline flex items-center gap-1 transition-colors">
            Read Docs <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </aside>
  );
};
