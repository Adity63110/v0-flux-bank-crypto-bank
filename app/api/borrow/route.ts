import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(req: Request) {
  try {
    const { username, crypto, amount, address } = await req.json()

    if (!username || !crypto || !amount || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("borrow_requests")
      .insert([
        {
          username,
          crypto,
          amount: parseFloat(amount),
          address,
          status: "pending",
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also add to transactions table if it exists
    try {
      await supabase.from("transactions").insert([
        {
          username,
          type: "borrow",
          asset: crypto,
          amount: parseFloat(amount),
          status: "pending",
        },
      ])
    } catch (e) {
      console.warn("Could not add to transactions table:", e)
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Borrow API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
