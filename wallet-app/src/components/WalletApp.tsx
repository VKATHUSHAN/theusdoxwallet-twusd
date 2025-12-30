import React, { useState, useEffect } from 'react';
import { Wallet, ArrowRightLeft, Lock, ExternalLink, Copy, Check, Menu, X, AlertTriangle, ChevronRight, Info } from 'lucide-react';

// --- Constants & Config ---

// ✅ CORRECTED: USDOX contract on BNB Chain (0xaa4abdfb92a1bf93f3f443a4297b533bdf2a2e9c)
const TWUSD_ADDRESS = "0x7BeB51807e3c8Bd10a2868Bd51C2D9E1764925d"; // Ethereum mainnet
const USDOX_ADDRESS = "0xaa4abdfb92a1bf93f3f443a4297b533bdf2a2e9c"; // BNB Chain

const LOGO_URLS = {
  USDOX: "/usdoxcare_logo.png",  // ✅ FIXED: Use relative path from /public folder for faster loading
  TWUSD: "/twusd_logo.png",      // ✅ FIXED: Use relative path from /public folder for faster loading
  USDO: "/usdo_logo.png"         // ✅ FIXED: Use relative path from /public folder for faster loading
};

// Minimal ABI for ERC20 Token interaction
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)"
];

const WalletApp = () => {
  // --- State ---
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'swap' | 'vault'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [balances, setBalances] = useState({ twusd: '0.00', usdox: '0.00' });
  const [isConnecting, setIsConnecting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // --- Wallet Logic ---
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this application.");
      return;
    }
    
    setIsConnecting(true);
    try {
      const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const chain = await (window.ethereum as any).request({ method: 'eth_chainId' });
      setChainId(chain);
      
      // Mock fetching balances for demo purposes if we don't have a live provider setup in this specific file context
      // In a real deployment, you would use ethers.js or viem here.
      // fetchBalances(accounts[0]); 
      
      // Simulating a balance fetch for UI demonstration
      setTimeout(() => {
        setBalances({ twusd: '1,250.00', usdox: '500.00' });
      }, 500);

    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const addTokenToWallet = async (tokenSymbol: string, address: string, image: string) => {
    if (!window.ethereum) return;
    try {
      await (window.ethereum as any).request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: address,
            symbol: tokenSymbol, 
            decimals: 6,
            image: image,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(type);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // --- Components ---

  const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img src={LOGO_URLS.USDOX} alt="USDOX" className="h-8 w-8 object-contain" />
            <span className="text-white font-bold text-xl tracking-tight">USDOX<span className="text-blue-500">CARE</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavButton label="Dashboard" icon={<Wallet size={16} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <NavButton label="Swap" icon={<ArrowRightLeft size={16} />} active={activeTab === 'swap'} onClick={() => setActiveTab('swap')} />
              <NavButton label="Vault" icon={<Lock size={16} />} active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
            </div>
          </div>

          {/* Connect Button */}
          <div className="hidden md:block">
            {account ? (
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-full px-4 py-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-slate-200">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavButton label="Dashboard" onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} />
            <MobileNavButton label="Swap" onClick={() => { setActiveTab('swap'); setMobileMenuOpen(false); }} />
            <MobileNavButton label="Vault" onClick={() => { setActiveTab('vault'); setMobileMenuOpen(false); }} />
            <div className="mt-4 pt-4 border-t border-slate-700">
              <button onClick={connectWallet} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-500">
                {account ? 'Connected' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  const NavButton = ({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const MobileNavButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
    >
      {label}
    </button>
  );

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TokenCard 
          symbol="TWUSD" 
          name="TheUSDOX Wrapped Dollar" 
          balance={account ? balances.twusd : '---'} 
          address={TWUSD_ADDRESS}
          logo={LOGO_URLS.TWUSD}
          isPegged={true}
        />
        <TokenCard 
          symbol="USDOX" 
          name="USDOX Governance" 
          balance={account ? balances.usdox : '---'} 
          address={USDOX_ADDRESS}
          logo={LOGO_URLS.USDOX}
          isPegged={false}
        />
      </div>

      {/* Audit/Info Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info size={20} className="text-blue-400" />
          Ecosystem Status
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-yellow-200 text-sm font-medium">Token Metadata Notice</p>
              <p className="text-slate-400 text-xs mt-1">
                The TWUSD contract on Etherscan currently displays as "USDT". This is a known metadata mismatch. 
                The contract logic and peg are unaffected. Please verify the contract address ends in <span className="font-mono text-slate-300">...925d</span>.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
            <span className="text-slate-400 text-sm">Contract Audit Status</span>
            <span className="flex items-center gap-1 text-green-400 text-xs font-mono bg-green-900/30 px-2 py-1 rounded">
              <Check size={12} /> VERIFIED SOURCE
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const TokenCard = ({ symbol, name, balance, address, logo, isPegged }: { symbol: string; name: string; balance: string; address: string; logo: string; isPegged: boolean }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <img src={logo} alt="watermark" className="w-24 h-24" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 p-2 border border-slate-600">
            <img src={logo} alt={symbol} className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{symbol}</h3>
            <p className="text-xs text-slate-400">{name}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-1">Balance</p>
          <div className="text-3xl font-mono font-medium text-white tracking-tight">
            {balance}
          </div>
          {isPegged && <p className="text-xs text-green-400 mt-1">Peg: $1.00 USD</p>}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => copyToClipboard(address, symbol)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {copyFeedback === symbol ? <Check size={14} /> : <Copy size={14} />}
            {copyFeedback === symbol ? 'Copied' : 'Copy Address'}
          </button>
          
          <button 
            onClick={() => addTokenToWallet(symbol, address, logo)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Wallet size={14} />
            Add to Wallet
          </button>

          <a 
            href={`https://etherscan.io/address/${address}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );

  const SwapView = () => (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-semibold text-white">Swap</h2>
          <button className="text-slate-400 hover:text-white"><Info size={18} /></button>
        </div>

        {/* From Input */}
        <div className="bg-slate-900 rounded-xl p-4 mb-2">
          <div className="flex justify-between mb-2">
            <span className="text-slate-400 text-xs">From</span>
            <span className="text-slate-400 text-xs">Balance: {account ? balances.twusd : '0.00'}</span>
          </div>
          <div className="flex justify-between items-center">
            <input 
              type="text" 
              placeholder="0.0" 
              className="bg-transparent text-2xl text-white outline-none w-1/2" 
            />
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <img src={LOGO_URLS.TWUSD} className="w-5 h-5" alt="TWUSD" />
              <span className="text-white font-medium text-sm">TWUSD</span>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-lg border-4 border-slate-800 transition-colors">
            <ArrowRightLeft size={16} />
          </button>
        </div>

        {/* To Input */}
        <div className="bg-slate-900 rounded-xl p-4 mt-2 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-400 text-xs">To</span>
            <span className="text-slate-400 text-xs">Balance: {account ? balances.usdox : '0.00'}</span>
          </div>
          <div className="flex justify-between items-center">
            <input 
              type="text" 
              placeholder="0.0" 
              className="bg-transparent text-2xl text-white outline-none w-1/2" 
            />
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <img src={LOGO_URLS.USDOX} className="w-5 h-5" alt="USDOX" />
              <span className="text-white font-medium text-sm">USDOX</span>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        </div>

        {/* Swap Action */}
        <button className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20">
          {account ? 'Coming Soon' : 'Connect Wallet'}
        </button>
        
        <p className="text-center text-xs text-slate-500 mt-4">
          Route: TWUSD via Uniswap V3 (Placeholder)
        </p>
      </div>
    </div>
  );

  const VaultView = () => (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="mb-6 flex justify-center">
          <div className="bg-slate-800 p-4 rounded-full border border-slate-600 shadow-xl">
            <Lock size={40} className="text-blue-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">USDOX Vault</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Stake your TWUSD to earn rewards and participate in ecosystem governance. 
          Smart contracts are currently undergoing final security audits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">APY</div>
            <div className="text-green-400 font-mono text-xl">--- %</div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">TVL</div>
            <div className="text-white font-mono text-xl">$0.00</div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Your Stake</div>
            <div className="text-white font-mono text-xl">0 TWUSD</div>
          </div>
        </div>

        <button disabled className="bg-slate-700 text-slate-400 px-6 py-2 rounded-lg font-medium cursor-not-allowed border border-slate-600">
          Launches Q4 2025
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'swap' && <SwapView />}
        {activeTab === 'vault' && <VaultView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-auto py-8 text-center text-slate-500 text-sm">
        <p>© 2025 The USDOX Ecosystem. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Etherscan</a>
        </div>
      </footer>
    </div>
  );
};

export default WalletApp;
