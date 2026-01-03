import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { username, amount, address } = await request.json();

    if (!username || !amount || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Record the withdrawal request
    const { data, error } = await supabase
      .from('withdraw')
      .insert([{
        username,
        amount: parseFloat(amount),
        address,
        status: 'pending'
      }])
      .select();

    if (error) throw error;

    // 2. Log as transaction
    await supabase.from('transactions').insert([{
      username,
      type: 'withdraw_request',
      asset: 'FLUX',
      amount: parseFloat(amount),
      status: 'pending',
      description: `Withdrawal request to: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }]);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Withdraw error:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal request' }, { status: 500 });
  }
}
