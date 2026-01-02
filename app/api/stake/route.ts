import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("staking_requests")
      .select("*")
      .eq("username", username)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ history: data || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { username, amount, type, lock_period } = await req.json()

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
      .select("balance, staked_balance, pending_rewards")
      .eq("username", username)
      .maybeSingle()

    if (userError) {
      console.error("User fetch error:", userError)
      throw new Error(`Database error fetching user: ${userError.message}`)
    }

    if (!userData) {
      console.error(`User not found: ${username}`)
      return NextResponse.json({ error: `User "${username}" does not exist. Please make sure you are logged in.` }, { status: 404 })
    }

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
        status: type === 'stake' ? "completed" : "pending", 
        lock_period: type === 'stake' ? lock_period : null
      }])
      .select()

    if (requestError) throw requestError

    // 2. Update user balances if it's a stake (immediate for better UX)
    if (type === "stake") {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          balance: userData.balance - numAmount,
          staked_balance: (userData.staked_balance || 0) + numAmount
        })
        .eq("username", username)
      
      if (updateError) throw updateError
      
      // Also log as transaction
      await supabase.from("transactions").insert([{
        username,
        type: "stake",
        asset: "FLUX",
        amount: numAmount,
        status: "completed",
        description: `Staked ${numAmount} FLUX for ${lock_period}`
      }])
    }

    return NextResponse.json({ success: true, data: requestData })
  } catch (error: any) {
    console.error("Staking API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
