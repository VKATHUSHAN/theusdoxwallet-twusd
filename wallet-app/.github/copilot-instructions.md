# AI Copilot Instructions - USDOX Wallet App

## Project Overview

A non-custodial EVM wallet application for the USDOX ecosystem. Supports multi-network blockchain interactions (Ethereum, Base, Sepolia) with client-side key management. Features MetaMask integration, wallet creation, and ERC-20 token transfers (USDO, TWUSD).

## Architecture

### Core Layers (see `src/wallet-architecture.ts`)

1. **BlockchainService** - Provider/signer management, multi-network support, wallet creation
2. **TokenManager** - ERC-20 token interactions (balance, transfer, approval)
3. **USDOXWallet** - Public API wrapper combining blockchain + token operations

### Design Patterns

- **Non-custodial only**: All keys remain client-side; never store or transmit private keys to backend
- **Multi-network extensibility**: Add networks via `NETWORKS` and `TOKENS` config objects (currently: Ethereum, Base, Sepolia)
- **Dual mode**: Read-only public mode (`initializeReadOnly()`) + MetaMask/private key import modes
- **ERC-20 standard**: Uses ethers.js Contract interface with minimal ABI (balanceOf, transfer, approve)

### Token Specifics

- **TWUSD**: 6 decimals (special case - most tokens use 18)
- **USDO**: 18 decimals
- Contract addresses are placeholders in config - replace with actual addresses per network

## Tech Stack

- **Framework**: Next.js 16 + React 19 (with "use client" for wallet components)
- **Web3**: ethers.js v6 (not v5 - uses ES modules, different imports)
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9 (with Next.js config)
- **Type Safety**: TypeScript strict mode

## Development Workflow

### Setup

```bash
npm install
npm run dev  # Runs on http://localhost:3000
```

### Build & Deployment

```bash
npm run build      # Creates optimized production build
npm start         # Runs production server locally
vercel --prod     # Deploy to Vercel (team ID in .env)
```

### Linting

```bash
npm run lint      # Check code style
```

## Key Patterns & Conventions

### UI Components (React Client Components)

- Use `"use client"` directive at top of page.tsx components
- Wrap wallet operations in `useState` + `useEffect` for state management
- Always wrap blockchain calls in try-catch for error handling
- Import wallet from path alias: `import { USDOXWallet } from '@/wallet-architecture'`

### Wallet Operations Flow

1. **Initialize**: Create USDOXWallet instance, call `initializeReadOnly()` in useEffect
2. **Connect**: Call `connectMetaMask()` (browser-dependent, check window.ethereum)
3. **Query**: Use `getUSDOBalance()`, `getTWUSDBalance()` with wallet address
4. **Send**: Call `sendUSDO()` or `sendTWUSD()` with recipient + amount (string, not BigInt)

### Amount Handling

- Always pass amounts as **strings** to wallet methods (decimals handled internally via formatUnits/parseUnits)
- TWUSD amounts: multiply by 10^6 when constructing transactions
- Use `parseUnits(amount, decimals)` and `formatUnits(balance, decimals)` for conversions

### Error Scenarios

- **No MetaMask**: Check `typeof window !== 'undefined' && (window as any).ethereum`
- **Unsupported network**: Verify chain ID matches NETWORKS config before operation
- **Rate limits**: Handle 429 responses from public RPC endpoints with retry logic
- **Invalid token address**: Placeholder addresses in config will fail - replace before production

## Configuration Points

- **Networks**: Add/modify in `NETWORKS` object (chainId, rpcUrl, nativeCurrency)
- **Tokens**: Add/modify in `TOKENS` object per network
- **Contract addresses**: Replace placeholder `0xUSDO_CONTRACT_ADDRESS` values
- **RPC endpoints**: Currently using public nodes (consider private nodes for production)

## Project-Specific Considerations

1. **No backend**: This is a frontend-only wallet - all state is client-side
2. **Public RPC nodes**: Not ideal for production (rate limits, reduced reliability) - plan to upgrade
3. **MetaMask required for signing**: Current implementation requires MetaMask for transactions (WalletConnect support noted as future feature)
4. **Testnet available**: Use Sepolia chain config for testing without mainnet funds

## Useful File References

- `src/wallet-architecture.ts` - Core wallet logic (~1300 lines, read for blockchain/token patterns)
- `src/app/page.tsx` - Main UI example (state management, wallet integration patterns)
- `src/app/layout.tsx` - Root layout (metadata, font setup)
- `package.json` - Dependencies and scripts
- `.env` - Environment variables (Vercel team config)
