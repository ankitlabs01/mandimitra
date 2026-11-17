import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getAgriculturalAdvisory } from '@/lib/ai/nvidiaService';

export async function POST(req: Request) {
  try {
    const { message, language = 'hi', history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // 1. Fetch live mandi prices summary from Supabase to ground the AI in actual database records
    let liveMarketContext = '';
    if (supabase && isSupabaseConfigured) {
      try {
        const { data: dbPrices } = await supabase
          .from('mandi_prices')
          .select('crop_name, mandi_name, modal_price, price_change_percent')
          .limit(6);

        if (dbPrices && dbPrices.length > 0) {
          liveMarketContext = dbPrices
            .map(
              (p) =>
                `${p.crop_name} at ${p.mandi_name}: ₹${p.modal_price}/qtl (${
                  p.price_change_percent >= 0 ? '+' : ''
                }${p.price_change_percent}%)`
            )
            .join('; ');
        }
      } catch (err) {
        console.warn('Could not query Supabase for AI market context:', err);
      }
    }

    // 2. Fetch critical weather advisories from Supabase
    let weatherContext = '';
    if (supabase && isSupabaseConfigured) {
      try {
        const { data: weatherData } = await supabase
          .from('weather_alerts')
          .select('forecast_day, condition, alert_level, advisory_note')
          .limit(3);

        if (weatherData && weatherData.length > 0) {
          weatherContext = weatherData
            .map((w) => `${w.forecast_day}: ${w.condition} (${w.alert_level}) - ${w.advisory_note}`)
            .join('; ');
        }
      } catch (err) {
        // fallback
      }
    }

    // 3. Delegate to NVIDIA NIM / Nemotron Service with clean deterministic fallback
    const aiResult = await getAgriculturalAdvisory({
      userMessage: message,
      history,
      language,
      liveMarketContext,
      weatherContext,
    });

    return NextResponse.json({
      reply: aiResult.reply,
      provider: aiResult.provider,
      model: aiResult.model,
      isLiveAI: aiResult.isLiveAI,
      isFallback: aiResult.isFallback,
      statusNote: aiResult.statusNote,
    });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    return NextResponse.json(
      {
        error: 'Error processing agricultural advisory query',
        reply:
          'मंडी मित्र एआई सेवा वर्तमान में स्थानीय विश्लेषण मोड में सक्रिय है। कृपया अपना प्रश्न पुनः पूछें।',
        isFallback: true,
      },
      { status: 500 }
    );
  }
}
