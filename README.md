# SynapseFi - AI-Powered Credit Intelligence Network

A premium DeFi application that provides AI-powered on-chain credit scoring and risk intelligence on Polygon zkEVM.

## 🚀 Features

- **AI-Powered Credit Scoring**: Advanced algorithms analyze on-chain behavior to generate accurate credit scores
- **Zero-Knowledge Security**: Built on Polygon zkEVM for maximum privacy and security
- **Premium UI/UX**: Futuristic black and purple design with smooth animations
- **Direct Contract Interaction**: Frontend directly interacts with smart contracts using wagmi and RainbowKit
- **Real-time Score Updates**: Live credit score tracking with visual representations

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + Vite + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Blockchain**: wagmi + viem + RainbowKit
- **Animations**: Framer Motion with custom CSS animations
- **Icons**: Lucide React

### Smart Contracts
- **Language**: Solidity ^0.8.20
- **Framework**: Hardhat
- **Network**: Polygon Amoy Testnet (PoS)
- **Libraries**: OpenZeppelin Contracts

## 📋 Prerequisites

- Node.js (v16 or higher)
- MetaMask or compatible wallet
- Polygon Amoy Testnet configuration

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd synapsefi
```

### 2. Smart Contract Setup

```bash
cd contracts
npm install
```

Create `.env` file based on `.env.example`:
```env
PRIVATE_KEY=your_private_key
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

Deploy contracts:
```bash
npm run deploy
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Update contract addresses in `src/utils/constants.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  CREDIT_PASSPORT: 'your_deployed_credit_passport_address',
  SYNAPSE_TOKEN: 'your_deployed_token_address',
} as const;
```

Start development server:
```bash
npm run dev
```

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **View Dashboard**: Navigate to see your credit score and passport
3. **Update Score**: Use "Update My Score" button for testing
4. **Monitor Changes**: Real-time updates with visual feedback

## 🎯 Contract Addresses (Polygon Amoy Testnet)

*Note: Replace with your actual deployed addresses*

- **CreditPassport**: `0x1234567890123456789012345678901234567890`
- **SynapseToken**: `0x0987654321098765432109876543210987654321`

## 🎨 Design System

- **Primary Color**: Deep Purple (#7B2CBF)
- **Background**: Black (#000000)
- **Text**: White (#FFFFFF)
- **Typography**: Poppins (headings) + Inter (body)
- **Effects**: Glassmorphism, gradient borders, glow effects

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📦 Phase 2 Updates

- Realized P&L in Portfolio: FIFO calculator (`src/lib/pnl.ts`) with fills sourcing.
- Live Fills Wiring: Authenticated CLOB fetch (`src/lib/fills.ts`), graceful fallback to local.
- Strategy Studio Enhancements: Risk‑aware basket sizing using ERC1155 balances and an exposure overlay.
- Shareable Prediction Cards: Client‑side snapshot via `html-to-image` and deep‑link sharing; Open Graph/Twitter meta tags in `frontend/index.html`.

### Polymarket Integration Details
- Environment variables:
  - `VITE_POLYMARKET_GAMMA_API` (default: `https://gamma-api.polymarket.com`)
  - `VITE_POLYMARKET_DATA_API` (default: `https://data-api.polymarket.com`)
  - `VITE_POLYMARKET_CLOB_API` (default: `https://clob.polymarket.com`)
- CLOB Auth: Use the Polymarket tab’s “CLOB Authentication” to derive API key/passphrase (EIP‑712 signature on Polygon). Credentials are cached in localStorage.
- Fills: `fetchUserFills(address, tokenId?)` attempts authenticated endpoints on `VITE_POLYMARKET_CLOB_API` and falls back to local fills cache when unavailable.

### Added Files/Changes
- `frontend/src/lib/pnl.ts`: FIFO realized P&L and mark‑to‑market utils.
- `frontend/src/lib/fills.ts`: Local fills persistence and authenticated remote fetch.
- `frontend/src/components/PortfolioView.tsx`: Displays unrealized/realized P&L per outcome and totals.
- `frontend/src/components/StrategyStudio.tsx`: Risk‑aware sizing and exposure overlay.
- `frontend/src/components/PredictionCard.tsx`: Snapshot download and “Share to X” deep‑link.
- `frontend/index.html`: Social meta tags for rich previews.

## 🧭 Roadmap (Next Phases)

### Phase 3
- Replace fallback with fully verified CLOB fills endpoint usage; add pagination and date ranges.
- Persist cost basis adjustments and reconcile with fills to handle partials, fees, and shorts.
- Strategy insights: display exposure vs. target weighting; suggest rebalancing trades.
- Negative‑risk baskets: improve selection heuristics and size distribution with constraints.
- Sharing: optional server‑side image rendering for stable social previews; add market slugs in deep‑links.

### Phase 4
- Backtesting and P&L analytics: per‑market and portfolio‑level charts; session export.
- Performance: code‑split large vendor bundles and reduce initial payload; memoize heavy hooks.
- Testing: unit tests for P&L math and fills mapping; integration tests for UI flows.
- Monitoring: basic telemetry and error reporting in dev with opt‑in.

### Contracts
- `npm run compile` - Compile contracts
- `npm run deploy` - Deploy to Polygon Amoy Testnet
- `npm run verify` - Verify contracts on block explorer

## 🌐 Network Configuration

**Polygon Amoy Testnet (PoS)**
- Chain ID: 80002
- RPC URL: https://rpc-amoy.polygon.technology
- Explorer: https://amoy.polygonscan.com

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Polygon Labs for zkEVM infrastructure
- OpenZeppelin for secure contract libraries
- RainbowKit for seamless wallet integration
- Buildathon organizers and community

---

**Built with ❤️ for the Polygon Buildathon**