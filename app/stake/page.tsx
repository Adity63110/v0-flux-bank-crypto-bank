"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Lock, Menu, DollarSign, TrendingUp, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function StakePage() {
  const [username, setUsername] = useState("")
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("fluxbank_user")
    if (savedUser) {
      const { username: sUsername } = JSON.parse(savedUser)
      setUsername(sUsername)
      setIsSignedIn(true)
    }
  }, [])

  if (!isSignedIn) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} />
                    FluxBank
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/app" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium">
                    <Wallet className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link href="/borrow" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium">
                    <Lock className="h-5 w-5" />
                    Borrow
                  </Link>
                  <Link href="/app#deposit" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium">
                    <DollarSign className="h-5 w-5" />
                    Deposit
                  </Link>
                  <Link href="/stake" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium bg-muted">
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-center max-w-2xl">
        <Link href="/app" className="flex items-center gap-2 text-muted-foreground hover:text-flux transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Staking</CardTitle>
            <CardDescription>Earn 12.5% APR on your FLUX tokens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Staking Implementation In Progress</Label>
              <p className="text-sm text-muted-foreground">This page will handle staking rewards and lockups.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
