import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { username, amount } = await request.json();

    if (!username || !amount) {
      return NextResponse.json({ error: 'Username and amount are required' }, { status: 400 });
    }

    // 1. Get user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Create pending deposit
    const { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .insert([
        {
          username: username,
          amount: parseFloat(amount),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (depositError) {
      console.error('Deposit error:', depositError);
      return NextResponse.json({ error: 'Failed to record deposit' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deposit submitted', deposit });

  } catch (error) {
    console.error('Deposit processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
