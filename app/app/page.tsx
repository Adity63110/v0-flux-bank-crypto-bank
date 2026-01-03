"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, Lock, DollarSign, X, ArrowLeft, Copy, CheckCircle2, Menu, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Reveal } from "@/components/animations/Reveal"

const ADMIN_WALLET_ADDRESS = "8o11wa4qBX8ivTdmXUAyuvo2wTfncADNaMvvzKBcWcDe"

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
  const [password, setPassword] = useState("")
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositStep, setDepositStep] = useState(1)
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)

  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [borrowAmount, setBorrowAmount] = useState("")
  const [isDepositing, setIsDepositing] = useState(false)
  const [fluxBalance, setFluxBalance] = useState("0.00")
  const [fluxPrice, setFluxPrice] = useState(0.000012)
  const [transactions, setTransactions] = useState<any[]>([])

  // Fetch Flux Price
  const fetchPrice = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setFluxPrice(data.flux_price);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!username) return;
    try {
      const response = await fetch(`/api/transactions?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  // Fetch real balance
  const fetchBalance = async () => {
    if (!username) return;
    try {
      const response = await fetch(`/api/user/balance?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setFluxBalance(data.balance.toFixed(2))
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  // Persistence check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("fluxbank_user")
      if (savedUser) {
        try {
          const { username: sUsername, walletAddress: sWalletAddress } = JSON.parse(savedUser)
          setUsername(sUsername)
          setWalletAddress(sWalletAddress)
          setIsSignedIn(true)
        } catch (e) {
          localStorage.removeItem("fluxbank_user")
        }
      }
    }
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      fetchBalance()
      fetchPrice()
      fetchTransactions()
      const interval = setInterval(() => {
        fetchBalance()
        fetchPrice()
        fetchTransactions()
      }, 10000) // Refresh every 10s
      return () => clearInterval(interval)
    }
  }, [isSignedIn, username])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && password.trim()) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to login');
        }
        
        setWalletAddress(data.wallet_address)
        setIsSignedIn(true)
        
        // Save to localStorage
        localStorage.setItem("fluxbank_user", JSON.stringify({
          username: data.username,
          walletAddress: data.wallet_address
        }))
      } catch (error: any) {
        console.error('Login failed:', error);
        alert(`Authentication failed: ${error.message}`);
      }
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("fluxbank_user")
    setIsSignedIn(false)
    setUsername("")
    setPassword("")
    setWalletAddress("")
  }

  const handleDepositSubmit = async () => {
    if (!depositAmount || isNaN(parseFloat(depositAmount))) return;
    
    setIsDepositing(true)
    try {
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, amount: depositAmount }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit deposit');
      
      setDepositStep(3)
    } catch (error: any) {
      alert(`Deposit failed: ${error.message}`);
    } finally {
      setIsDepositing(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-flux transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <Reveal direction="up">
          <Card className="w-full max-w-md border-flux/20 shadow-lg shadow-flux/5">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex justify-center mb-2">
                <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={48} height={48} className="object-contain" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">FluxBank</CardTitle>
              <CardDescription className="text-base">Your decentralized crypto bank</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 border-muted-foreground/20 focus-visible:ring-flux"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-muted-foreground/20 focus-visible:ring-flux"
                    required
                  />
                  <p className="text-xs text-muted-foreground">{"A new wallet will be created if this is your first visit"}</p>
                </div>
                <Button type="submit" className="w-full h-11 bg-flux hover:bg-flux/90 text-black font-medium">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-flux/10 hover:text-flux">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r-flux/20 bg-background/95 backdrop-blur-xl">
                <SheetHeader className="pb-8 pt-4">
                  <div className="flex items-center gap-2">
                    <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} />
                    <SheetTitle className="text-xl font-bold tracking-tight">FluxBank</SheetTitle>
                  </div>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  <Link 
                    href="/app" 
                    className="flex items-center gap-3 p-3 rounded-xl bg-flux/10 text-flux font-medium"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/app/borrow"
                    className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-flux/5 hover:text-flux transition-all"
                  >
                    <Lock className="h-5 w-5" />
                    Borrow
                  </Link>
                  <Link 
                    href="/app/stake"
                    className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-flux/5 hover:text-flux transition-all"
                  >
                    <TrendingUp className="h-5 w-5" />
                    Stake
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} className="object-contain" />
              <h1 className="text-xl font-bold tracking-tight">FluxBank</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end gap-0.5">
              <span className="text-xs text-muted-foreground">@{username}</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/40">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono text-muted-foreground">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="relative group p-4 rounded-full border border-flux/20 bg-flux/5 hover:bg-flux/10 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full border border-flux/40 animate-pulse group-hover:animate-none opacity-50" />
              <span className="relative z-10 text-muted-foreground group-hover:text-flux font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Reveal direction="left">
            <Card className="border-flux/20 bg-gradient-to-br from-flux/5 to-transparent h-full">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Wallet</CardDescription>
                <CardTitle className="text-2xl font-bold">@{username}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono">
                  {walletAddress.slice(0, 12)}...{walletAddress.slice(-6)}
                </p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">FLUX Balance</CardDescription>
                <CardTitle className="text-3xl font-bold">{fluxBalance}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">≈ ${(parseFloat(fluxBalance) * fluxPrice).toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}</p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal direction="right" delay={200}>
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Health Ratio</CardDescription>
                <CardTitle className="text-3xl font-bold text-flux">Healthy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">No active loans</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Borrow Section */}
          <Reveal direction="left">
            <Card className="border-border/40 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-flux/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-flux" />
                  </div>
                  <div>
                    <CardTitle>Borrow</CardTitle>
                    <CardDescription>Use FLUX as collateral (30% LTV)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Collateral Value</span>
                    <span className="font-medium">${(parseFloat(fluxBalance) * fluxPrice).toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Borrow (30%)</span>
                    <span className="font-medium text-flux">${(parseFloat(fluxBalance) * fluxPrice * 0.3).toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Currently Borrowed</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/app/borrow">
                    <Button className="w-full bg-flux hover:bg-flux/90 text-black">
                      Select Asset to Borrow
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-2">Choose which crypto to borrow</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Staking Section */}
          <Reveal direction="right">
            <Card className="border-border/40 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-flux/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-flux" />
                  </div>
                  <div>
                    <CardTitle>Staking</CardTitle>
                    <CardDescription>Earn 12.5% APR</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Staked Amount</span>
                    <span className="font-medium">0 FLUX</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Rewards</span>
                    <span className="font-medium text-flux">0 FLUX/day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">APR</span>
                    <span className="font-medium">12.5%</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/app/stake">
                    <Button className="w-full bg-flux hover:bg-flux/90 text-black">
                      Stake FLUX
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-2">Earn up to 12.5% APR</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Deposit / Withdraw */}
        <Reveal direction="up">
          <Card className="mt-6 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-flux/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-flux" />
                </div>
                <div>
                  <CardTitle>Deposit & Withdraw</CardTitle>
                  <CardDescription>Manage your FLUX tokens</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deposit" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>
                <TabsContent value="deposit" className="space-y-4 pt-4">
                  <div className="max-w-md space-y-3">
                    <Label htmlFor="deposit-amount">Amount (FLUX)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="border-muted-foreground/20 focus-visible:ring-flux"
                      />
                      <Button 
                        onClick={() => setShowDepositModal(true)}
                        className="bg-flux hover:bg-flux/90 text-black px-6"
                      >
                        <ArrowDownLeft className="h-4 w-4 mr-1" />
                        Deposit
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="withdraw" className="space-y-4 pt-4">
                  <div className="max-w-md space-y-3">
                    <Label htmlFor="withdraw-amount">Amount (FLUX)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="border-muted-foreground/20 focus-visible:ring-flux"
                      />
                      <Button disabled className="bg-flux hover:bg-flux/90 text-black px-6">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Withdraw
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Available: 0.00 FLUX</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <Card className="mt-6 border-border/40">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx, i) => (
                    <Reveal key={tx.id} direction="up" delay={i * 50}>
                      <div className="flex items-center justify-between p-3 border border-border/40 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            tx.type === 'deposit' ? 'bg-flux/10 text-flux' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {tx.type === 'deposit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-semibold capitalize">{tx.type}</div>
                            <div className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{tx.amount} {tx.asset}</div>
                          <div className={`text-xs ${
                            tx.status === 'pending' ? 'text-amber-500' : tx.status === 'approved' ? 'text-flux' : 'text-red-500'
                          }`}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No transactions yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Your activity will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md border-flux/20 shadow-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Deposit FLUX</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => { setShowDepositModal(false); setDepositStep(1); }}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            {/* Modal content remains same... */}
          </Card>
        </div>
      )}
    </div>
  )
}
