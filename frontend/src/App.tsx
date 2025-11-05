import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'
import './styles/globals.css'
import './styles/animations.css'

import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { polygonAmoy, polygon } from './utils/chains'
import { Docs } from './pages/Docs'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NotFound } from './pages/NotFound'

const projectId = import.meta.env.VITE_WC_PROJECT_ID as string | undefined

const config = getDefaultConfig({
  appName: 'SynapseFi',
  projectId: projectId || '00000000000000000000000000000000',
  chains: [polygonAmoy, polygon],
  ssr: false,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#8B5CF6',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
        >
          <Router>
            <ErrorBoundary>
              <div className="min-h-screen bg-black text-white">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </ErrorBoundary>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default App