import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Wagmi & RainbowKit imports would go here in a real environment
// import { WagmiProvider } from 'wagmi';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { config } from './lib/wagmi';

// For this demo generation, we are using a robust mock store (zustand) 
// to ensure the UI is fully functional and interactive without requiring 
// valid RPC keys or local node setup.

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* 
      In a real app, wrap with:
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider> 
    */}
    <App />
  </React.StrictMode>
);