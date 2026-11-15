import { NextResponse } from 'next/server';
import { WEATHER_ALERTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    station: 'Indore Agro-Met Observatory (Central Plateau)',
    updatedAt: new Date().toISOString(),
    forecasts: WEATHER_ALERTS,
  });
}
