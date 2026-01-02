"use client"

import { useState } from "react"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, TrendingUp, Wallet, ArrowRight, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const CRYPTO_OPTIONS = [
  { name: "Bitcoin", symbol: "BTC", color: "#F7931A", logo: "/cryptos/btc.png" },
  { name: "Ethereum", symbol: "ETH", color: "#627EEA", logo: "/cryptos/eth.png" },
  { name: "BNB Smart Chain", symbol: "BSC", color: "#F3BA2F", logo: "/cryptos/bsc.png" },
  { name: "Solana", symbol: "SOL", color: "#14F195", logo: "/cryptos/sol.png" },
  { name: "USDC", symbol: "USDC", color: "#2775CA", logo: "/cryptos/usdc.png" },
  { name: "USDT", symbol: "USDT", color: "#26A17B", logo: "/cryptos/usdt.png" },
  { name: "Tron", symbol: "TRX", color: "#FF0013", logo: "/cryptos/tron.png" },
  { name: "Ton", symbol: "TON", color: "#0088CC", logo: "/cryptos/ton.png" },
]

export default function FluxBank() {
  const [username, setUsername] = useState("")
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)

  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [borrowAmount, setBorrowAmount] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        
        if (!response.ok) throw new Error('Failed to login');
        
        const data = await response.json();
        setWalletAddress(data.wallet_address)
        setIsSignedIn(true)
      } catch (error) {
        console.error('Login failed:', error);
        alert('Authentication failed. Please check your connection.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-flux/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-flux/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/fluxbank-logo.png"
                alt="FluxBank Logo"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_8px_rgba(84,210,146,0.4)]"
              />
              <h1 className="text-2xl font-bold tracking-tight">FluxBank</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-flux/10 border border-flux/20 mb-4 animate-fade-in">
              <Zap className="h-4 w-4 text-flux" />
              <span className="text-sm font-medium text-flux">Powered by Flux</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance animate-gradient-reveal">
              The Future of <br />
              <span className="text-flux animate-glow-pulse">Banking is Web3</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance animate-slide-up-fade">
              Decentralized banking without intermediaries. Borrow, stake, and govern your finances directly on the
              Solana blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-delay">
              <Link href="/app">
                <Button
                  size="lg"
                  className="bg-flux hover:bg-flux/90 text-black text-lg px-8 h-14 shadow-lg shadow-flux/20 hover:shadow-flux/40 transition-all duration-300 hover:scale-105"
                >
                  Enter FluxBank
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-flux/20 text-lg px-8 h-14 hover:bg-flux/5 bg-transparent hover:border-flux/40 transition-all duration-300"
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </section>
        {/* </CHANGE> */}

        </section>

        {/* Specialty Section */}
        <section className="container mx-auto px-4 py-20 bg-muted/30 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Borrow Any Major Crypto <br />
                <span className="text-flux">with Flux</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Use your Flux tokens as collateral to unlock liquidity across the entire crypto ecosystem. 
                Borrow seamlessly without selling your assets.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["BTC", "BNB (BSC)", "USDT", "USDC", "TON", "TRON", "SOLANA"].map((asset) => (
                  <span 
                    key={asset} 
                    className="px-3 py-1.5 rounded-full bg-flux/10 border border-flux/20 text-flux text-xs font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(84,210,146,0.1)]"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-flux/5 rounded-full blur-3xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                {CRYPTO_OPTIONS.filter(c => ["BTC", "ETH", "BSC", "SOL", "USDC", "USDT", "TRX", "TON"].includes(c.symbol)).map((crypto, i) => (
                  <div
                    key={crypto.symbol}
                    className="absolute transition-all duration-[3000ms] ease-in-out hover:scale-110"
                    style={{
                      animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                      left: `${50 + 35 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                      top: `${50 + 35 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div 
                      className="h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-flux/30 bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(84,210,146,0.2)] hover:shadow-[0_0_30px_rgba(84,210,146,0.4)] hover:border-flux transition-all cursor-pointer overflow-hidden"
                    >
                      {crypto.logo ? (
                        <Image
                          src={crypto.logo}
                          alt={crypto.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="font-bold text-xs text-flux">{crypto.symbol}</div>
                      )}
                    </div>
                  </div>
                ))}
                {/* Center Flux Logo */}
                <div className="z-10 h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-flux bg-background flex items-center justify-center shadow-[0_0_40px_rgba(84,210,146,0.3)] animate-pulse">
                  <Image src="/fluxbank-logo.png" alt="Flux" width={48} height={48} className="object-contain" />
                </div>
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes float {
              from { transform: translate(-50%, -40%); }
              to { transform: translate(-50%, -60%); }
            }
          `}</style>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core Features</h2>

        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Trust & Speed</h2>
            <p className="text-xl text-muted-foreground mb-8">No KYC. Non-custodial. Built for speed and simplicity.</p>
            <Link href="/app">
              <Button
                size="lg"
                className="bg-flux hover:bg-flux/90 text-black text-lg px-8 h-14 shadow-lg shadow-flux/20"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <footer className="border-t border-border/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} className="object-contain" />
                <span className="font-semibold">FluxBank</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <Link href="/app" className="hover:text-flux transition-colors">
                  App
                </Link>
                <Link href="#" className="hover:text-flux transition-colors">
                  Docs
                </Link>
                <Link href="#" className="hover:text-flux transition-colors">
                  Terms
                </Link>
                <Link href="#" className="hover:text-flux transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="hover:text-flux transition-colors">
                  Telegram
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
