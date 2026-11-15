'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  ShieldAlert,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  Database,
  Users,
  CreditCard,
} from 'lucide-react';

export const AdminDashboardModule: React.FC = () => {
  const { mandis, crops, mandiPrices, addMandiPriceRecord, disputes, resolveDispute } = useMandiData();

  const [selectedCropId, setSelectedCropId] = useState('crop-soybean');
  const [selectedMandiId, setSelectedMandiId] = useState('mandi-indore');
  const [modalPrice, setModalPrice] = useState(5080);
  const [minPrice, setMinPrice] = useState(4800);
  const [maxPrice, setMaxPrice] = useState(5250);
  const [arrivalTons, setArrivalTons] = useState(1400);
  const [recordAdded, setRecordAdded] = useState(false);

  const handleAddPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const crop = crops.find((c) => c.id === selectedCropId);
    const mandi = mandis.find((m) => m.id === selectedMandiId);
    if (!crop || !mandi) return;

    addMandiPriceRecord({
      mandiId: mandi.id,
      mandiName: mandi.name,
      cropId: crop.id,
      cropName: crop.name,
      variety: 'Machine Clean Certified Batch',
      minPrice,
      maxPrice,
      modalPrice,
      arrivalTons,
      date: new Date().toISOString().slice(0, 10),
      priceChangePercent: 2.5,
    });

    setRecordAdded(true);
    setTimeout(() => setRecordAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          Mandi Mitra System Administration & Feed Operations
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Admin Control Center for APMC price ingestion, dispute resolution, and escrow settlement audit.
        </p>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-l-4 border-l-amber-500">
          <span className="text-xs text-gray-500 block">Total Active Farmers</span>
          <div className="text-2xl font-black text-gray-900 mt-1">12,480</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Across 14 Districts
          </span>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
          <span className="text-xs text-gray-500 block">Connected APMC Mandis</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{mandis.length} Mandis</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Agmarknet Automated Polling
          </span>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-sky-600">
          <span className="text-xs text-gray-500 block">Total Escrow Processed</span>
          <div className="text-2xl font-black text-gray-900 mt-1">₹4.82 Cr</div>
          <span className="text-[11px] text-sky-700 font-semibold mt-1 block">
            Zero Default Guarantee
          </span>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-purple-600">
          <span className="text-xs text-gray-500 block">Open Disputes</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{disputes.length} Cases</div>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
            Under Legal Review
          </span>
        </Card>
      </div>

      {/* Manual APMC Price Ingestion Form */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-700" />
            Inject / Update APMC Mandi Spot Rate Feed
          </h3>
          {recordAdded && (
            <Badge variant="green" size="sm">
              Feed Ingested Live!
            </Badge>
          )}
        </div>

        <form onSubmit={handleAddPrice} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Select Mandi APMC
              </label>
              <select
                value={selectedMandiId}
                onChange={(e) => setSelectedMandiId(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold"
              >
                {mandis.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Select Commodity
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Modal Rate (₹/qtl)
              </label>
              <input
                type="number"
                required
                value={modalPrice}
                onChange={(e) => setModalPrice(Number(e.target.value))}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Min Price (₹/qtl)
              </label>
              <input
                type="number"
                required
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Max Price (₹/qtl)
              </label>
              <input
                type="number"
                required
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Arrivals (Tons)
              </label>
              <input
                type="number"
                required
                value={arrivalTons}
                onChange={(e) => setArrivalTons(Number(e.target.value))}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Publish Rate Record to Public API
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
