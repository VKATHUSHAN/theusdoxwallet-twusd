/**
 * Contract Configuration for USDOX Ecosystem
 * 
 * CRITICAL: These are the CORRECT contract addresses
 * DO NOT use placeholder or incomplete addresses
 */

export const CONTRACTS = {
  USDOX: {
    // USDOX Governance Token - BNB Chain ONLY
    address: "0xaa4abdfb92a1bf93f3f443a4297b533bdf2a2e9c",
    chain: "BNB",
    decimals: 18,
    symbol: "USDO",
    name: "USDOX Governance Token"
  },
  TWUSD: {
    // TWUSD Stablecoin - Multi-chain support
    ethereum: {
      address: "0x7BeB51807e3c8Bd10a2868Bd51C2D9E1764925d",
      decimals: 6,
      rpc: process.env.NEXT_PUBLIC_ETH_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    },
    bsc: {
      address: "0x...", // TODO: Get from your records
      decimals: 6,
      rpc: process.env.NEXT_PUBLIC_BNB_RPC_URL || "https://bsc-dataseed1.binance.org:8545"
    },
    polygon: {
      address: "0x...", // TODO: Get from your records
      decimals: 6,
      rpc: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com"
    },
    base: {
      address: "0x...", // TODO: Get from your records
      decimals: 6,
      rpc: process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"
    },
    optimism: {
      address: "0x...", // TODO: Get from your records
      decimals: 6,
      rpc: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || "https://mainnet.optimism.io"
    }
  }
};

// Network configurations
export const NETWORKS = {
  1: {
    name: "Ethereum",
    symbol: "ETH",
    rpc: process.env.NEXT_PUBLIC_ETH_RPC_URL
  },
  56: {
    name: "BNB Chain",
    symbol: "BNB",
    rpc: process.env.NEXT_PUBLIC_BNB_RPC_URL
  },
  137: {
    name: "Polygon",
    symbol: "MATIC",
    rpc: process.env.NEXT_PUBLIC_POLYGON_RPC_URL
  },
  8453: {
    name: "Base",
    symbol: "ETH",
    rpc: process.env.NEXT_PUBLIC_BASE_RPC_URL
  },
  10: {
    name: "Optimism",
    symbol: "ETH",
    rpc: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL
  }
};

// ERC20 ABI - Essential functions only
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Logo URLs - using /public folder for fast loading
export const LOGO_URLS = {
  USDOX: "/usdoxcare_logo.png",
  TWUSD: "/twusd_logo.png",
  USDO: "/usdo_logo.png"
};
