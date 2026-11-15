import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { cropId = 'crop-soybean', basePrice = 5000, days = 15 } = await req.json();

    const forecasts = Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const lift = Math.round(day * 24 + Math.sin(day) * 30);
      const predictedPrice = basePrice + lift;
      const band = Math.round(predictedPrice * 0.035 + day * 10);

      return {
        day: `Day ${day}`,
        date: new Date(Date.now() + day * 86400000).toISOString().slice(0, 10),
        predictedPrice,
        confidenceMin: predictedPrice - band,
        confidenceMax: predictedPrice + band,
        confidenceScore: Math.max(70, 95 - day * 1.5),
      };
    });

    return NextResponse.json({
      cropId,
      basePrice,
      forecasts,
      recommendation: 'HOLD_SHORT_TERM',
      drivers: [
        'Central India APMC arrival tapering by 12% WoW',
        'Solvent extraction crushing capacity at 82%',
        'Domestic meal export parity favorable',
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Forecast error' }, { status: 500 });
  }
}
