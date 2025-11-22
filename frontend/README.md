# Web3 SkillChain Passport - Frontend

A decentralized credential management system built on blockchain technology with Zero-Knowledge Proof (ZKP) capabilities for secure, verifiable academic credentials.

## 🎯 Project Overview

Web3 SkillChain Passport enables:
- **Students**: Store and manage verifiable credentials in a digital wallet
- **Issuers**: Issue tamper-proof academic credentials on-chain
- **Verifiers**: Verify credential authenticity with selective disclosure via ZKP

## 🏗️ Architecture

This frontend is designed to integrate with:
- **Smart Contracts** (`/contracts`): Blockchain credential management
- **Backend API** (`/backend`): IPFS storage and encryption services
- **ZKP Module** (`/zkp`): Privado ID SDK for zero-knowledge proofs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Access to backend API endpoints
- Deployed smart contracts with ABIs

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Configure your environment variables (if needed):
```bash
# Backend API endpoints
VITE_API_URL=http://localhost:3000
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud

# Blockchain network
VITE_CHAIN_ID=80001
VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
```

## 📁 Frontend Structure

```
frontend/src/
├── pages/
│   ├── Index.tsx              # Landing page with overview
│   ├── StudentWallet.tsx      # Student credential dashboard
│   ├── IssuerPage.tsx         # Credential issuance interface
│   └── VerifierPage.tsx       # Credential verification portal
├── components/
│   ├── Navbar.tsx             # Navigation bar
│   └── WalletConnect.tsx      # Web3 wallet integration
└── utils/
    ├── contract.ts            # Smart contract interactions
    ├── decrypt.ts             # IPFS decryption utilities
    └── privadoHelper.ts       # ZKP proof generation/verification
```

## 🔗 Integration Points

### 1. Smart Contract Integration (`utils/contract.ts`)

Replace mock implementations with actual contract calls:

```typescript
import CredentialManagerABI from '../../../contracts/abis/CredentialManager.json';
import { ethers } from 'ethers';

export const CONTRACT_ADDRESSES = {
  CREDENTIAL_MANAGER: "0xYourDeployedAddress",
  ISSUER_REGISTRY: "0xYourDeployedAddress",
  REVOCATION_REGISTRY: "0xYourDeployedAddress",
};

// Implement getContract() with ethers.js
// Implement issueCredential() to call smart contract
// Implement verifyCredential() to read from blockchain
```

### 2. Backend API Integration

Connect to backend endpoints:

```typescript
// In IssuerPage.tsx - credential issuance
POST /upload
{
  "file": <encrypted-document>,
  "metadata": { "title", "type", "issuerAddress" }
}

// In StudentWallet.tsx - fetch credentials
GET /credentials/:walletAddress

// In VerifierPage.tsx - verify credential
POST /verify
{
  "credentialId": "...",
  "ipfsHash": "..."
}
```

### 3. ZKP Integration (`utils/privadoHelper.ts`)

Implement Privado ID SDK:

```typescript
import { PrivadoID } from '@privado-id/sdk';

// Setup Privado ID
// Generate selective disclosure proofs
// Verify ZK proofs on-chain
```

## 🎨 Key Features

### Student Wallet
- View all owned credentials
- Filter by type (Degree, Certificate, License)
- Generate ZK proofs for selective disclosure
- Share credentials via QR code

### Issuer Dashboard
- Issue new credentials on-chain
- Upload and encrypt documents to IPFS
- Track issued credentials
- Manage issuer profile

### Verifier Portal
- Verify credential authenticity
- View credential details from blockchain
- Support for ZKP verification
- Scan QR codes for quick verification

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for state management
- **Lucide React** for icons

## 🔐 Security Features

- Client-side encryption for sensitive data
- Zero-Knowledge Proofs for selective disclosure
- Wallet-based authentication
- Tamper-proof blockchain storage
- IPFS content addressing

## 📝 Development Workflow

1. **Connect Wallet**: Users must connect MetaMask to interact
2. **Contract ABIs**: Import from `contracts/abis/` after deployment
3. **API Integration**: Point to backend service endpoints
4. **ZKP Setup**: Configure Privado ID credentials and schemas

## 🧪 Testing Integration

```bash
# Test with local blockchain (Hardhat/Ganache)
# Update CONTRACT_ADDRESSES in contract.ts

# Test with backend API
# Ensure backend is running on localhost:3000

# Test ZKP generation
# Configure Privado ID test environment
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to hosting (Vercel, Netlify, etc.)
npm run deploy
```

## 🤝 Integration Checklist

- [ ] Import smart contract ABIs from `contracts/abis/`
- [ ] Update `CONTRACT_ADDRESSES` with deployed addresses
- [ ] Connect to backend API endpoints
- [ ] Implement Web3 provider (ethers.js/web3.js)
- [ ] Configure Privado ID SDK
- [ ] Add ZKP circuit integration
- [ ] Test credential issuance flow
- [ ] Test credential verification flow
- [ ] Test ZKP selective disclosure

## 📚 Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Privado ID Docs](https://docs.privado.id/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [IPFS Documentation](https://docs.ipfs.tech/)

## 🎓 Team Members

- **Member 1**: Smart Contracts
- **Member 2**: ZKP Circuits
- **Member 3**: Backend API
- **Member 4**: Frontend (This Module)
- **Member 5**: Documentation & Demo

## 📄 License

This project is part of an academic demonstration.

---

**Ready for Integration**: This frontend is fully prepared to connect with smart contracts, backend services, and ZKP modules. Follow the integration checklist to complete the full-stack implementation.
