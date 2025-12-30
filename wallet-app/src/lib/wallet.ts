import {
  Contract,
  formatUnits,
  JsonRpcProvider,
  parseUnits,
  Wallet,
  BrowserProvider,
  Signer,
  isAddress,
  getAddress,
  type TransactionResponse,
} from 'ethers';
import { CONTRACTS, NETWORKS, ERC20_ABI } from '../config/contracts';

export interface NetworkConfig {
  name: string;
  symbol: string;
  rpc: string;
}

export interface TokenConfig {
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
  chain?: string;
  rpc?: string;
}
class BlockchainService {
  private provider: JsonRpcProvider | BrowserProvider | null = null;
  private signer: Signer | null = null;
  private currentNetwork: string = 'ethereum';

  async initializeReadOnlyProvider(network: string = 'ethereum'): Promise<void> {
    const networkID = Object.keys(NETWORKS).find(key => (NETWORKS as any)[key].name.toLowerCase() === network.toLowerCase());
    if (!networkID) throw new Error(`Unsupported network: ${network}`);
    const networkConfig = (NETWORKS as Record<string, NetworkConfig>)[networkID];
    this.provider = new JsonRpcProvider(networkConfig.rpc);
    this.currentNetwork = network;
  }

  async connectMetaMask(): Promise<string> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    this.provider = new BrowserProvider((window as any).ethereum);
    this.signer = await this.provider.getSigner();
    const network = await this.provider.getNetwork();
    this.currentNetwork = network.name;
    return await this.signer.getAddress();
  }

  createWallet(): { address: string; privateKey: string; mnemonic: string } {
    const wallet = Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || '',
    };
  }

  async importWalletFromPrivateKey(privateKey: string, network: string = 'ethereum'): Promise<string> {
    const networkID = Object.keys(NETWORKS).find(key => (NETWORKS as any)[key].name.toLowerCase() === network.toLowerCase());
    if (!networkID) throw new Error(`Unsupported network: ${network}`);
    const networkConfig = (NETWORKS as Record<string, NetworkConfig>)[networkID];
    this.provider = new JsonRpcProvider(networkConfig.rpc);
    this.signer = new Wallet(privateKey, this.provider);
    this.currentNetwork = network;
    return await this.signer.getAddress();
  }

  async getWalletAddress(): Promise<string> {
    if (!this.signer) throw new Error('No wallet connected');
    return await this.signer.getAddress();
  }

  async getTokenBalance(tokenSymbol: 'USDOX' | 'TWUSD', walletAddress?: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const tokenConfig = tokenSymbol === 'USDOX' 
        ? CONTRACTS.USDOX 
        : (CONTRACTS.TWUSD as any)[this.currentNetwork.toLowerCase()];

    if (!tokenConfig) throw new Error(`Token ${tokenSymbol} not supported on ${this.currentNetwork}`);
    if (!isAddress(tokenConfig.address)) {
      throw new Error(`Token address for ${tokenSymbol} on ${this.currentNetwork} is not configured or invalid.`);
    }
    
    let address = walletAddress;
    if (!address && this.signer) address = await this.signer.getAddress();
    if (!address) throw new Error('No wallet address provided');
    
    address = getAddress(address);
    
    const contract = new Contract(tokenConfig.address, ERC20_ABI, this.provider);
    const balance = (await contract.balanceOf(address)) as bigint;
    
    return formatUnits(balance, tokenConfig.decimals);
  }

  async transferToken(tokenSymbol: 'USDOX' | 'TWUSD', recipientAddress: string, amount: string): Promise<string> {
    if (!this.signer) throw new Error('No wallet connected');
    
    const tokenConfig = tokenSymbol === 'USDOX'
        ? CONTRACTS.USDOX
        : (CONTRACTS.TWUSD as any)[this.currentNetwork.toLowerCase()];

    if (!tokenConfig) throw new Error(`Token ${tokenSymbol} not supported on ${this.currentNetwork}`);
    if (!isAddress(tokenConfig.address)) {
      throw new Error(`Token address for ${tokenSymbol} on ${this.currentNetwork} is not configured or invalid.`);
    }
    
    const recipient = getAddress(recipientAddress);
    const contract = new Contract(tokenConfig.address, ERC20_ABI, this.signer);
    const senderAddress = await this.signer.getAddress();
    const balance = (await contract.balanceOf(senderAddress)) as bigint;
    const amountInTokenUnits = parseUnits(amount, tokenConfig.decimals);

    if (balance < amountInTokenUnits) {
      const formattedBalance = formatUnits(balance, tokenConfig.decimals);
      throw new Error(`Insufficient ${tokenSymbol} balance. Required: ${amount}, Available: ${formattedBalance}`);
    }
    
    const gasEstimate = await contract.transfer.estimateGas(recipient, amountInTokenUnits);
    const gasLimit = (gasEstimate * 120n) / 100n; 
    
    const tx: TransactionResponse = await contract.transfer(recipient, amountInTokenUnits, { gasLimit });
    const receipt = await tx.wait();
    
    if (!receipt) throw new Error('Transaction receipt is null');
    
    return tx.hash;
  }

  async switchNetwork(network: string): Promise<void> {
    const networkKey = Object.keys(NETWORKS).find(key => (NETWORKS as any)[key].name.toLowerCase() === network.toLowerCase());
    if(!networkKey) throw new Error(`Unsupported network: ${network}`);
    
    const networkConfig = (NETWORKS as any)[networkKey];

    if (this.signer && (typeof window !== 'undefined') && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${parseInt(networkKey).toString(16)}` }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(networkKey).toString(16)}`,
              chainName: networkConfig.name,
              rpcUrls: [networkConfig.rpc],
              nativeCurrency: { name: networkConfig.name, symbol: networkConfig.symbol, decimals: 18 },
            }],
          });
        } else {
          throw error;
        }
      }
    } else {
      this.provider = new JsonRpcProvider(networkConfig.rpc);
      if (this.signer && 'privateKey' in this.signer) {
        this.signer = new Wallet((this.signer as any).privateKey, this.provider);
      }
    }
    this.currentNetwork = network;
  }

  getCurrentNetwork(): string {
    return this.currentNetwork;
  }

  disconnect(): void {
    this.signer = null;
    this.provider = null;
  }
}

/**
 * Wallet UI Layer - orchestrates operations for components
 */
export class USDOXWallet {
  private blockchainService: BlockchainService;
  private isConnected: boolean = false;
  private walletAddress: string | null = null;

  constructor() {
    this.blockchainService = new BlockchainService();
  }

  async initializeReadOnly(network: string = 'ethereum'): Promise<void> {
    await this.blockchainService.initializeReadOnlyProvider(network);
  }

  async connectMetaMask(): Promise<string> {
    this.walletAddress = await this.blockchainService.connectMetaMask();
    this.isConnected = true;
    return this.walletAddress;
  }

  createNewWallet(): { address: string; privateKey: string; mnemonic: string } {
    const walletData = this.blockchainService.createWallet();
    return walletData;
  }

  async importWallet(privateKey: string, network: string = 'ethereum'): Promise<string> {
    this.walletAddress = await this.blockchainService.importWalletFromPrivateKey(privateKey, network);
    this.isConnected = true;
    return this.walletAddress;
  }

  async getUSDOBalance(walletAddress?: string): Promise<string> {
    return await this.blockchainService.getTokenBalance('USDOX', walletAddress);
  }

  async getTWUSDBalance(walletAddress?: string): Promise<string> {
    return await this.blockchainService.getTokenBalance('TWUSD', walletAddress);
  }

  async sendUSDO(recipientAddress: string, amount: string): Promise<string> {
    if (!this.isConnected) throw new Error('Wallet not connected');
    return await this.blockchainService.transferToken('USDOX', recipientAddress, amount);
  }

  async sendTWUSD(recipientAddress: string, amount: string): Promise<string> {
    if (!this.isConnected) throw new Error('Wallet not connected');
    return await this.blockchainService.transferToken('TWUSD', recipientAddress, amount);
  }

  async switchNetwork(network: string): Promise<void> {
    await this.blockchainService.switchNetwork(network);
  }

  getWalletStatus(): { isConnected: boolean; address: string | null; network: string } {
    return {
      isConnected: this.isConnected,
      address: this.walletAddress,
      network: this.blockchainService.getCurrentNetwork(),
    };
  }

  disconnect(): void {
    this.blockchainService.disconnect();
    this.isConnected = false;
    this.walletAddress = null;
  }
}