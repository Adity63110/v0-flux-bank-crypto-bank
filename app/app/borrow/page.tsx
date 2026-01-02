"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowLeft, ArrowRight, Shield, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const BORROW_OPTIONS = [
  { name: "Bitcoin", symbol: "BTC", ltv: "30%", apr: "5%", logo: "/cryptos/btc.png" },
  { name: "Ethereum", symbol: "ETH", ltv: "30%", apr: "5%", logo: "/cryptos/eth.png" },
  { name: "BNB Smart Chain", symbol: "BSC", ltv: "30%", apr: "5%", logo: "/cryptos/bsc.png" },
  { name: "Solana", symbol: "SOL", ltv: "30%", apr: "5%", logo: "/cryptos/sol.png" },
  { name: "USDC", symbol: "USDC", ltv: "30%", apr: "5%", logo: "/cryptos/usdc.png" },
  { name: "USDT", symbol: "USDT", ltv: "30%", apr: "5%", logo: "/cryptos/usdt.png" },
  { name: "Tron", symbol: "TRX", ltv: "30%", apr: "5%", logo: "/cryptos/tron.png" },
  { name: "Ton", symbol: "TON", ltv: "30%", apr: "5%", logo: "/cryptos/ton.png" },
]

export default function BorrowPage() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const savedUser = localStorage.getItem("fluxbank_user")
    if (savedUser) {
      const { username: sUsername } = JSON.parse(savedUser)
      setUsername(sUsername)
    }
  }, [])

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
            <Card key={option.symbol} className="border-border/40 hover:border-flux/50 transition-all cursor-pointer group">
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
                    <span className="font-bold text-flux">Available after deposit</span>
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
