"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Zap, Lock, Info, TrendingUp, Wallet, Shield, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StakingPage() {
  const [username, setUsername] = useState("")
  const [fluxBalance, setFluxBalance] = useState(0)
  const [stakedBalance, setStakedBalance] = useState(0)
  const [pendingRewards, setPendingRewards] = useState(0)
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")
  const [lockPeriod, setLockPeriod] = useState("1week")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("stake")
  const [stakingHistory, setStakingHistory] = useState<any[]>([])

  const estimatedAPY = "12.5%"
  const unstakingPeriod = "7 Days"

  const fetchUserData = async (user: string) => {
    if (!user) return
    try {
      const [balanceRes, historyRes] = await Promise.all([
        fetch(`/api/user/balance?username=${encodeURIComponent(user)}`),
        fetch(`/api/stake?username=${encodeURIComponent(user)}`)
      ])
      
      if (balanceRes.ok) {
        const data = await balanceRes.json()
        setFluxBalance(data.balance || 0)
        setStakedBalance(data.staked_balance || 0)
        setPendingRewards(data.pending_rewards || 0)
      }

      if (historyRes.ok) {
        const data = await historyRes.json()
        setStakingHistory(data.history || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("fluxbank_user")
    if (savedUser) {
      const { username: sUsername } = JSON.parse(savedUser)
      setUsername(sUsername)
      fetchUserData(sUsername)
    }
  }, [])

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return
    setIsSubmitting(true)
    try {
      const savedUser = localStorage.getItem("fluxbank_user")
      const currentUser = savedUser ? JSON.parse(savedUser).username : username
      
      const response = await fetch("/api/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser,
          amount: stakeAmount,
          type: "stake",
          lock_period: lockPeriod
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("Staking request submitted successfully!")
        setStakeAmount("")
        fetchUserData(currentUser)
      } else {
        throw new Error(data.error || "Failed to stake")
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return
    setIsSubmitting(true)
    try {
      const savedUser = localStorage.getItem("fluxbank_user")
      const currentUser = savedUser ? JSON.parse(savedUser).username : username

      const response = await fetch("/api/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser,
          amount: unstakeAmount,
          type: "unstake"
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("Unstaking request submitted! Please wait for the cooldown period.")
        setUnstakeAmount("")
        fetchUserData(currentUser)
      } else {
        throw new Error(data.error || "Failed to unstake")
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="hover:text-flux transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} />
              <h1 className="text-xl font-bold tracking-tight text-flux">Stake FLUX</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Staking Summary Card */}
        <Card className="relative overflow-hidden border-flux/20 bg-card/40 backdrop-blur-xl shadow-2xl group transition-all hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-flux/5 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-flux/10 rounded-full blur-[80px] group-hover:bg-flux/20 transition-all" />
          
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-flux" />
              Staking Overview
            </CardTitle>
            <CardDescription>Maximize your FLUX holdings with decentralized staking</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Balance</p>
                <p className="text-xl font-bold">{fluxBalance.toLocaleString()} FLUX</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Staked Flux</p>
                <p className="text-xl font-bold text-flux">{stakedBalance.toLocaleString()} FLUX</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated APY</p>
                <p className="text-xl font-bold text-[#54d292]">{estimatedAPY}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending Rewards</p>
                <p className="text-xl font-bold text-[#54d292]">{pendingRewards.toLocaleString()} FLUX</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Unstaking Period: <span className="text-foreground font-medium">{unstakingPeriod}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#54d292]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#54d292] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#54d292]"></span>
                </span>
                Live Rewards Active
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staking Actions */}
        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="stake" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50 p-1 rounded-xl mb-8">
              <TabsTrigger value="stake" className="rounded-lg text-lg data-[state=active]:bg-flux data-[state=active]:text-black">
                Stake
              </TabsTrigger>
              <TabsTrigger value="unstake" className="rounded-lg text-lg data-[state=active]:bg-flux data-[state=active]:text-black">
                Unstake
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stake">
              <Card className="border-flux/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Stake FLUX</CardTitle>
                  <CardDescription>Enter the amount of FLUX you wish to stake to earn rewards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <Label htmlFor="stake-amount" className="text-sm font-medium">Amount to Stake</Label>
                      <button 
                        onClick={() => setStakeAmount(fluxBalance.toString())}
                        className="text-xs text-flux font-bold hover:underline"
                      >
                        MAX
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="stake-amount"
                        type="number"
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="text-lg h-14 pr-16 border-flux/30 focus-visible:ring-flux"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">FLUX</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Lock Period</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "1week", label: "1 Week" },
                        { id: "1month", label: "1 Month" },
                        { id: "1year", label: "1 Year" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setLockPeriod(p.id)}
                          className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                            lockPeriod === p.id 
                              ? "bg-flux/20 border-flux text-flux font-bold" 
                              : "bg-background/50 border-border/40 hover:border-flux/50"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/40">
                      <p className="text-xs text-muted-foreground mb-1">Daily Rewards</p>
                      <p className="font-bold text-[#54d292]">
                        {stakeAmount ? (parseFloat(stakeAmount) * 0.00034).toFixed(4) : "0.0000"} FLUX
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/40">
                      <p className="text-xs text-muted-foreground mb-1">Selected Period</p>
                      <p className="font-bold capitalize">{lockPeriod.replace("1", "1 ")}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-bold bg-flux hover:bg-flux/90"
                    disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > fluxBalance || isSubmitting}
                    onClick={handleStake}
                  >
                    {isSubmitting ? "Staking..." : "Stake Flux"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unstake">
              <Card className="border-flux/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Unstake FLUX</CardTitle>
                  <CardDescription>Withdraw your staked FLUX back to your main balance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <Label htmlFor="unstake-amount" className="text-sm font-medium">Amount to Unstake</Label>
                      <button 
                        onClick={() => setUnstakeAmount(stakedBalance.toString())}
                        className="text-xs text-flux font-bold hover:underline"
                      >
                        MAX
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="unstake-amount"
                        type="number"
                        placeholder="0.00"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        className="text-lg h-14 pr-16 border-flux/30 focus-visible:ring-flux"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">FLUX</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-bold mb-1">Unstaking Cooldown</p>
                        <p>Once requested, your FLUX will be available in {unstakingPeriod}. During this time, it will not earn rewards.</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full h-14 text-lg font-bold border-flux/30 hover:bg-flux/5 hover:text-flux"
                    disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > stakedBalance || isSubmitting}
                    onClick={handleUnstake}
                  >
                    {isSubmitting ? "Processing..." : "Request Unstake"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Stake History */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <History className="h-5 w-5 text-flux" />
                Stake History
              </CardTitle>
              <CardDescription>Your recent staking activities</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {stakingHistory.length > 0 ? (
              <div className="divide-y divide-border/40">
                {stakingHistory.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        item.type === 'stake' ? 'bg-flux/10 text-flux' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {item.type === 'stake' ? <Lock className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{item.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()} • {item.lock_period ? item.lock_period.replace('1', '1 ') : 'No lock'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{item.amount.toLocaleString()} FLUX</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.status === 'completed' ? 'bg-flux/10 text-flux' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No staking history found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
