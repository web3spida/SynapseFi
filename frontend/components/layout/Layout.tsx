import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      <Sidebar />
      
      <div className="md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-bg-secondary border-r border-white/10 p-4">
             {/* Reusing Sidebar content essentially, simplified for mobile */}
             <div className="mb-8">
               <h2 className="text-xl font-bold text-white">SynapseFi</h2>
             </div>
             {/* Navigation items logic would be repeated here or Sidebar component made responsive with props. 
                 For this implementation, assuming Sidebar handles responsive display or we duplicate logic for clarity.
             */}
             <p className="text-text-tertiary text-sm">Menu items...</p>
          </div>
        </div>
      )}
    </div>
  );
};