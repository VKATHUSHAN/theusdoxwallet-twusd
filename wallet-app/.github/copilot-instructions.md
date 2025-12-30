# USDOX Wallet App - GitHub Copilot Instructions

## 1. PROJECT OVERVIEW

**Type**: Non-custodial EVM wallet application  
**Purpose**: Secure token transfers in USDOX ecosystem  
**Supported Networks**: Ethereum, Base, Sepolia (testnet)  
**Key Tokens**: USDO (18 decimals), TWUSD (6 decimals)

**Core Value Proposition**:

- Client-side key management only (no backend storage)
- MetaMask integration for user convenience
- Multi-network support with extensible architecture
- Non-custodial design ensures users control their assets

---

## 2. ARCHITECTURE OVERVIEW

### Design Layers

```
┌─────────────────────────────────────────┐
│     React Components ("use client")     │
│  (page.tsx, layout.tsx, etc.)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│     USDOXWallet (Public API)            │
│  (Orchestrates wallet operations)       │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┴──────────────┐
    │                            │
┌───▼──────────────────┐  ┌──────▼─────────────────┐
│ BlockchainService    │  │ TokenManager           │
│ • Provider/Signer    │  │ • Balance queries      │
│ • Network mgmt       │  │ • Token transfers      │
│ • Wallet creation    │  │ • ERC-20 interactions  │
└──────────────────────┘  └────────────────────────┘
    │
    └──► ethers.js v6 ──► Blockchain RPC Endpoints
```

### Key Design Principles

1. **Non-custodial Only**: Private keys NEVER leave client-side
2. **Single Responsibility**: Each class has one clear purpose
3. **Extensibility**: New networks/tokens via config objects
4. **Extensibility**: New networks/tokens via config objects
5. **Type Safety**: TypeScript strict mode enforced
6. **Browser Compatibility**: MetaMask detection for user safety
7. **Clean Architecture**: Separation between UI, wallet API, and blockchain operations

**Extensibility Patterns**:

**Adding Networks**:

```typescript
// Add to NETWORKS object
polygon: {
  chainId: 137,
  name: 'Polygon',
  rpcUrl: 'https://polygon-rpc.com/',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
}
```

**Adding Tokens**:

```typescript
// Add to TOKENS[networkName]
NEWTOKEN: {
  address: '0x...actual_contract_address...',
  decimals: 18, // or 6 for stablecoins like TWUSD
  symbol: 'NEWTOKEN',
  name: 'New Token Name'
}
```

**Adding Wallet Methods**:

```typescript
// In USDOXWallet class
async getNewTokenBalance(address?: string): Promise<string> {
  return await this.blockchainService.getTokenBalance('NEWTOKEN', address);
}

async sendNewToken(recipient: string, amount: string): Promise<string> {
  return await this.blockchainService.transferToken('NEWTOKEN', recipient, amount);
}
```

---

## 3. TECH STACK

| Technology       | Version | Purpose         | Notes                                     |
| ---------------- | ------- | --------------- | ----------------------------------------- |
| **Next.js**      | 16.1.1  | React framework | App Router, Server/Client separation      |
| **React**        | 19.2.3  | UI library      | "use client" components for wallet logic  |
| **ethers.js**    | v6      | Web3 library    | ES modules (NOT v5), Contract/Signer APIs |
| **TypeScript**   | ^5      | Type safety     | Strict mode enabled                       |
| **Tailwind CSS** | 4       | Styling         | Utility-first CSS framework               |
| **ESLint**       | 9       | Code quality    | Next.js config included                   |

**Critical**: ethers.js v6 has different imports than v5—use ES modules syntax

---

## 4. PROJECT STRUCTURE

```
wallet-app/
├── .github/
│   └── copilot-instructions.md        (← You are here)
├── src/
│   ├── wallet-architecture.ts         (← Core: ~1300 lines, 3 main classes)
│   ├── app/
│   │   ├── page.tsx                   (← Main UI with wallet integration example)
│   │   ├── layout.tsx                 (← Root layout, metadata, fonts)
│   │   ├── globals.css                (← Tailwind directives)
│   │   ├── about/
│   │   ├── twusd-tokenomics/
│   │   └── usdoxcare/
│   └── public/
├── package.json                       (← Dependencies, scripts)
├── tsconfig.json                      (← TypeScript config, path aliases)
├── next.config.ts                     (← Next.js configuration)
├── postcss.config.mjs                 (← Tailwind CSS setup)
├── eslint.config.mjs                  (← Linting rules)
└── .env                               (← Environment variables (Vercel config))
```

### Multi-Page Application Structure

**Navigation Pages**: Home (`/`), About, USDOXCare (`/usdoxcare`), TWUSD Tokenomics (`/twusd-tokenomics`)

**Page Components**: Each page is a "use client" component with:

- Shared header navigation with logo and menu
- Tailwind CSS styling with dark theme (gray-950 background)
- Next.js Image components for logos (external GitHub URLs)
- Responsive design with mobile navigation

**Example Page Structure**:

```tsx
"use client";
import Link from "next/link";
import Image from "next/image";

export default function PageName() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-950/90 border-b border-gray-800">
        {/* Navigation with logo and menu links */}
      </header>
      <main className="max-w-4xl mx-auto px-6 py-24">{/* Page content */}</main>
    </div>
  );
}
```

**Logo Assets**: Stored in `public/` directory, referenced via GitHub raw URLs for consistency across deployments.

## 5. WALLET ARCHITECTURE DEEP DIVE

### File: `src/wallet-architecture.ts`

**Three Main Classes**:

#### 1. BlockchainService

Handles blockchain operations and provider management

**Key Methods**:

- `initializeReadOnlyProvider(network)` - Read-only mode for public data
- `connectMetaMask()` - Connect to user's MetaMask wallet
- `importWalletFromPrivateKey(privateKey, network)` - Import existing wallet
- `createWallet()` - Generate new random wallet (EOA)
- `getWalletAddress()` - Get current connected address

**Manages**: Providers (JsonRpcProvider, BrowserProvider), Signers, Network state

#### 2. TokenManager

Handles ERC-20 token interactions

**Key Methods**:

- `getTokenBalance(tokenSymbol, walletAddress)` - Fetch token balance
- `transfer(tokenSymbol, toAddress, amount)` - Send tokens
- `approve(tokenSymbol, spenderAddress, amount)` - Approve token spending

**Uses**: Contract interface with ERC-20 ABI, formatUnits/parseUnits for decimals

#### 3. USDOXWallet (Public API)

Main class that combines BlockchainService + TokenManager

**Public Methods**:

- `initializeReadOnly()` - Start in read-only mode
- `connectMetaMask()` - User wallet connection
- `createNewWallet()` - Generate new wallet
- `getUSDOBalance(address)` - Get USDO balance (formatted)
- `getTWUSDBalance(address)` - Get TWUSD balance (formatted)
- `sendUSDO(recipient, amount)` - Send USDO tokens
- `sendTWUSD(recipient, amount)` - Send TWUSD tokens

---

## 6. CONFIGURATION

### Network Configuration

Located at top of `src/wallet-architecture.ts`:

```typescript
const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://ethereum-rpc.publicnode.com",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  },
  base: {
    chainId: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  },
};
```

### Token Configuration

```typescript
const TOKENS: Record<string, Record<string, TokenConfig>> = {
  ethereum: {
    USDO: {
      address: "0xUSDO_CONTRACT_ADDRESS", // ← REPLACE WITH ACTUAL ADDRESS
      decimals: 18,
      symbol: "USDO",
      name: "USDO Token",
    },
    TWUSD: {
      address: "0xTWUSD_CONTRACT_ADDRESS", // ← REPLACE WITH ACTUAL ADDRESS
      decimals: 6, // ← IMPORTANT: 6 decimals (not 18)
      symbol: "TWUSD",
      name: "TheUSDOX Wrapped Dollar",
    },
  },
  // Similar structure for 'base', 'sepolia'...
};
```

**To Add a New Network**:

1. Add entry to `NETWORKS` object with chainId, rpcUrl, nativeCurrency
2. Add network key to `TOKENS` object with token configurations
3. Update React components to handle new network if needed

**To Add a New Token**:

1. Add TokenConfig entry to desired network in `TOKENS`
2. Add getter method to USDOXWallet (e.g., `getNewTokenBalance()`)
3. Test with correct decimals

---

## 7. CRITICAL PATTERNS & CONVENTIONS

### Pattern 1: Initialize Wallet in React Components

```typescript
"use client"; // ← REQUIRED for browser APIs

import { USDOXWallet } from "@/wallet-architecture";
import { useState, useEffect } from "react";

export default function WalletComponent() {
  const [wallet, setWallet] = useState<USDOXWallet | null>(null);

  useEffect(() => {
    const w = new USDOXWallet();
    w.initializeReadOnly(); // Start in read-only mode
    setWallet(w);
  }, []); // Only run once on mount

  // Use wallet in handlers...
}
```

**Why "use client"?**: Browser APIs (window.ethereum) only available client-side

### Pattern 2: MetaMask Connection with Safety Checks

```typescript
const handleConnectMetaMask = async () => {
  // CRITICAL: Check window.ethereum exists
  if (typeof window === "undefined" || !(window as any).ethereum) {
    alert("MetaMask not detected. Please install MetaMask extension.");
    return;
  }

  try {
    const address = await wallet!.connectMetaMask();
    setWalletAddress(address);
    setIsConnected(true);
  } catch (error) {
    console.error("MetaMask connection failed:", error);
    // Handle user rejection, no MetaMask, etc.
  }
};
```

### Pattern 3: Token Amount Handling (CRITICAL GOTCHA)

**Rule**: Always pass amounts as **STRINGS** to wallet methods, NOT numbers or BigInt

```typescript
// WRONG: ❌
const txHash = await wallet.sendTWUSD(recipient, 100);

// RIGHT: ✅
const txHash = await wallet.sendTWUSD(recipient, "100");
```

**Why strings?**: Preserves precision for large numbers and aligns with ethers.js parseUnits()

**TWUSD Special Case** - 6 decimals (not 18 like most tokens):

- User inputs "100" → Internally becomes 100 × 10^6 = 100,000,000
- Balance "123.456789" → Displays correctly (internal: 123456789)
- **CRITICAL**: TWUSD uses 6 decimals, USDO uses 18 - always check token config

**Decimal Validation Pattern**:

```typescript
// Always validate decimals from token config, never hardcode
const tokenConfig = TOKENS[network][tokenSymbol];
const amountInUnits = parseUnits(amountString, tokenConfig.decimals);
```

### Pattern 4: Balance Queries

```typescript
// Returns formatted string (e.g., "1234.567890")
const usdoBalance = await wallet.getUSDOBalance(walletAddress);
const twusdBalance = await wallet.getTWUSDBalance(walletAddress);

// Display directly in UI
<p>USDO: {usdoBalance}</p>
<p>TWUSD: {twusdBalance}</p>
```

### Pattern 5: Error Handling Checklist

```typescript
async function walletOperation() {
  try {
    // 1. Check browser environment
    if (typeof window === "undefined") {
      throw new Error("Browser-only operation");
    }

    // 2. Verify MetaMask if needed
    if (!(window as any).ethereum) {
      throw new Error("MetaMask required");
    }

    // 3. Check network compatibility
    // (wallet automatically validates chainId)

    // 4. Validate input addresses
    if (!ethers.isAddress(recipientAddress)) {
      throw new Error("Invalid recipient address");
    }

    // 5. Execute operation
    const result = await wallet.sendTWUSD(recipient, amount);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429")) {
        // Rate limit from public RPC
        console.error("Too many requests - retry later");
      } else if (error.message.includes("insufficient")) {
        // User doesn't have enough balance
        console.error("Insufficient balance");
      } else {
        console.error("Operation failed:", error.message);
      }
    }
  }
}
```

---

## 8. DEVELOPMENT WORKFLOW

### Setup & Installation

```bash
# Navigate to project directory
cd wallet-app

# Install dependencies
npm install

# Create .env file with Vercel config (if deploying)
# Add VERCEL_ORG_ID and VERCEL_PROJECT_ID
```

### Local Development

```bash
# Start development server (with hot reload)
npm run dev

# Access at http://localhost:3000
```

### Code Quality

```bash
# Check TypeScript types
npm run lint

# ESLint will validate Next.js best practices
```

### Production Build

```bash
# Create optimized production build
npm run build

# Verify build locally
npm start

# Opens production server at http://localhost:3000
```

### Deployment to Vercel

```bash
# Login to Vercel CLI (one time)
npm install -g vercel
vercel login

# Deploy to production
vercel --prod

# Or push to GitHub—auto-deployment can be configured
```

**Environment Variables** (`.env` file):

- `VERCEL_ORG_ID` - Vercel team/organization ID for deployments
- `VERCEL_PROJECT_ID` - Vercel project ID (optional but recommended)

**Vercel Configuration** (`vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

**Deployment Notes**:

- Uses `@vercel/next` builder for Next.js 16
- Environment variables must be set in Vercel dashboard or `.env`
- Logo images referenced via GitHub raw URLs (no local asset hosting needed)

## 9. COMMON DEVELOPMENT TASKS

### Task: Add Support for New Network

**Steps**:

1. Add network to `NETWORKS` in `src/wallet-architecture.ts`
2. Add token mappings to `TOKENS` for that network
3. Replace placeholder contract addresses with actual ones
4. Test with Sepolia first (no mainnet funds at risk)
5. Update UI if network selection needed

**Example - Add Polygon**:

```typescript
// In NETWORKS
polygon: {
  chainId: 137,
  name: 'Polygon',
  rpcUrl: 'https://polygon-rpc.com/',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
}

// In TOKENS['polygon']
USDO: { address: '0x...polygon_usdo...', decimals: 18, ... }
TWUSD: { address: '0x...polygon_twusd...', decimals: 6, ... }
```

### Task: Add Support for New Token

**Steps**:

1. Add token config to `TOKENS[networkName]`
2. Add getter method to USDOXWallet class (e.g., `getXYZBalance()`)
3. Add send method if needed (e.g., `sendXYZ()`)
4. Update UI to display new token

### Task: Debug Wallet Connection Issues

**Checklist**:

- Is MetaMask extension installed? → Check `(window as any).ethereum`
- Is user on correct network? → Compare `window.ethereum.chainId` with NETWORKS config
- Is MetaMask locked? → User must unlock to connect
- Did user reject connection? → Catch error and retry
- Is RPC endpoint down? → Switch to different RPC URL

### Task: Test Transaction Sending

**Recommended Approach**:

1. Use Sepolia testnet (free test ETH from faucets)
2. Get test USDO/TWUSD tokens
3. Test with small amounts first ("0.01")
4. Monitor gas fees and latency
5. Check transaction hash in block explorer

---

## 10. IMPORTANT NOTES & GOTCHAS

### Security

- ⚠️ **Private keys NEVER leave client-side** - No backend should handle keys
- ⚠️ **Don't log private keys or mnemonics** - Security risk
- ⚠️ **Validate all user inputs** - Especially recipient addresses
- ⚠️ **Use HTTPS in production** - Never serve over HTTP

### Decimals Handling

- 🔴 **TWUSD = 6 decimals** (special case!)
- 🟢 **USDO = 18 decimals** (standard ERC-20)
- 🔵 Most tokens use 18 decimals
- Always check token config for correct decimals

### RPC Endpoints

- Current RPC nodes are **public** (rate-limited, slower)
- **For production**: Upgrade to private RPC endpoints (Alchemy, Infura, etc.)
- Handle 429 (rate limit) errors with exponential backoff

### MetaMask Considerations

- **WalletConnect support** - Noted as future feature
- **Hardware wallets** - Work via MetaMask
- **Network switching** - User clicks in MetaMask UI, wallet detects automatically
- **Account switching** - User can switch accounts in MetaMask

### Testing & Deployment

- **Sepolia = Test network** - Use for development/testing
- **Ethereum/Base = Mainnet** - Real funds at stake
- **Always test on Sepolia first**
- **Contract addresses are placeholders** - Replace before mainnet

---

## 11. TROUBLESHOOTING GUIDE

| Problem                       | Cause                                    | Solution                                      |
| ----------------------------- | ---------------------------------------- | --------------------------------------------- |
| "MetaMask not detected"       | Extension not installed                  | Install MetaMask from browser store           |
| "Unsupported network"         | ChainId doesn't match NETWORKS           | Switch network in MetaMask to supported chain |
| "Invalid recipient address"   | Malformed Ethereum address               | Validate with `ethers.isAddress()`            |
| "Insufficient balance"        | User doesn't have enough tokens          | Check balance before sending                  |
| "Transaction failed with 429" | RPC rate limit                           | Wait before retry or upgrade RPC              |
| "Token not found"             | Address missing from TOKENS config       | Add token config to correct network           |
| "window.ethereum undefined"   | Not in browser or page uses "use server" | Ensure "use client" directive present         |
| "TWUSD amount seems wrong"    | 6-decimal confusion                      | Remember: TWUSD uses 6 decimals, not 18       |

---

## 12. QUICK REFERENCE

### Key Files to Know

- **`src/wallet-architecture.ts`** - Everything blockchain-related (start here)
- **`src/app/page.tsx`** - Full UI example with state management
- **`src/app/layout.tsx`** - Root layout and metadata
- **`tsconfig.json`** - Path aliases and TypeScript settings
- **`package.json`** - Dependencies and npm scripts

### Key Imports

```typescript
import { USDOXWallet } from "@/wallet-architecture";
import { ethers } from "ethers"; // v6
import { useState, useEffect } from "react";
```

### Common Commands

```bash
npm install        # Install deps
npm run dev        # Local development
npm run build      # Production build
npm run lint       # Code quality check
npm start          # Run production locally
vercel --prod      # Deploy to Vercel
```

### Environment Variables

- `VERCEL_ORG_ID` - Vercel team ID for deployments
- `VERCEL_PROJECT_ID` - Vercel project ID (optional)
- See `.env` file for setup

---

**Last Updated**: December 30, 2025  
**Version**: 1.1  
**For AI Agents**: This guide provides complete context for understanding, extending, and debugging the USDOX Wallet App codebase.
