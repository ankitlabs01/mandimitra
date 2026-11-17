import { NextResponse } from 'next/server';
import { getAgroWeatherFeed } from '@/lib/weatherService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const weatherResult = await getAgroWeatherFeed();
    return NextResponse.json(weatherResult);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve agro-met weather data',
        isLiveWeather: false,
        source: 'demonstration-agro-met',
      },
      { status: 500 }
    );
  }
}
