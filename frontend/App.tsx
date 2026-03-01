import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useStore } from './store/useStore';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Marketplace } from './pages/Marketplace';
import { Staking } from './pages/Staking';
import { Governance } from './pages/Governance';
import { AdminDashboard } from './pages/AdminDashboard';
import { Docs } from './pages/Docs';

function App() {
  const { address, isConnected } = useAccount();
  const { setWalletStatus } = useStore();

  useEffect(() => {
    setWalletStatus(isConnected, address);
  }, [isConnected, address, setWalletStatus]);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
