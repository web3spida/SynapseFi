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
- **Network**: Polygon zkEVM Cardona Testnet
- **Libraries**: OpenZeppelin Contracts

## 📋 Prerequisites

- Node.js (v16 or higher)
- MetaMask or compatible wallet
- Polygon zkEVM Cardona Testnet configuration

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
POLYGON_ZKEVM_RPC_URL=https://rpc.cardona.zkevm-rpc.com
ETHERSCAN_API_KEY=your_etherscan_api_key
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

## 🎯 Contract Addresses (Polygon zkEVM Testnet)

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

### Contracts
- `npm run compile` - Compile contracts
- `npm run deploy` - Deploy to Polygon zkEVM Testnet
- `npm run verify` - Verify contracts on block explorer

## 🌐 Network Configuration

**Polygon zkEVM Cardona Testnet**
- Chain ID: 2442
- RPC URL: https://rpc.cardona.zkevm-rpc.com
- Explorer: https://cardona-zkevm.polygonscan.com

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