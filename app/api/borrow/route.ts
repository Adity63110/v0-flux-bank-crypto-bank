import { NextResponse } from "next/server"
import { supabase } from "@/lib/crypto"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { username, crypto, amount, address } = await req.json()

    if (!username || !crypto || !amount || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const numAmount = parseFloat(amount)

    // 1. Get user and current settings
    const [{ data: userData, error: userError }, { data: settingsData, error: settingsError }] = await Promise.all([
      supabase.from("users").select("balance").eq("username", username).single(),
      supabase.from("global_settings").select("value").eq("key", "flux_price").single()
    ])

    if (userError || !userData) throw new Error("User not found")
    if (settingsError || !settingsData) throw new Error("Global settings not found")

    const fluxPrice = parseFloat(settingsData.value)
    
    // Calculate precise collateral required based on 30% LTV
    // (Borrowed Amount * Asset Price) / (FLUX Price * 0.3)
    // We'll need the asset price. For now, we'll use the prices from the frontend or a lookup.
    // Since the frontend sends the request, we'll assume a standard price lookup here or expect it in the body.
    // For this implementation, we'll use the price logic requested: (Amount * AssetPrice) / (FluxPrice * 0.3)
    
    const assetPrices: Record<string, number> = {
      "BTC": 90000,
      "ETH": 3000,
      "BSC": 870,
      "SOL": 135,
      "USDC": 1,
      "USDT": 1,
      "TRX": 0.28,
      "TON": 5.2
    }

    const assetPrice = assetPrices[crypto] || 1
    const collateralRequired = (numAmount * assetPrice) / (fluxPrice * 0.3)
    
    if (userData.balance < collateralRequired) {
      return NextResponse.json({ error: "Insufficient FLUX balance for collateral" }, { status: 400 })
    }

    const newBalance = userData.balance - collateralRequired

    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("username", username)

    if (updateError) throw updateError

    // 2. Insert borrow request
    const { data: borrowData, error: borrowError } = await supabase
      .from("borrow_requests")
      .insert([
        {
          username,
          crypto,
          amount: numAmount,
          address,
          status: "pending",
        },
      ])
      .select()

    if (borrowError) throw borrowError

    // 3. Insert transaction record
    try {
      const txData: any = {
        username,
        type: "borrow",
        asset: crypto,
        amount: numAmount,
        status: "pending",
      }
      
      // Only add description if it's likely to succeed, or handle error gracefully
      txData.description = `Borrowed ${numAmount} ${crypto} to ${address.slice(0, 6)}...`

      const { error: txError } = await supabase
        .from("transactions")
        .insert([txData])

      if (txError) {
        console.error("Transaction log error (attempt 1):", txError)
        // Retry without description if that was the error
        if (txError.message.includes("description")) {
          delete txData.description
          await supabase.from("transactions").insert([txData])
        }
      }
    } catch (e) {
      console.error("Critical transaction logging failure:", e)
    }

    return NextResponse.json({ success: true, data: borrowData, newBalance })
  } catch (error: any) {
    console.error("Borrow API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
