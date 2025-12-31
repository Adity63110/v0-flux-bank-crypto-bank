"use client"

import { useState } from "react"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, TrendingUp, Wallet, ArrowRight, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const CRYPTO_OPTIONS = [
  { name: "Bitcoin", symbol: "BTC", color: "#F7931A" },
  { name: "Ethereum", symbol: "ETH", color: "#627EEA" },
  { name: "BNB Smart Chain", symbol: "BSC", color: "#F3BA2F" },
  { name: "Solana", symbol: "SOL", color: "#14F195" },
  { name: "USDC", symbol: "USDC", color: "#2775CA" },
  { name: "USDT", symbol: "USDT", color: "#26A17B" },
  { name: "Tron", symbol: "TRX", color: "#FF0013" },
  { name: "Cardano", symbol: "ADA", color: "#0033AD" },
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

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core Features</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="border-flux/20 bg-gradient-to-br from-flux/5 to-transparent hover:shadow-lg hover:shadow-flux/10 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-flux/10 flex items-center justify-center mb-2">
                  <Lock className="h-6 w-6 text-flux" />
                </div>
                <CardTitle className="text-2xl">Borrow Any Crypto</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Borrow supported cryptocurrencies by locking Flux tokens as collateral. Borrow up to 30% of collateral
                  value.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-flux/20 bg-gradient-to-br from-flux/5 to-transparent hover:shadow-lg hover:shadow-flux/10 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-flux/10 flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-flux" />
                </div>
                <CardTitle className="text-2xl">Stake Your Flux</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Stake Flux tokens to earn yield while supporting the FluxBank ecosystem.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-flux/20 bg-gradient-to-br from-flux/5 to-transparent hover:shadow-lg hover:shadow-flux/10 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-flux/10 flex items-center justify-center mb-2">
                  <Wallet className="h-6 w-6 text-flux" />
                </div>
                <CardTitle className="text-2xl">Instant Wallet Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Sign in with a username and instantly receive a secure wallet. No seed phrase required at signup.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-flux/20 bg-gradient-to-br from-flux/5 to-transparent hover:shadow-lg hover:shadow-flux/10 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-flux/10 flex items-center justify-center mb-2">
                  <ArrowRight className="h-6 w-6 text-flux" />
                </div>
                <CardTitle className="text-2xl">Deposit & Withdraw Anytime</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Full control over your assets with fast deposits and withdrawals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

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
