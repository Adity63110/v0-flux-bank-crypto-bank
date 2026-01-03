import { NextResponse } from 'next/server';
import { supabase } from '@/lib/crypto';

export async function GET() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch public transactions' }, { status: 500 });
  }

  return NextResponse.json({ transactions: data || [] });
}
