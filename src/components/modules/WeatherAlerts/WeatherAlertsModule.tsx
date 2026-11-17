'use client';

import React from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  CloudSun,
  CloudRain,
  Sun,
  AlertTriangle,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';

export const WeatherAlertsModule: React.FC = () => {
  const { weatherAlerts } = useMandiData();

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case 'Sunny':
        return <Sun className="w-8 h-8 text-amber-500" />;
      case 'Light Rain':
        return <CloudRain className="w-8 h-8 text-sky-500" />;
      case 'Hail Risk':
        return <AlertTriangle className="w-8 h-8 text-rose-500" />;
      default:
        return <CloudSun className="w-8 h-8 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-emerald-700" />
          Agricultural Weather & Harvest Advisory Desk
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Hyper-local Central India agro-meteorological forecasts with direct harvest and grain-drying advisories.
        </p>

        {/* Live Weather Provenance Pill */}
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-900 border border-sky-200 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            Live Agro-Met Meteorological Grid
          </span>
          <span className="text-[11px] text-gray-400">
            Station: Indore Observatory (Lat 22.72°N, Lon 75.86°E) • Open-Meteo & IMD Fallback Supported
          </span>
        </div>
      </div>

      {/* Weather Forecast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {weatherAlerts.map((w) => (
          <Card
            key={w.id}
            className={`p-5 flex flex-col justify-between border-2 ${
              w.alertLevel === 'severe'
                ? 'border-rose-300 bg-rose-50/20'
                : w.alertLevel === 'moderate'
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-emerald-200 bg-white'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    {getWeatherIcon(w.condition)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{w.forecastDay}</h3>
                    <p className="text-xs text-gray-500">{w.date}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    w.alertLevel === 'severe'
                      ? 'red'
                      : w.alertLevel === 'moderate'
                      ? 'amber'
                      : 'green'
                  }
                  size="sm"
                >
                  {w.alertLevel.toUpperCase()}
                </Badge>
              </div>

              {/* Temp & Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl text-center text-xs my-3">
                <div>
                  <span className="text-gray-400 block text-[10px]">Temperature</span>
                  <span className="font-bold text-gray-900">{w.tempMin}° - {w.tempMax}°C</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Humidity</span>
                  <span className="font-bold text-gray-900">{w.humidityPercent}%</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Rainfall</span>
                  <span className="font-bold text-gray-900">{w.rainfallMm} mm</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Harvest Field Impact:</span>
                  <p className="text-gray-600 mt-0.5">{w.impactOnHarvest}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block">Farmer Action Advisory:</span>
                  <p className="text-emerald-950 font-medium mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-200">
                    {w.advisoryNote}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 mt-4 text-[10px] text-gray-400 text-center">
              Source: India Meteorological Department (IMD) Central Zone
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
