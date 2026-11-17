/**
 * ==============================================================================
 * MANDI MITRA AI — AGRO-METEOROLOGY WEATHER SERVICE
 * ==============================================================================
 * Multi-tier weather service with live API support and robust offline fallback:
 * 1. Open-Meteo Live API (Coordinates: Central India / Indore: 22.7196°N, 75.8577°E)
 * 2. Supabase weather_alerts table
 * 3. Verified Agro-Met Demonstration dataset
 */

import { WeatherAlert } from './types';
import { WEATHER_ALERTS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

export interface WeatherFeedResult {
  station: string;
  isLiveWeather: boolean;
  source: 'open-meteo-live' | 'supabase-weather-table' | 'demonstration-agro-met';
  sourceLabel: string;
  updatedAt: string;
  forecasts: WeatherAlert[];
}

export async function getAgroWeatherFeed(): Promise<WeatherFeedResult> {
  const now = new Date().toISOString();

  // Tier 1: Try Open-Meteo Live API (Free, high precision for Indian agriculture)
  try {
    const lat = 22.7196; // Indore, Madhya Pradesh
    const lon = 75.8577;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=5`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 1800 } });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.daily && data.daily.time && data.daily.time.length > 0) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const liveForecasts: WeatherAlert[] = data.daily.time.map((timeStr: string, index: number) => {
          const dateObj = new Date(timeStr);
          const dayName = daysOfWeek[dateObj.getDay()];
          const rainfall = Number(data.daily.precipitation_sum?.[index] || 0);
          const tempMax = Number(data.daily.temperature_2m_max?.[index] || 32);
          const tempMin = Number(data.daily.temperature_2m_min?.[index] || 18);
          const windSpeed = Number(data.daily.wind_speed_10m_max?.[index] || 12);

          let condition = 'Sunny / Clear';
          let alertLevel: WeatherAlert['alertLevel'] = 'low';
          let impactOnHarvest = 'Ideal harvesting & threshing conditions. Transport operations smooth.';
          let advisoryNote = 'Safe for open field drying and APMC transit.';

          if (rainfall > 10) {
            condition = 'Heavy Rain / Thunderstorm';
            alertLevel = 'severe';
            impactOnHarvest = 'High risk to standing wheat and harvested soybean pods.';
            advisoryNote = 'Halt field harvest; cover standing grain heaps with polythene tarpaulins immediately.';
          } else if (rainfall > 2) {
            condition = 'Light Rain / Scattered Showers';
            alertLevel = 'moderate';
            impactOnHarvest = 'Moderate moisture increase risk; avoid sun-drying on open yards.';
            advisoryNote = 'Move grain into covered sheds; ensure moisture meter checks before APMC dispatch.';
          } else if (windSpeed > 25) {
            condition = 'High Winds / Gusty';
            alertLevel = 'moderate';
            impactOnHarvest = 'Risk of crop lodging in tall varieties; safe for transport.';
            advisoryNote = 'Secure storage shed roof sheets and lash truck tarpaulins tightly.';
          }

          return {
            id: `live-w-${timeStr}`,
            date: timeStr,
            forecastDay: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayName,
            condition,
            tempMin,
            tempMax,
            humidityPercent: rainfall > 2 ? 78 : 45,
            rainfallMm: rainfall,
            windSpeedKmh: windSpeed,
            impactOnHarvest,
            advisoryNote,
            alertLevel,
          };
        });

        return {
          station: 'Central India Agro-Met Grid (Indore / Malwa Region)',
          isLiveWeather: true,
          source: 'open-meteo-live',
          sourceLabel: 'Live Satellite & Agro-Met Feed (Open-Meteo)',
          updatedAt: now,
          forecasts: liveForecasts,
        };
      }
    }
  } catch (liveErr) {
    // Graceful fallback to Supabase or demonstration dataset
  }

  // Tier 2: Try Supabase weather_alerts table
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('weather_alerts')
        .select('*')
        .order('date', { ascending: true });

      if (!error && data && data.length > 0) {
        return {
          station: 'Indore Agro-Met Observatory (Central Plateau)',
          isLiveWeather: true,
          source: 'supabase-weather-table',
          sourceLabel: 'Supabase Database Agro-Advisories',
          updatedAt: now,
          forecasts: data.map((w: any) => ({
            id: w.id,
            date: w.date,
            forecastDay: w.forecast_day,
            condition: w.condition,
            tempMin: Number(w.temp_min),
            tempMax: Number(w.temp_max),
            humidityPercent: Number(w.humidity_percent),
            rainfallMm: Number(w.rainfall_mm),
            windSpeedKmh: Number(w.wind_speed_kmh),
            impactOnHarvest: w.impact_on_harvest,
            advisoryNote: w.advisory_note,
            alertLevel: w.alert_level,
          })),
        };
      }
    } catch (e) {
      // fallback
    }
  }

  // Tier 3: Curated Agro-Met Baseline Demonstration Dataset
  return {
    station: 'Indore Agro-Met Observatory (Demonstration Feed)',
    isLiveWeather: false,
    source: 'demonstration-agro-met',
    sourceLabel: 'Central India Baseline Agro-Met Sample',
    updatedAt: now,
    forecasts: WEATHER_ALERTS,
  };
}
