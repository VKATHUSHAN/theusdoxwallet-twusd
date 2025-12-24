"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function USDOXCarePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-950/90 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-16 h-16 transition-transform hover:scale-110">
                <Image 
                  src="https://raw.githubusercontent.com/theusdox/theusdoxwallet-twusd/main/wallet-app/public/usdoxcare-logo.png"
                  alt="USDOXCare Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold">USDOXCare</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Ecosystem Stewardship</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
            <Link href="/usdoxcare" className="text-white font-semibold">USDOXCare</Link>
            <Link href="/twusd-tokenomics" className="text-gray-300 hover:text-white transition">TWUSD</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24 space-y-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32">
              <Image 
                src="https://raw.githubusercontent.com/theusdox/theusdoxwallet-twusd/main/wallet-app/public/usdoxcare-logo.png"
                alt="USDOXCare Logo"
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">USDOXCare Organization</h1>
          <p className="text-xl text-gray-400">
            Transparency, Responsibility & Long-term Ecosystem Stewardship
          </p>
        </div>

        <div className="bg-linear-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-700/40">
          <p className="text-lg text-gray-300 leading-relaxed">
            USDOXCare is the organizational and responsibility initiative supporting
            the TheUSDOX ecosystem. Its mission is to promote transparency, long-term
            stability, and responsible ecosystem stewardship.
          </p>
        </div>

        <section className="space-y-6">
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-blue-700/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-3">🇨🇭</span>
              Jurisdiction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              USDOXCare operates from <strong className="text-white">Switzerland</strong>, a jurisdiction globally recognized
              for financial neutrality, governance discipline, and conservative
              reserve management traditions.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-blue-700/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-3">🏦</span>
              Reserve Principles
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-3 text-blue-400">•</span>
                <span><strong className="text-white">Capital preservation first</strong> — Conservative approach to safeguard ecosystem stability</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-400">•</span>
                <span><strong className="text-white">No speculative leverage strategies</strong> — Risk-averse management philosophy</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-400">•</span>
                <span><strong className="text-white">Clear separation of reserves and operations</strong> — Transparent fund management</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-blue-400">•</span>
                <span><strong className="text-white">Long-term ecosystem sustainability focus</strong> — Building for decades, not quarters</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-blue-700/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-3">🛡</span>
              Role & Responsibility
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              USDOXCare does not issue tokens, does not provide financial advice, and
              does not promise returns. It acts solely as a <strong className="text-white">transparency and
              responsibility steward</strong> for the ecosystem.
            </p>
            <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-200">
                <strong>Core Mandate:</strong> Ensure verifiable transparency, promote responsible governance,
                and maintain Swiss-standard operational discipline across the USDOX ecosystem.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700 mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Commitment to Transparency</h2>
          <p className="text-gray-300 text-center leading-relaxed">
            Every decision, every allocation, and every principle is documented and verifiable.
            USDOXCare operates with the understanding that <strong className="text-white">trust is earned through action, not promises</strong>.
          </p>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-500 italic">
            <strong>Legal Disclosure:</strong> USDOXCare is not a bank, investment fund, or regulated financial
            institution. All information is provided for transparency purposes only. This does not constitute
            financial, legal, or investment advice.
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
