"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, Lock, DollarSign, X, ArrowLeft, Copy, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"

const ADMIN_WALLET_ADDRESS = "8o11wa4qBX8ivTdmXUAyuvo2wTfncADNaMvvzKBcWcDe"

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
      const interval = setInterval(fetchBalance, 10000) // Refresh every 10s
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} className="object-contain" />
            <h1 className="text-xl font-bold tracking-tight">FluxBank</h1>
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
              className="text-muted-foreground hover:text-foreground"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-flux/20 bg-gradient-to-br from-flux/5 to-transparent">
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

          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">FLUX Balance</CardDescription>
              <CardTitle className="text-3xl font-bold">{fluxBalance}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">≈ ${fluxBalance}</p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Health Ratio</CardDescription>
              <CardTitle className="text-3xl font-bold text-flux">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">No active loans</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Borrow Section */}
          <Card className="border-border/40">
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
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Borrow (30%)</span>
                  <span className="font-medium text-flux">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Currently Borrowed</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={() => setShowBorrowModal(true)} className="w-full bg-flux hover:bg-flux/90 text-black">
                  Select Asset to Borrow
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">Choose which crypto to borrow</p>
              </div>
            </CardContent>
          </Card>

          {/* Staking Section */}
          <Card className="border-border/40">
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
                <Button className="w-full bg-flux hover:bg-flux/90 text-black" disabled>
                  Stake FLUX
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">Deposit FLUX to start staking</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deposit / Withdraw */}
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

        <Card className="mt-6 border-border/40">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your activity will appear here</p>
            </div>
          </CardContent>
        </Card>
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
            <CardContent className="space-y-6">
              {depositStep === 1 && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center p-4 bg-white rounded-xl">
                    <QRCodeSVG value={ADMIN_WALLET_ADDRESS} size={200} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Send FLUX to this address:</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/40">
                      <code className="text-xs font-mono break-all text-left flex-1">{ADMIN_WALLET_ADDRESS}</code>
                      <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(ADMIN_WALLET_ADDRESS)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={() => setDepositStep(2)} className="w-full bg-flux hover:bg-flux/90 text-black h-11">
                    I've Sent the Funds
                  </Button>
                </div>
              )}

              {depositStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Confirm Amount</h3>
                    <p className="text-sm text-muted-foreground">Please enter the exact amount you sent.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount Sent (FLUX)</Label>
                    <Input 
                      type="number" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="h-11 border-muted-foreground/20"
                    />
                  </div>
                  <Button 
                    onClick={handleDepositSubmit} 
                    disabled={isDepositing}
                    className="w-full bg-flux hover:bg-flux/90 text-black h-11"
                  >
                    {isDepositing ? "Submitting..." : "Done"}
                  </Button>
                </div>
              )}

              {depositStep === 3 && (
                <div className="py-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-flux/10 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-flux" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Deposit in Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Your deposit is being verified. Funds will appear on your dashboard once confirmed.
                    </p>
                  </div>
                  <Button onClick={() => { setShowDepositModal(false); setDepositStep(1); }} className="w-full variant-outline h-11">
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showBorrowModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl border-flux/20 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Select Asset to Borrow</CardTitle>
                  <CardDescription>Choose which cryptocurrency you want to borrow</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBorrowModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CRYPTO_OPTIONS.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-[1.02] text-left ${
                      selectedCrypto === crypto.symbol
                        ? "border-flux bg-flux/10"
                        : "border-border/40 bg-muted/20 hover:border-flux/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: crypto.color }}
                      >
                        {crypto.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedCrypto && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="modal-borrow-amount" className="text-sm">
                      Amount
                    </Label>
                    <Input
                      id="modal-borrow-amount"
                      type="number"
                      placeholder="0.00"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
                      className="border-muted-foreground/20 focus-visible:ring-flux"
                    />
                  </div>
                  <Button className="w-full bg-flux hover:bg-flux/90 text-black h-11" disabled>
                    Borrow {selectedCrypto}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Deposit FLUX to enable borrowing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
