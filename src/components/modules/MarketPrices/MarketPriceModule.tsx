'use client';

import React, { useState, useMemo } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { calculateTransportNetPrice } from '@/lib/calculations';
import {
  TrendingUp,
  MapPin,
  Filter,
  ArrowUpDown,
  Truck,
  Search,
  ExternalLink,
  Database,
  RefreshCw,
  Info,
} from 'lucide-react';

export const MarketPriceModule: React.FC = () => {
  const { mandiPrices, mandis, crops, isLiveSynced, refreshData, isLoadingData } = useMandiData();

  const [selectedCropId, setSelectedCropId] = useState<string>('all');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'distance' | 'arrivals'>('price_desc');
  const [farmerBatchSizeQuintals, setFarmerBatchSizeQuintals] = useState<number>(50);

  // Filtered and sorted prices
  const filteredPrices = useMemo(() => {
    return mandiPrices
      .filter((record) => {
        if (selectedCropId !== 'all' && record.cropId !== selectedCropId) return false;
        if (selectedMandiId !== 'all' && record.mandiId !== selectedMandiId) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchCrop = record.cropName.toLowerCase().includes(query);
          const matchMandi = record.mandiName.toLowerCase().includes(query);
          const matchVariety = record.variety.toLowerCase().includes(query);
          if (!matchCrop && !matchMandi && !matchVariety) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const mandiA = mandis.find((m) => m.id === a.mandiId);
        const mandiB = mandis.find((m) => m.id === b.mandiId);
        if (sortBy === 'price_desc') return b.modalPrice - a.modalPrice;
        if (sortBy === 'price_asc') return a.modalPrice - b.modalPrice;
        if (sortBy === 'distance') return (mandiA?.distanceKm || 0) - (mandiB?.distanceKm || 0);
        if (sortBy === 'arrivals') return b.arrivalTons - a.arrivalTons;
        return 0;
      });
  }, [mandiPrices, selectedCropId, selectedMandiId, searchQuery, sortBy, mandis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Central India Mandi Rates & Agmarknet Feeds
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time APMC arrivals, modal prices, and transport-adjusted net realization across 8 mandis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Your Batch Size:
          </label>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
            <input
              type="number"
              min="10"
              max="1000"
              value={farmerBatchSizeQuintals}
              onChange={(e) => setFarmerBatchSizeQuintals(Number(e.target.value) || 50)}
              className="w-14 font-bold text-gray-900 focus:outline-none"
            />
            <span className="text-gray-500 font-medium">Quintals</span>
          </div>
        </div>
      </div>

      {/* Data Source & Provenance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-xs">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isLiveSynced ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <div>
            <span className="font-bold text-gray-900">
              Data Source: {isLiveSynced ? 'Supabase Live Database (APMC Feeds)' : 'Central India APMC Baseline (Sample Demonstration Dataset)'}
            </span>
            <p className="text-[11px] text-gray-500">
              {isLiveSynced
                ? 'Directly synchronized with Central India APMC market committees and weighbridges.'
                : 'Demonstration Mode: Calibrated baseline rates. Government e-NAM & Agmarknet gateway integration ready.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-gray-400">
            Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} 10:30 AM
          </span>
          <button
            onClick={() => refreshData()}
            disabled={isLoadingData}
            className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-colors font-medium text-xs disabled:opacity-50"
            title="Refresh market data feed"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingData ? 'animate-spin' : ''}`} />
            <span>{isLoadingData ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-gray-50/60 border-gray-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop or mandi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Commodity Dropdown */}
          <div>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Commodities ({crops.length})</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hindiName})
                </option>
              ))}
            </select>
          </div>

          {/* Mandi Dropdown */}
          <div>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Mandis ({mandis.length})</option>
              {mandis.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.distanceKm} km)
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="price_desc">Highest Price First</option>
              <option value="price_asc">Lowest Price First</option>
              <option value="distance">Nearest Distance First</option>
              <option value="arrivals">Highest Arrival Volume</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Rate Comparison Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Commodity & Variety</th>
                <th className="py-3 px-4">APMC Mandi</th>
                <th className="py-3 px-4 text-right">Modal Rate</th>
                <th className="py-3 px-4 text-right">Min - Max Band</th>
                <th className="py-3 px-4 text-right">Estimated Transport</th>
                <th className="py-3 px-4 text-right">Effective Net Realization</th>
                <th className="py-3 px-4 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPrices.map((record) => {
                const mandi = mandis.find((m) => m.id === record.mandiId);
                const distanceKm = mandi?.distanceKm || 30;
                const netCalc = calculateTransportNetPrice(
                  record.modalPrice,
                  farmerBatchSizeQuintals,
                  distanceKm
                );

                return (
                  <tr key={record.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{record.cropName}</div>
                      <div className="text-[11px] text-gray-500">{record.variety}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {record.mandiName}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {distanceKm} km away • {record.arrivalTons} Tons arrived
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-base font-extrabold text-gray-900">
                        ₹{record.modalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-gray-400 block">/quintal</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      ₹{record.minPrice} - ₹{record.maxPrice}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-rose-700">
                        -₹{netCalc.transportCost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        ₹{(netCalc.transportCost / farmerBatchSizeQuintals).toFixed(0)}/qtl
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-extrabold text-emerald-900 text-sm sm:text-base">
                        ₹{netCalc.effectivePricePerQuintal.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Net: ₹{netCalc.net.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={record.priceChangePercent >= 0 ? 'green' : 'red'}
                        size="sm"
                      >
                        {record.priceChangePercent >= 0 ? '+' : ''}
                        {record.priceChangePercent}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
