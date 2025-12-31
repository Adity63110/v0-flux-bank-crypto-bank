import { NextResponse } from 'next/server';
import { supabase, generateSolanaWallet, encryptPrivateKey } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // 1. Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('username, wallet_address')
      .eq('username', username)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Database error details:', fetchError);
      return NextResponse.json({ error: `Database error: ${fetchError.message}` }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({
        username: existingUser.username,
        wallet_address: existingUser.wallet_address
      });
    }

    // 2. Create new wallet
    const { publicKey, secretKey } = generateSolanaWallet();
    const encryptedKey = encryptPrivateKey(secretKey);

    // 3. Store in Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          username,
          wallet_address: publicKey,
          encrypted_private_key: encryptedKey,
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({
      username: newUser.username,
      wallet_address: newUser.wallet_address
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
