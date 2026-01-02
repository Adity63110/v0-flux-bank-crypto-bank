"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowLeft, ArrowRight, Shield, Zap, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const BORROW_OPTIONS = [
  { name: "Bitcoin", symbol: "BTC", ltv: "30%", apr: "5%", logo: "/cryptos/btc.png", price: 90000 },
  { name: "Ethereum", symbol: "ETH", ltv: "30%", apr: "5%", logo: "/cryptos/eth.png", price: 3000 },
  { name: "BNB Smart Chain", symbol: "BSC", ltv: "30%", apr: "5%", logo: "/cryptos/bsc.png", price: 870 },
  { name: "Solana", symbol: "SOL", ltv: "30%", apr: "5%", logo: "/cryptos/sol.png", price: 135 },
  { name: "USDC", symbol: "USDC", ltv: "30%", apr: "5%", logo: "/cryptos/usdc.png", price: 1 },
  { name: "USDT", symbol: "USDT", ltv: "30%", apr: "5%", logo: "/cryptos/usdt.png", price: 1 },
  { name: "Tron", symbol: "TRX", ltv: "30%", apr: "5%", logo: "/cryptos/tron.png", price: 0.28 },
  { name: "Ton", symbol: "TON", ltv: "30%", apr: "5%", logo: "/cryptos/ton.png", price: 5.2 },
]

export default function BorrowPage() {
  const [username, setUsername] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<typeof BORROW_OPTIONS[0] | null>(null)
  const [step, setStep] = useState(1)
  const [borrowAmount, setBorrowAmount] = useState("")
  const [fluxBalance, setFluxBalance] = useState(0)
  
  const fluxPrice = 0.000012 
  
  const calculateMaxBorrow = (asset: typeof BORROW_OPTIONS[0]) => {
    const collateralValue = fluxBalance * fluxPrice
    const maxBorrowUSD = collateralValue * 0.30
    return maxBorrowUSD / asset.price
  }

  const fetchBalance = async (user: string) => {
    try {
      const response = await fetch(`/api/user/balance?username=${user}`)
      if (response.ok) {
        const data = await response.json()
        setFluxBalance(data.balance)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("fluxbank_user")
    if (savedUser) {
      const { username: sUsername } = JSON.parse(savedUser)
      setUsername(sUsername)
      fetchBalance(sUsername)
    }
  }, [])

  const handleSelectAsset = (asset: typeof BORROW_OPTIONS[0]) => {
    setSelectedAsset(asset)
    setStep(2)
  }

  if (step === 2 && selectedAsset) {
    const maxBorrow = calculateMaxBorrow(selectedAsset)
    
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(1)} className="hover:text-flux transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold tracking-tight">Borrow {selectedAsset.symbol}</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-flux/20 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-full border border-flux/20 overflow-hidden">
                  <Image src={selectedAsset.logo} alt={selectedAsset.name} width={40} height={40} />
                </div>
                <div>
                  <CardTitle>Calculate Borrow Amount</CardTitle>
                  <CardDescription>Using FLUX as collateral (30% LTV)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border/40">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Balance</p>
                  <p className="text-lg font-bold">{fluxBalance.toLocaleString()} FLUX</p>
                  <p className="text-sm text-flux">${(fluxBalance * fluxPrice).toLocaleString()} USD</p>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border/40">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price Info (USD)</p>
                  <p className="text-sm">FLUX: <span className="font-bold text-flux">${fluxPrice}</span></p>
                  <p className="text-sm">{selectedAsset.symbol}: <span className="font-bold text-flux">${selectedAsset.price}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label htmlFor="amount" className="text-sm font-medium">Borrow Amount ({selectedAsset.symbol})</Label>
                  <span className="text-xs text-muted-foreground">
                    Max: <span className="text-flux font-bold">{maxBorrow.toFixed(6)} {selectedAsset.symbol}</span>
                  </span>
                </div>
                <div className="relative">
                  <Input 
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={borrowAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      if (isNaN(val) || val <= maxBorrow) {
                        setBorrowAmount(e.target.value)
                      }
                    }}
                    className="text-lg h-14 pr-16 border-flux/30 focus-visible:ring-flux"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                    {selectedAsset.symbol}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-flux" />
                  Your 30% LTV is protected. You cannot borrow more than the collateral limit.
                </p>
              </div>

              <Button 
                className="w-full h-14 text-lg font-bold bg-flux hover:bg-flux/90"
                disabled={!borrowAmount || parseFloat(borrowAmount) <= 0}
              >
                Continue to Borrow
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="hover:text-flux transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} className="object-contain" />
              <h1 className="text-xl font-bold tracking-tight">Borrow Assets</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Borrow Against Your FLUX</h2>
          <p className="text-muted-foreground">Select a major cryptocurrency to borrow using your FLUX as collateral.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {BORROW_OPTIONS.map((option) => (
            <Card 
              key={option.symbol} 
              className="border-border/40 hover:border-flux/50 transition-all cursor-pointer group"
              onClick={() => handleSelectAsset(option)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-flux/20 bg-background flex items-center justify-center overflow-hidden">
                   <Image 
                     src={option.logo} 
                     alt={option.name} 
                     width={48} 
                     height={48} 
                     className="object-cover"
                   />
                </div>
                <div className="flex-1">
                  <CardTitle>{option.name}</CardTitle>
                  <CardDescription>{option.symbol}</CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-flux transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">LTV Ratio</p>
                    <p className="font-bold text-flux">{option.ltv}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Interest (APR)</p>
                    <p className="font-bold">{option.apr}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/40">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Max Borrowable</span>
                    <span className="font-bold text-flux">Select to calculate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
