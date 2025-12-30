"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TWUSDTokenomicsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-950/90 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-16 h-16 transition-transform hover:scale-110">
                <Image 
                  src="https://raw.githubusercontent.com/theusdox/theusdoxwallet-twusd/main/wallet-app/public/TWUSD-logo.png"
                  alt="TWUSD Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold">TWUSD</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Wrapped Dollar</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
            <Link href="/usdoxcare" className="text-gray-300 hover:text-white transition">USDOXCare</Link>
            <Link href="/twusd-tokenomics" className="text-white font-semibold">TWUSD</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24 space-y-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image 
              src="https://raw.githubusercontent.com/theusdox/theusdoxwallet-twusd/main/wallet-app/public/TWUSD-logo.png"
              alt="TWUSD Logo"
              width={128}
              height={128}
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TWUSD Tokenomics</h1>
          <p className="text-xl text-gray-400">
            Ethereum-Native Wrapped Dollar for DeFi
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-8 border border-yellow-700/40">
          <p className="text-lg text-gray-300 leading-relaxed">
            TWUSD is the Ethereum-native wrapped dollar of the TheUSDOX ecosystem,
            designed for <strong className="text-white">predictable DeFi utility and transparent behavior</strong>.
          </p>
        </div>

        <section className="space-y-6">
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-yellow-700/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-3">🔗</span>
              Token Overview
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Name:</span>
                <span className="font-semibold">TheUSDOX Wrapped Dollar</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Symbol:</span>
                <span className="font-semibold">TWUSD</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Network:</span>
                <span className="font-semibold">Ethereum Mainnet</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Standard:</span>
                <span className="font-semibold">ERC-20</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Decimals:</span>
                <span className="font-semibold text-yellow-400">6</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Total Supply:</span>
                <span className="font-semibold">33,200,000,000</span>
              </div>
              <div className="flex flex-col py-2">
                <span className="text-gray-400 mb-2">Contract:</span>
                <code className="font-mono text-sm bg-gray-800 p-3 rounded border border-gray-700 break-all">
                  0x7BeB51807E3c8BdB10A2868bD51c2D9E1764925D
                </code>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-yellow-700/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-3">🎯</span>
              Purpose
            </h2>
            <p className="text-gray-300 leading-relaxed">
              TWUSD exists to enable <strong className="text-white">swaps, liquidity pools, and smart contract
              interactions</strong> across Ethereum-based DeFi protocols. It is a <strong className="text-white">utility
              token</strong>, not a governance or yield-bearing asset.
            </p>
            <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-200">
                <strong>Core Use Case:</strong> Facilitate on-chain transactions and DeFi integrations with
                predictable, verifiable behavior.
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-yellow-700/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-3">🧮</span>
              Supply Design
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">✓</span>
                <span><strong className="text-white">Declared and transparent supply</strong> — Total supply is fixed and publicly verifiable</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">✓</span>
                <span><strong className="text-white">No rebasing mechanisms</strong> — Token balance remains stable</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">✓</span>
                <span><strong className="text-white">No elastic or algorithmic minting</strong> — Supply is predetermined</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-yellow-400">✓</span>
                <span><strong className="text-white">No hidden transfer taxes</strong> — Standard ERC-20 behavior</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-blue-700/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-3">🔍</span>
              Transparency
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All contract interactions are publicly verifiable on Ethereum. View the contract on{' '}
              <a 
                href="https://etherscan.io/token/0x7BeB51807E3c8BdB10A2868bD51c2D9E1764925D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Etherscan
              </a>.
            </p>
          </div>
        </section>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700 mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Design Philosophy</h2>
          <p className="text-gray-300 text-center leading-relaxed">
            TWUSD follows the principle that <strong className="text-white">simpler systems fail less</strong>. 
            No complex mechanisms, no surprises — just transparent, predictable behavior.
          </p>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-500 italic">
            <strong>Risk Disclosure:</strong> TWUSD does not represent ownership, equity, or a promise of returns.
            Always verify contract addresses and understand DeFi risks. This is not financial advice.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              © {new Date().getFullYear()} USDOX Ecosystem. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition">About</Link>
              <Link href="/usdoxcare" className="text-gray-400 hover:text-white transition">USDOXCare</Link>
              <Link href="/twusd-tokenomics" className="text-gray-400 hover:text-white transition">TWUSD</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
