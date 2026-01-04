import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { username, amount, email } = await request.json();

    if (!username || !amount || !email) {
      console.log('Missing fields:', { username, amount, email });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Record the repayment request
    const { data, error } = await supabase
      .from('repay')
      .insert([{
        username,
        amount,
        email,
        status: 'pending'
      }])
      .select();

    if (error) throw error;

    // Log as transaction
    await supabase.from('transactions').insert([{
      username,
      type: 'repay_request',
      asset: 'FLUX',
      amount,
      status: 'pending',
      description: `Repayment request (Email: ${email})`
    }]);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Repay error:', error);
    return NextResponse.json({ error: 'Failed to process repayment request' }, { status: 500 });
  }
}
