---
description: GitHub Copilot Instructions for USDOX Wallet App
---

# USDOX Wallet App - Copilot Instructions

## Quick Overview

Non-custodial EVM wallet for USDOX ecosystem. Supports Ethereum, Base, Sepolia with MetaMask integration and ERC-20 token transfers (USDO, TWUSD).

## Architecture Pattern

```
BlockchainService (ethers.js)
  ↓
TokenManager (ERC-20 contracts)
  ↓
USDOXWallet (Public API)
  ↓
React Components ("use client")
```

**Key principle**: All private keys stay client-side. No backend key storage.

## Tech Stack

- **Next.js 16** + React 19 ("use client" components)
- **ethers.js v6** (ES modules, not v5)
- **TypeScript strict mode**
- **Tailwind CSS 4**
- **ESLint 9**

## Critical Code Patterns

### 1. Initialize Wallet in Components

```typescript
"use client";
import { USDOXWallet } from "@/wallet-architecture";

export default function WalletComponent() {
  const [wallet, setWallet] = useState<USDOXWallet | null>(null);

  useEffect(() => {
    const w = new USDOXWallet();
    w.initializeReadOnly();
    setWallet(w);
  }, []);
}
```

### 2. MetaMask Connection Pattern

```typescript
const handleConnectMetaMask = async () => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      const address = await wallet.connectMetaMask();
      setWalletAddress(address);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
    }
  }
};
```

### 3. Token Amount Handling (CRITICAL)

- Pass amounts as **STRINGS** to wallet methods
- TWUSD uses **6 decimals** (most tokens use 18)
- Use `parseUnits(amount, decimals)` and `formatUnits(balance, decimals)`

```typescript
const balance = await wallet.getUSDOBalance(address);
const txHash = await wallet.sendTWUSD(recipient, "100");
```

### 4. Network Configuration

Edit in `src/wallet-architecture.ts`:

```typescript
const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: { chainId: 1, rpcUrl: '...', ... },
  base: { chainId: 8453, rpcUrl: '...', ... },
  sepolia: { chainId: 11155111, rpcUrl: '...', ... }
};

const TOKENS: Record<string, Record<string, TokenConfig>> = {
  ethereum: {
    USDO: { address: '0x...', decimals: 18 },
    TWUSD: { address: '0x...', decimals: 6 }
  }
};
```

## Development Commands

```bash
npm install
npm run dev          # localhost:3000
npm run build
npm run lint
vercel --prod        # Deploy to Vercel
```

## Configuration Tasks

1. Replace placeholder token addresses in NETWORKS and TOKENS
2. Set contract addresses before mainnet deployment
3. Use Sepolia chain for testing
4. Upgrade RPC nodes from public to private for production

## File Map

- `src/wallet-architecture.ts` - Core logic (1300 lines)
- `src/app/page.tsx` - UI example with state management
- `src/app/layout.tsx` - Root layout
- `tsconfig.json` - Path alias: `@/*` → `./src/*`

## Error Handling

- Check `window.ethereum` exists before MetaMask calls
- Verify network chainId matches NETWORKS config
- Wrap blockchain calls in try-catch
- Handle 429 rate limit errors from public RPCs
- Validate recipient address format

## Important Notes

- TWUSD has 6 decimals (most ERC-20s use 18)
- All private keys stay client-side only
- No backend wallet storage
- MetaMask required for transaction signing

## When Adding Features

1. Extend NETWORKS or TOKENS for new networks/tokens
2. Add methods to BlockchainService or TokenManager
3. Expose through USDOXWallet public API
4. Use "use client" in React components
5. Always check window/MetaMask availability
