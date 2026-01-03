"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Zap, ArrowUpRight, ArrowDownLeft, Lock, CheckCircle2, Clock } from "lucide-react"

type TransactionType = 'deposit' | 'borrow' | 'stake' | 'unstake'
type TransactionStatus = 'pending' | 'approved' | 'completed'

interface Transaction {
  id: string
  type: TransactionType
  asset: string
  amount: string | number
  status: TransactionStatus
  created_at: string
  username: string
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/public-transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error("Error fetching public transactions:", error)
    }
  }

  useEffect(() => {
    fetchTransactions()
    const interval = setInterval(fetchTransactions, 60000)
    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'borrow': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'stake': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      case 'unstake': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-400'
      case 'approved': return 'text-cyan-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit': return <ArrowDownLeft className="h-4 w-4" />
      case 'borrow': return <ArrowUpRight className="h-4 w-4" />
      case 'stake':
      case 'unstake': return <Lock className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const formatTime = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMins = Math.floor((now.getTime() - past.getTime()) / 60000)
    
    if (diffInMins < 1) return 'Just now'
    if (diffInMins === 1) return '1 min ago'
    if (diffInMins < 60) return `${diffInMins} mins ago`
    const diffInHours = Math.floor(diffInMins / 60)
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return past.toLocaleDateString()
  }

  const maskUsername = (username: string) => {
    if (username.length <= 8) return username
    return `${username.slice(0, 4)}...${username.slice(-4)}`
  }

  return (
    <section className="container mx-auto px-4 py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        <Reveal direction="up">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flux/10 border border-flux/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flux opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-flux"></span>
              </span>
              <span className="text-xs font-semibold text-flux uppercase tracking-wider">Live Network Activity</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Recent Transactions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Live activity across the Flux network building transparency and social proof.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-flux/10 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-background/40 backdrop-blur-xl border border-border/50 rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">UID</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {transactions.map((tx, i) => (
                      <tr key={tx.id || i} className="group/row hover:bg-flux/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium ${getTypeColor(tx.type)}`}>
                            {getTypeIcon(tx.type)}
                            {tx.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-sm uppercase">
                          {tx.asset}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-muted-foreground">
                          {maskUsername(tx.username)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${getStatusColor(tx.status)}`}>
                            {tx.status.toLowerCase() === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {tx.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-muted-foreground">
                          {formatTime(tx.created_at)}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                          Waiting for live network activity...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
