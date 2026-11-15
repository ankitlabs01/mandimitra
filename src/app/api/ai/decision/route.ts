import { NextResponse } from 'next/server';
import { calculateSellNowVsWait } from '@/lib/calculations';
import { CROPS } from '@/lib/mockData';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const crop = CROPS.find((c) => c.id === body.cropId) || CROPS[0];

    const result = calculateSellNowVsWait({
      crop,
      quantityQuintals: body.quantityQuintals || 50,
      currentMandiPrice: body.currentMandiPrice || 5000,
      forecastPriceAfterDays: body.forecastPriceAfterDays || 5400,
      holdingDays: body.holdingDays || 30,
      distanceKm: body.distanceKm || 25,
      storageType: body.storageType || 'dry_warehouse',
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Decision calculation error' }, { status: 500 });
  }
}
