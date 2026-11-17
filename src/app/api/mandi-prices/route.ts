import { NextResponse } from 'next/server';
import { getMandiPricesFeed } from '@/lib/mandiPriceService';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cropId = searchParams.get('cropId');
    const mandiId = searchParams.get('mandiId');

    const feedResult = await getMandiPricesFeed({ cropId, mandiId });

    return NextResponse.json(feedResult);
  } catch (error) {
    console.error('Mandi prices API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve mandi prices feed', isLiveMarketData: false },
      { status: 500 }
    );
  }
}
