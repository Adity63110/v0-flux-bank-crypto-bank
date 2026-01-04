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
    .from('transactions')
    .select('*')
    .eq('username', username)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }

  return NextResponse.json({ transactions: data || [] });
}
