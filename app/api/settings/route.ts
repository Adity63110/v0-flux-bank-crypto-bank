import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('global_settings')
      .select('value')
      .eq('key', 'flux_price')
      .single();

    if (error) throw error;
    return NextResponse.json({ flux_price: data.value });
  } catch (error) {
    return NextResponse.json({ flux_price: 0.000012 }, { status: 500 });
  }
}
