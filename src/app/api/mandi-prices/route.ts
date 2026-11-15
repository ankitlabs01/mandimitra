import { NextResponse } from 'next/server';
import { INITIAL_PRICES, MANDIS, CROPS } from '@/lib/mockData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cropId = searchParams.get('cropId');
  const mandiId = searchParams.get('mandiId');

  let prices = INITIAL_PRICES;
  if (cropId && cropId !== 'all') {
    prices = prices.filter((p) => p.cropId === cropId);
  }
  if (mandiId && mandiId !== 'all') {
    prices = prices.filter((p) => p.mandiId === mandiId);
  }

  return NextResponse.json({
    count: prices.length,
    mandis: MANDIS,
    crops: CROPS,
    prices,
  });
}
