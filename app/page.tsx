"use client"

import { useState, useEffect } from "react"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Wallet, Shield, Zap, TrendingUp, ChevronRight, Menu, Smartphone, Globe, Copy, Check, Users, HelpCircle, ChevronDown, Lock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"
import { FutureAmbitions } from "@/components/future/FutureAmbitions"
import { RecentTransactions } from "@/components/RecentTransactions"
import { DebitCardPreview } from "@/components/dashboard/DebitCardPreview"

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
  const [isFutureOpen, setIsFutureOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"signin" | "signup" | null>(null)

  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [borrowAmount, setBorrowAmount] = useState("")

  const [caAddress, setCaAddress] = useState("8o11wa4qBX8ivTdmXUAyuvo2wTfncADNaMvvzKBcWcDe")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.ca_contract_address) {
          setCaAddress(data.ca_contract_address)
        }
      })
      .catch(err => console.error("Failed to fetch CA:", err))
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
            <div className="flex items-center gap-2 flex-1">
              <Image
                src="/fluxbank-logo.png"
                alt="Flux Logo"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_8px_rgba(84,210,146,0.4)]"
              />
              <h1 className="text-2xl font-bold tracking-tight">Flux</h1>
            </div>
              <div className="flex items-center gap-6 flex-1 justify-center">
                <button 
                  onClick={() => setIsFutureOpen(true)}
                  className="text-sm font-medium text-white hover:text-flux transition-colors cursor-pointer"
                >
                  Future
                </button>
                <Link
                  href="/tokenomics"
                  className="text-sm font-medium text-white hover:text-flux transition-colors cursor-pointer"
                >
                  Tokenomics
                </Link>
                <button 
                  onClick={() => {
                    const faqSection = document.getElementById('faq-section');
                    faqSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-white hover:text-flux transition-colors cursor-pointer"
                >
                  FAQ
                </button>
                <Link
                  href="/leaderboard"
                  className="text-sm font-medium text-white hover:text-flux transition-colors cursor-pointer"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/app/card"
                  className="text-sm font-medium text-white hover:text-flux transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  Card
                </Link>
              </div>
            <div className="flex items-center gap-3 flex-1 justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  className="relative group p-4 rounded-full border border-flux/20 bg-flux/5 hover:bg-flux/10 transition-all duration-300 shadow-[0_0_15px_rgba(84,210,146,0.2)] hover:shadow-[0_0_25px_rgba(84,210,146,0.4)]"
                >
                  <div className="absolute inset-0 rounded-full border border-flux/40 animate-pulse group-hover:animate-none opacity-50" />
                  <span className="relative z-10 text-muted-foreground group-hover:text-flux font-medium">Sign In</span>
                </Button>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Reveal direction="up" delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-flux/10 border border-flux/20 mb-4 animate-fade-in">
                <Zap className="h-4 w-4 text-flux" />
                <span className="text-sm font-medium text-flux">Powered by Flux</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance animate-gradient-reveal">
                The Future of <br />
                <span className="text-flux animate-glow-pulse">Banking is Web3</span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance animate-slide-up-fade">
                Decentralized banking without intermediaries. Borrow, stake, and govern your finances directly on the
                Solana blockchain.
              </p>
            </Reveal>

            <Reveal direction="up" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-delay">
                  <Button
                    size="lg"
                    onClick={() => setShowAuthModal(true)}
                    className="bg-flux hover:bg-flux/90 text-black text-lg px-8 h-14 shadow-lg shadow-flux/20 hover:shadow-flux/40 transition-all duration-300 hover:scale-105"
                  >
                    Enter FluxBank
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsFutureOpen(true)}
                  className="border-flux/20 text-lg px-8 h-14 hover:bg-flux/5 bg-transparent hover:border-flux/40 transition-all duration-300"
                >
                  Future Ambitions
                </Button>
              </div>
            </Reveal>

            {/* CA Section */}
            <Reveal direction="up" delay={500}>
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-3">
                <div className="flex items-center justify-center gap-2">
                   <Zap className="h-3 w-3 text-flux" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Official Contract Address</span>
                </div>
                <div className="relative group">
                  <div className="p-3 rounded-xl bg-background border border-flux/20 font-mono text-xs break-all pr-12 text-muted-foreground group-hover:border-flux/40 transition-colors">
                    {caAddress}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-muted hover:bg-flux hover:text-black transition-all"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Social Links Section */}
            <Reveal direction="up" delay={600}>
              <div className="flex flex-col items-center gap-4 mt-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  Follow FluxBank. Build with us.
                </p>
                <div className="flex items-center gap-4">
                  <Link 
                    href="https://x.com/fluxbank_sol" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-full bg-background/40 backdrop-blur-md border border-flux/20 hover:border-flux/50 hover:bg-flux/5 transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(84,210,146,0.1)] hover:shadow-[0_0_20px_rgba(84,210,146,0.3)]"
                    title="Follow FluxBank on X"
                  >
                    <svg className="h-5 w-5 fill-flux group-hover:fill-flux transition-colors" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-flux/20">
                      Follow FluxBank on X
                    </div>
                  </Link>

                  <Link 
                    href="https://t.me/fluxbank_sol" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-full bg-background/40 backdrop-blur-md border border-flux/20 hover:border-flux/50 hover:bg-flux/5 transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(84,210,146,0.1)] hover:shadow-[0_0_20px_rgba(84,210,146,0.3)]"
                    title="Join the FluxBank Telegram"
                  >
                    <svg className="h-5 w-5 fill-flux group-hover:fill-flux transition-colors" viewBox="0 0 24 24">
                      <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 6.6 5.344 11.944 11.944 11.944 6.6 0 11.944-5.344 11.944-11.944C23.888 5.344 18.544 0 11.944 0zM17.44 8.087l-1.898 8.948c-.143.642-.524.801-1.063.498l-2.894-2.133-1.397 1.344c-.154.154-.284.284-.582.284l.208-2.942 5.357-4.839c.233-.208-.051-.323-.362-.116L8.144 12.15l-2.852-.892c-.62-.194-.632-.62.129-.916l11.144-4.3c.516-.187.967.121.875 1.045z" />
                    </svg>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-flux/20">
                      Join the FluxBank Telegram
                    </div>
                  </Link>

                  <Link 
                    href="https://github.com/Adity63110/v0-flux-bank-crypto-bank" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-full bg-background/40 backdrop-blur-md border border-flux/20 hover:border-flux/50 hover:bg-flux/5 transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(84,210,146,0.1)] hover:shadow-[0_0_20px_rgba(84,210,146,0.3)]"
                    title="View FluxBank on GitHub"
                  >
                    <svg className="h-5 w-5 fill-flux group-hover:fill-flux transition-colors" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-flux/20">
                      View FluxBank on GitHub
                    </div>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-12">
            <Reveal direction="up">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h3 className="text-flux font-semibold uppercase tracking-widest text-sm">A New Kind of Crypto Bank</h3>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight">About FluxBank</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    FluxBank is a next-generation crypto bank that lets users unlock liquidity without selling their assets. By using Flux as collateral, users can borrow across major blockchains while keeping full visibility and control.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-8">
                  {[
                    {
                      title: "Why FluxBank",
                      items: [
                        "Borrow without selling",
                        "Transparent, price-aware limits",
                        "Built like a bank, powered by crypto"
                      ],
                      direction: "left"
                    },
                    {
                      title: "How It Works",
                      items: [
                        "Sign up and receive an instant FluxBank",
                        "Deposit Flux as collateral",
                        "Borrow supported assets instantly",
                        "Recorded securely on chain"
                      ],
                      direction: "up"
                    },
                    {
                      title: "What Makes It Different",
                      items: [
                        "Bank-style UX, not DeFi chaos",
                        "Unified transaction history",
                        "Manual + automated safety checks"
                      ],
                      direction: "right"
                    }
                  ].map((block, i) => (
                    <Reveal key={i} direction={block.direction as any} delay={i * 100}>
                      <div className="group p-8 rounded-2xl bg-muted/20 border border-border/50 hover:border-flux/50 hover:bg-flux/5 transition-all duration-300 cursor-default text-left h-full">
                        <h4 className="text-xl font-bold mb-4 group-hover:text-flux transition-colors">{block.title}</h4>
                        <ul className="space-y-3">
                          {block.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-muted-foreground text-sm leading-tight">
                              <div className="h-1.5 w-1.5 rounded-full bg-flux/50 mt-1.5 group-hover:bg-flux shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
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
                  {["BTC", "BNB (BSC)", "USDT", "USDC", "TON", "TRON", "SOLANA"].map((asset, i) => (
                    <Reveal key={asset} direction="up" delay={i * 50}>
                      <span className="px-3 py-1.5 rounded-full bg-flux/10 border border-flux/20 text-flux text-xs font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(84,210,146,0.1)]">
                        {asset}
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
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
                  <div className="z-10 h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-flux bg-background flex items-center justify-center shadow-[0_0_40px_rgba(84,210,146,0.3)] animate-pulse">
                    <Image src="/fluxbank-logo.png" alt="Flux" width={48} height={48} className="object-contain" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <style jsx>{`
            @keyframes float {
              from { transform: translate(-50%, -40%); }
              to { transform: translate(-50%, -60%); }
            }
          `}</style>
        </section>

        <section className="container mx-auto px-4 py-24 relative overflow-hidden">
          <Reveal direction="up">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-flux/10 via-background to-background border border-flux/20 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-flux/10 blur-[100px] rounded-full -mr-32 -mt-32" />
              
              <div className="flex-1 space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-flux/10 border border-flux/20">
                  <Zap className="h-4 w-4 text-flux" />
                  <span className="text-xs font-bold tracking-widest text-flux uppercase">Coming Soon</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Meet the Flux Card</h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Spend your crypto directly from your FluxBank account at over 100M merchants worldwide. The ultimate bridge between Web3 and reality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-flux hover:bg-flux/90 text-black px-8 h-14 font-bold rounded-2xl shadow-lg shadow-flux/20"
                  >
                    Explore Flux Card
                  </Button>
                  <div className="h-14 w-20 relative grayscale opacity-40">
                    <Image src="/visa-logo-color.png" alt="Visa" fill className="object-contain" />
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[400px] relative z-10">
                <DebitCardPreview username={username} />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="container mx-auto px-4 py-24 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <Reveal direction="left">
              <div className="space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-flux/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-background/40 backdrop-blur-xl border border-flux/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-flux/20 transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-flux/10 flex items-center justify-center border border-flux/20">
                        <Users className="h-6 w-6 text-flux" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Growth Analytics</p>
                        <h3 className="text-xl font-bold">FluxBank Global Reach</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Total Accounts Registered</p>
                      <div className="text-5xl md:text-6xl font-bold tracking-tight text-flux drop-shadow-[0_0_15px_rgba(84,210,146,0.3)]">
                        53+
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border/40 flex items-center justify-between">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                            <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="User" width={40} height={40} />
                          </div>
                        ))}
                        <div className="h-10 w-10 rounded-full border-2 border-background bg-flux/20 flex items-center justify-center text-[10px] font-bold text-flux">
                          +10
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-flux/80">
                        <span className="h-2 w-2 rounded-full bg-flux animate-pulse" />
                        Live Network Data
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Reveal direction="up" delay={100}>
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="text-flux font-bold text-2xl mb-1">$2.8k+</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Value Locked</div>
                    </div>
                  </Reveal>
                  <Reveal direction="up" delay={200}>
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="text-flux font-bold text-2xl mb-1">99.9%</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Uptime Reliability</div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div id="faq-section" className="space-y-8 scroll-mt-24">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flux/10 border border-flux/20">
                    <HelpCircle className="h-4 w-4 text-flux" />
                    <span className="text-xs font-semibold text-flux uppercase tracking-wider">Transparency</span>
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">Common Questions</h2>
                  <p className="text-muted-foreground">Everything you need to know about the next generation of banking.</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                  {[
                    {
                      q: "What is FluxBank and how does it work?",
                      a: "FluxBank is a crypto-powered digital bank that allows users to deposit assets and borrow against them securely. Each user receives a dedicated FluxBank, and all balances, limits, and transactions are tracked using blockchain data and internal risk controls."
                    },
                    {
                      q: "Do I need to connect an external wallet to use FluxBank?",
                      a: "No. FluxBank automatically creates a secure FluxBank for every user at signup, enabling instant access without wallet connections."
                    },
                    {
                      q: "Which cryptocurrencies are supported?",
                      a: "FluxBank supports major assets including Bitcoin (BTC), Binance Smart Chain (BNB), USDT, USDC, TON, TRON, and Solana. More assets will be added over time."
                    },
                    {
                      q: "How are borrow limits calculated?",
                      a: "Borrow limits are dynamically calculated based on collateral value, real-time market prices, volatility, and platform risk parameters."
                    },
                    {
                      q: "Are my funds safe on FluxBank?",
                      a: "Security is a top priority. FluxBank uses internal custody controls, transaction monitoring, and approval layers for sensitive actions."
                    },
                    {
                      q: "Are deposits, borrows, and withdrawals instant?",
                      a: "Deposits reflect after blockchain confirmation. Borrow and withdrawal requests are reviewed before final approval for platform safety."
                    }
                  ].map((item, i) => (
                    <Reveal key={i} direction="up" delay={i * 50}>
                      <AccordionItem 
                        value={`item-${i}`}
                        className="border border-border/50 rounded-2xl px-6 bg-muted/20 data-[state=open]:border-flux/50 data-[state=open]:bg-flux/5 transition-all duration-300"
                      >
                        <AccordionTrigger className="hover:no-underline py-5 text-left text-base font-semibold data-[state=open]:text-flux">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    </Reveal>
                  ))}
                </Accordion>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core Features</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-10 w-10 text-flux" />,
                title: "Instant Liquidity",
                description: "Borrow against your assets instantly without any wait times or approvals.",
                direction: "left"
              },
              {
                icon: <Shield className="h-10 w-10 text-flux" />,
                title: "Secure & Private",
                description: "No KYC required. Maintain full control of your keys and your privacy.",
                direction: "up"
              },
              {
                icon: <ArrowRight className="h-10 w-10 text-flux" />,
                title: "Multi-Chain Support",
                description: "Borrow BTC, ETH, SOL, and more using Flux as your primary collateral.",
                direction: "right"
              }
            ].map((feature, i) => (
              <Reveal key={i} direction={feature.direction as any} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 space-y-4 h-full">
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <RecentTransactions />

        <section className="container mx-auto px-4 py-20 text-center">
          <Reveal direction="up">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Trust & Speed</h2>
              <p className="text-xl text-muted-foreground mb-8">No KYC. Non-custodial. Built for speed and simplicity.</p>
                <Button
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-flux hover:bg-flux/90 text-black text-lg px-8 h-14 shadow-lg shadow-flux/20"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </Reveal>
        </section>

        {/* Auth Choice Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="max-w-md w-full border-flux/20 bg-muted/20 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-flux/10 flex items-center justify-center border border-flux/20 shadow-[0_0_20px_rgba(84,210,146,0.2)]">
                    <Image src="/fluxbank-logo.png" alt="Flux Logo" width={40} height={40} />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">Welcome to FluxBank</CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 mt-2">
                  Choose how you want to continue your journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <Link href="/app" className="w-full">
                    <Button 
                      className="w-full h-16 bg-flux hover:bg-flux/90 text-black font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-flux/20"
                      onClick={() => setShowAuthModal(false)}
                    >
                      <Users className="mr-3 h-5 w-5" />
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/app" className="w-full">
                    <Button 
                      variant="outline"
                      className="w-full h-16 border-flux/20 bg-transparent hover:bg-flux/5 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-flux/40"
                      onClick={() => setShowAuthModal(false)}
                    >
                      <Lock className="mr-3 h-5 w-5 text-flux" />
                      Sign In
                    </Button>
                  </Link>
                </div>
                <div className="pt-4">
                  <Button 
                    variant="ghost" 
                    className="w-full text-muted-foreground hover:text-white"
                    onClick={() => setShowAuthModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

        <FutureAmbitions 
          isOpen={isFutureOpen} 
          onClose={() => setIsFutureOpen(false)} 
        />
      </div>
    </div>
  )
}
