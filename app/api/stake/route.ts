import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(req: Request) {
  try {
    const { username, amount, type } = await req.json()

    if (!username || !amount || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Get current user balance
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("balance, staked_balance")
      .eq("username", username)
      .single()

    if (userError || !userData) throw new Error("User not found")

    let updateData = {}
    if (type === "stake") {
      if (userData.balance < numAmount) {
        return NextResponse.json({ error: "Insufficient balance to stake" }, { status: 400 })
      }
      updateData = {
        balance: userData.balance - numAmount,
        staked_balance: (userData.staked_balance || 0) + numAmount
      }
    } else if (type === "unstake") {
      if ((userData.staked_balance || 0) < numAmount) {
        return NextResponse.json({ error: "Insufficient staked balance to unstake" }, { status: 400 })
      }
      // Note: In a real app, unstaking might have a cooldown. 
      // For now, we'll record it as a request.
      // But based on user requirements, let's just record the request for now.
    } else {
      return NextResponse.json({ error: "Invalid operation type" }, { status: 400 })
    }

    // 1. Record the request
    const { data: requestData, error: requestError } = await supabase
      .from("staking_requests")
      .insert([{
        username,
        amount: numAmount,
        type,
        status: "pending"
      }])
      .select()

    if (requestError) throw requestError

    // 2. Update user balances if it's a stake (immediate for better UX)
    // For unstake, we usually wait for the cooldown, so we won't update balance yet.
    if (type === "stake") {
      const { error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("username", username)
      
      if (updateError) throw updateError
      
      // Also log as transaction
      await supabase.from("transactions").insert([{
        username,
        type: "stake",
        asset: "FLUX",
        amount: numAmount,
        status: "completed",
        description: `Staked ${numAmount} FLUX`
      }])
    }

    return NextResponse.json({ success: true, data: requestData })
  } catch (error: any) {
    console.error("Staking API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
