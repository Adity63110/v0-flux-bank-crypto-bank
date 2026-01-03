"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Shield, Zap, Menu, LayoutDashboard, Trophy, Lock, TrendingUp, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Reveal } from "@/components/animations/Reveal"
import { DebitCardPreview } from "@/components/dashboard/DebitCardPreview"

export default function DebitCardPage() {
  const [username, setUsername] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [isSignedIn, setIsSignedIn] = useState(false)

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
          console.error("Error parsing saved user", e)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                  <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-flux/5 hover:text-flux transition-all">
                    <Trophy className="h-5 w-5" />
                    Leaderboard
                  </Link>
                  <Link href="/app" className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-flux/5 hover:text-flux transition-all">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link href="/app/borrow" className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-flux/5 hover:text-flux transition-all">
                    <Lock className="h-5 w-5" />
                    Borrow
                  </Link>
                  <Link href="/app/stake" className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-flux/5 hover:text-flux transition-all">
                    <TrendingUp className="h-5 w-5" />
                    Stake
                  </Link>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-flux/10 text-flux font-medium">
                    <Zap className="h-5 w-5" />
                    <span>Flux Card <span className="text-[10px] bg-flux/20 px-1.5 py-0.5 rounded ml-1">SOON</span></span>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} className="object-contain" />
              <h1 className="text-xl font-bold tracking-tight">FluxBank</h1>
            </div>
          </div>
          {isSignedIn && (
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
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Link href="/app" className="inline-flex items-center gap-2 text-muted-foreground hover:text-flux transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Reveal direction="up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 text-left">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-flux/10 border border-flux/20 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flux opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-flux"></span>
                </span>
                <span className="text-xs font-bold tracking-widest text-flux uppercase">Coming Soon</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Flux Debit Card</h1>
              <div className="flex items-center gap-4">
                <p className="text-xl text-muted-foreground">The bridge between Web3 and reality.</p>
                <div className="h-8 w-12 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                  <Image src="/visa-logo-color.png" alt="Visa" fill className="object-contain" />
                </div>
              </div>
            </div>
            <div className="w-full max-w-[400px]">
              <DebitCardPreview />
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-1 gap-12 items-start mb-16">
          <Reveal direction="up">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-flux">Spend your crypto like cash.</h2>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Designed for spending without selling. Use your borrowed assets or staked rewards for everyday purchases at over 100 million merchants worldwide.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { title: "Worldwide Acceptance", desc: "Pay anywhere Visa is accepted, online or in-store." },
                  { title: "Direct Liquidity", desc: "Spend directly from your FluxBank collateral or yield." },
                  { title: "Instant Sync", desc: "Real-time balance updates and push notifications." },
                  { title: "Zero Preloading", desc: "No need to top up manually. Your balance is always ready." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/20 border border-border/40">
                    <div className="h-10 w-10 rounded-xl bg-flux/10 flex items-center justify-center shrink-0 border border-flux/20">
                      <CheckCircle2 className="h-5 w-5 text-flux" />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2 font-bold text-muted-foreground/80 uppercase tracking-widest">
                    <Shield className="h-3 w-3" />
                    Security First
                  </div>
                  <p>Your card is protected by Visa's global security network and FluxBank's decentralized risk management.</p>
                </div>

                <div className="group relative">
                  <Button disabled className="w-full h-14 bg-flux/10 text-flux border border-flux/20 text-lg font-bold opacity-70">
                    Create Card
                  </Button>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
                    Feature under development.
                  </div>
                </div>
                
                <p className="text-[10px] text-muted-foreground text-center italic">
                  Card issuance is subject to regulatory approval in your jurisdiction. 
                  Initial rollout limited to specific regions.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  )
}
