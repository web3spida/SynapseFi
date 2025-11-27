
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Wallets } from './pages/Wallets';
import { Bridge } from './pages/Bridge';
import { Passport } from './pages/Passport';
import { Docs } from './pages/Docs';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/passport" element={<Passport />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
