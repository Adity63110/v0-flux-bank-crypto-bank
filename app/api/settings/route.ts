import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data: priceData } = await supabase
      .from('global_settings')
      .select('value')
      .eq('key', 'flux_price')
      .single();

    const { data: caData } = await supabase
      .from('global_settings')
      .select('value')
      .eq('key', 'ca_contract_address')
      .single();

    return NextResponse.json({ 
      flux_price: priceData?.value || 0.000012,
      ca_contract_address: caData?.value || '8o11wa4qBX8ivTdmXUAyuvo2wTfncADNaMvvzKBcWcDe'
    });
  } catch (error) {
    return NextResponse.json({ 
      flux_price: 0.000012,
      ca_contract_address: '8o11wa4qBX8ivTdmXUAyuvo2wTfncADNaMvvzKBcWcDe'
    }, { status: 500 });
  }
}
