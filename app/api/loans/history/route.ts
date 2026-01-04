import { NextResponse } from "next/server";
import { supabase } from "@/lib/crypto";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // Fetch borrow transactions for this user
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("username", username)
      .eq("type", "borrow")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Error fetching loan history:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
