"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Clock, Shield, AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/animations/Reveal"

interface Loan {
  id: string
  crypto: string
  amount: number
  status: string
  created_at: string
}

export default function LoanHistoryPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [email, setEmail] = useState("")
  const [isRepaying, setIsRepaying] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("fluxbank_user")
    if (savedUser) {
      const { username: sUsername } = JSON.parse(savedUser)
      setUsername(sUsername)
      fetchLoans(sUsername)
    }
  }, [])

  const fetchLoans = async (user: string) => {
    try {
      const response = await fetch(`/api/loans/history?username=${user}`)
      if (response.ok) {
        const data = await response.json()
        setLoans(data)
      }
    } catch (error) {
      console.error("Error fetching loans:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRepay = async () => {
    if (!selectedLoan || !email || !username) return;
    if (!email.includes('@')) {
      alert("Please enter a valid email address");
      return;
    }

    setIsRepaying(true);
    try {
      console.log('Submitting repay request:', {
        username,
        amount: selectedLoan.amount,
        email
      });
      const response = await fetch('/api/repay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          amount: selectedLoan.amount,
          email
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Repayment request submitted successfully! We will contact you at your email.");
        setSelectedLoan(null);
        setEmail("");
        fetchLoans(username);
      } else {
        throw new Error(data.error || "Failed to submit repayment");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsRepaying(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-flux" />
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-zinc-400" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app/borrow" className="hover:text-flux transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Image src="/fluxbank-logo.png" alt="FluxBank Logo" width={32} height={32} className="object-contain" />
              <h1 className="text-xl font-bold tracking-tight">Loan History</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Reveal direction="up">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">My Loans</h2>
            <p className="text-muted-foreground">Review your active and past borrowing requests.</p>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 text-flux animate-spin" />
            <p className="text-zinc-500">Loading your loan history...</p>
          </div>
        ) : loans.length > 0 ? (
          <div className="grid gap-4">
            {loans.map((loan, i) => (
              <Reveal key={loan.id} direction="up" delay={i * 50}>
                <Card 
                  className={`border-border/40 bg-card/30 hover:border-flux/30 transition-all overflow-hidden relative cursor-pointer ${
                    selectedLoan?.id === loan.id ? 'ring-2 ring-flux border-flux/50 shadow-lg shadow-flux/10 scale-[1.02]' : ''
                  }`}
                  onClick={() => setSelectedLoan(loan)}
                >
                  <div className="absolute top-0 right-0 p-4">
                     <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-zinc-900/50 border border-white/5">
                        {getStatusIcon(loan.status)}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{loan.status}</span>
                     </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-flux/10 border border-flux/20">
                          <Shield className="h-5 w-5 text-flux" />
                       </div>
                       <div>
                          <CardTitle className="text-lg">{loan.amount} {loan.crypto}</CardTitle>
                          <CardDescription className="text-xs">
                             Taken in: <span className="font-bold text-flux">{loan.crypto}</span> • {new Date(loan.created_at).toLocaleDateString()}
                          </CardDescription>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-2">
                       <div className="text-xs text-zinc-500">
                          Transaction ID: <span className="font-mono">{loan.id.slice(0, 12)}...</span>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal direction="up">
            <Card className="border-dashed border-border/60 bg-transparent py-20">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-full bg-zinc-900 border border-white/5">
                  <Clock className="h-8 w-8 text-zinc-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No Loans Yet</h3>
                  <p className="text-zinc-500 max-w-xs">You haven't borrowed any assets. Your loan history will appear here once you make a request.</p>
                </div>
                <Link href="/app/borrow">
                  <Button variant="outline" className="border-flux/20 text-flux hover:bg-flux/5">
                    Start Borrowing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Reveal>
        )}

        {selectedLoan && (
          <Reveal direction="up">
            <Card className="mt-8 border-flux/30 bg-flux/5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-flux/5 to-transparent pointer-events-none" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-flux" />
                  Repay Loan #{selectedLoan.id.slice(0, 8)}
                </CardTitle>
                <CardDescription>
                  Enter your contact details to receive repayment instructions for {selectedLoan.amount} {selectedLoan.crypto}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-flux" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-flux/20 bg-background/50 focus-visible:ring-flux"
                    />
                  </div>
                  
                  <div className="p-4 rounded-xl bg-background/50 border border-flux/20 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Repayment Amount</span>
                      <span className="font-bold">{selectedLoan.amount} {selectedLoan.crypto}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-flux font-medium uppercase text-[10px] tracking-widest">{selectedLoan.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-border/40 hover:bg-muted"
                    onClick={() => setSelectedLoan(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-[2] h-12 bg-flux hover:bg-flux/90 text-black font-bold"
                    onClick={handleRepay}
                    disabled={!email || isRepaying}
                  >
                    {isRepaying ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    ) : "Confirm Repayment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        )}
      </main>
    </div>
  )
}
