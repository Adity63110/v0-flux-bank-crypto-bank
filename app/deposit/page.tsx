"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Check, QrCode } from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"

export default function DepositPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const amount = searchParams.get("amount") || "0"
  const username = searchParams.get("username") || ""
  const address = "GB5sbACrbwQXCTw1yeG5EYSyGSBFroYrvGBccZ35f2aT"
  const [copied, setCopied] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          amount: parseFloat(amount),
          status: "pending"
        }),
      })

      if (response.ok) {
        alert("Deposit submitted for confirmation!")
        router.push("/app")
      } else {
        throw new Error("Failed to submit deposit")
      }
    } catch (error) {
      console.error("Deposit error:", error)
      alert("Failed to submit deposit. Please try again.")
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-flux/20 bg-muted/20 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/app">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">Deposit Flux</CardTitle>
          </div>
          <CardDescription>
            Send exactly <span className="text-flux font-bold">{amount} FLUX</span> to the address below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-4 bg-white rounded-xl">
            <QRCodeSVG value={address} size={200} />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deposit Address</label>
            <div className="relative group">
              <div className="p-3 rounded-xl bg-background border border-flux/20 font-mono text-xs break-all pr-12">
                {address}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={copyToClipboard}
                className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-flux hover:text-black transition-all"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-medium text-flux">{username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount to send:</span>
              <span className="font-medium text-flux">{amount} FLUX</span>
            </div>
            <Button 
              className="w-full bg-flux hover:bg-flux/90 text-black font-bold h-12"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "Processing..." : "I've Sent the Flux"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
