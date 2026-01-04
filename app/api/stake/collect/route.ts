import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // 1. Get current rewards
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('balance, pending_rewards')
      .eq('username', username)
      .single();

    if (fetchError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const rewards = userData.pending_rewards || 0;

    if (rewards <= 0) {
      return NextResponse.json({ error: 'No rewards to collect' }, { status: 400 });
    }

    // 2. Update balance and clear pending rewards
    const { error: updateError } = await supabase
      .from('users')
      .update({
        balance: (userData.balance || 0) + rewards,
        pending_rewards: 0
      })
      .eq('username', username);

    if (updateError) {
      throw updateError;
    }

    // 3. Record transaction
    await supabase.from('transactions').insert([{
      username,
      type: 'collect_reward',
      asset: 'FLUX',
      amount: rewards,
      status: 'completed',
      description: `Collected ${rewards.toFixed(4)} FLUX staking rewards`
    }]);

    return NextResponse.json({ 
      success: true, 
      collected_amount: rewards,
      new_balance: (userData.balance || 0) + rewards
    });
  } catch (error: any) {
    console.error('Collect rewards error:', error);
    return NextResponse.json({ error: 'Failed to collect rewards' }, { status: 500 });
  }
}
