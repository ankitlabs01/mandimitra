import { NextResponse } from 'next/server';
import { calculateSellNowVsWait } from '@/lib/calculations';
import { CROPS } from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Crop } from '@/lib/types';
import { getCropRecommendationAdvisory } from '@/lib/ai/nvidiaService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let crop: Crop = CROPS.find((c) => c.id === body.cropId) || CROPS[0];

    // Fetch live crop parameters from Supabase if available
    if (supabase && isSupabaseConfigured && body.cropId) {
      try {
        const { data, error } = await supabase
          .from('crops')
          .select('*')
          .eq('id', body.cropId)
          .maybeSingle();

        if (!error && data) {
          crop = {
            id: data.id,
            name: data.name,
            hindiName: data.hindi_name,
            category: data.category,
            shelfLifeDays: Number(data.shelf_life_days),
            perishabilityIndex: data.perishability_index,
            dailyWeightLossRate: Number(data.daily_weight_loss_rate),
            standardMoisturePercent: Number(data.standard_moisture_percent),
            baseStorageCostPerQuintalPerMonth: Number(data.base_storage_cost_per_quintal_per_month),
            typicalTransportCostPerKmPerQuintal: Number(data.typical_transport_cost_per_km_per_quintal),
          };
        }
      } catch (e) {
        // use memory crop
      }
    }

    const quantityQuintals = Number(body.quantityQuintals) || 50;
    const currentMandiPrice = Number(body.currentMandiPrice) || 5000;
    const forecastPriceAfterDays = Number(body.forecastPriceAfterDays) || 5400;
    const holdingDays = Number(body.holdingDays) || 30;
    const distanceKm = Number(body.distanceKm) || 25;
    const storageType = body.storageType || 'dry_warehouse';
    const language = body.language || 'hi';

    // 1. Compute exact mathematical model breakdown
    const mathResult = calculateSellNowVsWait({
      crop,
      quantityQuintals,
      currentMandiPrice,
      forecastPriceAfterDays,
      holdingDays,
      distanceKm,
      storageType,
    });

    // 2. Fetch AI advisory recommendation (NVIDIA Nemotron or deterministic fallback)
    const advisory = await getCropRecommendationAdvisory({
      cropName: crop.name,
      quantityQuintals,
      currentMandiPrice,
      forecastPriceAfterDays,
      holdingDays,
      distanceKm,
      storageType,
      language,
    });

    return NextResponse.json({
      ...mathResult,
      aiAdvisory: advisory.recommendationText,
      aiProvider: advisory.provider,
      isAiFallback: advisory.isFallback,
    });
  } catch (error) {
    console.error('Decision calculation error:', error);
    return NextResponse.json({ error: 'Decision calculation error' }, { status: 500 });
  }
}
