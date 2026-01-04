import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Fetch users with balances
    const { data: users, error } = await supabase
      .from('users')
      .select('username, wallet_address, balance')
      .order('balance', { ascending: false })
      .limit(10);

    if (error) throw error;

    // 2. Fetch current Flux price for display
    const { data: settings } = await supabase
      .from('global_settings')
      .select('value')
      .eq('key', 'flux_price')
      .single();
    
    const fluxPrice = settings?.value ? parseFloat(settings.value) : 0.000012;

    // 3. Format response
    const leaderboard = users.map((user: any, index: number) => {
      // Mask username/wallet
      const maskedUser = user.username 
        ? user.username.length > 8 ? `${user.username.slice(0, 4)}...${user.username.slice(-4)}` : user.username
        : `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`;

      const usdBalance = user.balance * fluxPrice;

      return {
        rank: index + 1,
        user: maskedUser,
        balance: user.balance,
        usdBalance: usdBalance,
        assets: ['FLUX'], // Currently simplified to FLUX
        badge: index < 3 ? 'Whale 🐳' : index < 7 ? 'Shark 🦈' : 'Dolphin 🐬'
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
