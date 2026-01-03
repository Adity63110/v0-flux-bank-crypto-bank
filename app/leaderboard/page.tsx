"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, Crown, Anchor, Waves } from "lucide-react"
import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"
import Image from "next/image"

interface LeaderboardEntry {
  rank: number;
  user: string;
  balance: number;
  usdBalance: number;
  assets: string[];
  badge: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
      case 2: return "text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]";
      case 3: return "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]";
      default: return "text-muted-foreground";
    }
  }

  const getBadgeIcon = (badge: string) => {
    if (badge.includes("Whale")) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (badge.includes("Shark")) return <Anchor className="h-4 w-4 text-blue-400" />;
    return <Waves className="h-4 w-4 text-cyan-400" />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-flux/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/fluxbank-logo.png" alt="Flux Logo" width={32} height={32} />
              <span className="font-bold text-xl">Flux</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flux/10 border border-flux/20 mb-2">
                <Trophy className="h-4 w-4 text-flux" />
                <span className="text-xs font-bold text-flux uppercase tracking-widest">Hall of Fame</span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">FluxBank Leaderboard</h1>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <div className="relative inline-block">
                <p className="text-muted-foreground text-lg">Top accounts powering the FluxBank ecosystem</p>
                <p className="text-flux/80 text-sm font-bold mt-2 animate-pulse">Top 3 accounts will be rewarded</p>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-flux to-transparent opacity-50 blur-[1px] animate-pulse" />
              </div>
            </Reveal>
          </div>

          <Reveal direction="up" delay={300}>
            <Card className="border-flux/20 bg-muted/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-flux/5">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/30">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rank</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Balance</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Assets</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading ranking data...</td>
                          </tr>
                        ))
                      ) : leaderboard.map((entry) => (
                        <tr 
                          key={entry.rank} 
                          className="group hover:bg-flux/5 transition-colors duration-300"
                        >
                          <td className="px-6 py-6">
                            <span className={`text-2xl font-black ${getRankStyle(entry.rank)}`}>
                              #{entry.rank}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="font-mono text-sm font-medium text-white group-hover:text-flux transition-colors">
                              {entry.user}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-flux">
                                ${entry.usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {entry.balance.toLocaleString()} FLUX
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex gap-2">
                              {entry.assets.map(asset => (
                                <div key={asset} className="h-6 w-6 rounded-full bg-background border border-flux/20 flex items-center justify-center p-1">
                                  <Image src="/fluxbank-logo.png" alt={asset} width={16} height={16} />
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border/40 text-xs font-bold">
                              {getBadgeIcon(entry.badge)}
                              {entry.badge}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </main>
      </div>
    </div>
  )
}
