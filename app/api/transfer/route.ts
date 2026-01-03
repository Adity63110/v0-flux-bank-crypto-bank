import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { from_user, to_username, amount } = await request.json();

    if (!from_user || !to_username || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid transfer details' }, { status: 400 });
    }

    if (from_user === to_username) {
      return NextResponse.json({ error: 'Cannot transfer to yourself' }, { status: 400 });
    }

    // 1. Check if receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('users')
      .select('username, balance')
      .eq('username', to_username)
      .single();

    if (receiverError || !receiver) {
      return NextResponse.json({ error: 'Recipient user not found' }, { status: 404 });
    }

    // 2. Check sender balance
    const { data: sender, error: senderError } = await supabase
      .from('users')
      .select('balance')
      .eq('username', from_user)
      .single();

    if (senderError || !sender || sender.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // 3. Execute transfer (Atomic update)
    // Decrement sender
    const { error: decError } = await supabase
      .from('users')
      .update({ balance: sender.balance - amount })
      .eq('username', from_user);

    if (decError) throw decError;

    // Increment receiver
    const { error: incError } = await supabase
      .from('users')
      .update({ balance: (receiver.balance || 0) + amount })
      .eq('username', to_username);

    if (incError) throw incError;

    // 4. Record transactions
    const transactionData = {
      asset: 'FLUX',
      amount: amount,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    // Sender's transaction
    await supabase.from('transactions').insert([{
      ...transactionData,
      username: from_user,
      type: 'transfer_out',
      description: `Transfer to @${to_username}`
    }]);

    // Receiver's transaction
    await supabase.from('transactions').insert([{
      ...transactionData,
      username: to_username,
      type: 'transfer_in',
      description: `Transfer from @${from_user}`
    }]);

    return NextResponse.json({ message: 'Transfer successful' });

  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
