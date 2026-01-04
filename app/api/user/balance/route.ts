import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('balance, staked_balance, pending_rewards')
    .eq('username', username)
    .single();

  if (error) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ 
    balance: data.balance || 0,
    staked_balance: data.staked_balance || 0,
    pending_rewards: data.pending_rewards || 0
  });
}
