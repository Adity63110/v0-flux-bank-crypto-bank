"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Zap, ArrowUpRight, ArrowDownLeft, Lock, CheckCircle2, Clock } from "lucide-react"

type TransactionType = 'Deposit' | 'Borrow' | 'Stake'
type TransactionStatus = 'Pending' | 'Approved' | 'Completed'

interface Transaction {
  id: string
  type: TransactionType
  asset: string
  amount: string
  status: TransactionStatus
  timestamp: string
  uid: string
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'Deposit', asset: 'SOL', amount: '12.5', status: 'Completed', timestamp: '2 mins ago', uid: 'USER_829' },
  { id: '2', type: 'Borrow', asset: 'USDC', amount: '2,500', status: 'Approved', timestamp: '5 mins ago', uid: 'USER_142' },
  { id: '3', type: 'Stake', asset: 'FLUX', amount: '50,000', status: 'Completed', timestamp: '12 mins ago', uid: 'USER_591' },
  { id: '4', type: 'Deposit', asset: 'BTC', amount: '0.045', status: 'Pending', timestamp: '15 mins ago', uid: 'USER_338' },
  { id: '5', type: 'Borrow', asset: 'USDT', amount: '1,200', status: 'Completed', timestamp: '22 mins ago', uid: 'USER_902' },
  { id: '6', type: 'Stake', asset: 'FLUX', amount: '25,000', status: 'Completed', timestamp: '45 mins ago', uid: 'USER_674' },
]

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Logic for live updates could go here
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'Deposit': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'Borrow': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'Stake': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed': return 'text-green-400'
      case 'Approved': return 'text-cyan-400'
      case 'Pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'Deposit': return <ArrowDownLeft className="h-4 w-4" />
      case 'Borrow': return <ArrowUpRight className="h-4 w-4" />
      case 'Stake': return <Lock className="h-4 w-4" />
    }
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
                      <tr key={tx.id} className="group/row hover:bg-flux/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium ${getTypeColor(tx.type)}`}>
                            {getTypeIcon(tx.type)}
                            {tx.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-sm">
                          {tx.asset}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-muted-foreground">
                          {tx.uid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${getStatusColor(tx.status)}`}>
                            {tx.status === 'Completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {tx.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-muted-foreground">
                          {tx.timestamp}
                        </td>
                      </tr>
                    ))}
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
